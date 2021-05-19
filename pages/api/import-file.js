import formidable from 'formidable'
import ExcelJS from 'exceljs'
import { PrismaClient } from '@prisma/client'


export const config = {
  api: { bodyParser: false }
}

async function importAccountStatement(path) {

  // connect to db
  const prisma = new PrismaClient()
  await prisma.$connect()

  // clean db
  await prisma.ledgerEntry.deleteMany()
  await prisma.ledgerEntryType.deleteMany()
  await prisma.$executeRaw('UPDATE sqlite_sequence SET seq = 0 WHERE name = "LedgerEntry" OR name = "LedgerEntryType"')

  // parse excel file and insert data into db
  const workbook = new ExcelJS.stream.xlsx.WorkbookReader(path)
  let rowsInserted = 0

  for await (const worksheet of workbook) {

    let balances = {}

    for await (const row of worksheet) {

      if (row.number == 1) {
        console.info(`User id is ${row.getCell(2)}.`)
      }

      if (row.number % 1000 == 0) {
        console.info(`Processed ${row.number} rows.`)
      }

      if (row.number < 10) {
        continue
      }

      let type = row.getCell(3).value
      const currency = row.getCell(4).value
      const netAmount = row.getCell(9).value

      // differentiate between yield earnings and referal rewards
      if (type == 'Earnings') {
        type = row.getCell(11).value == 'Yield earnings' ? 'Yield' : 'Reward'
      }

      // compute the balance of each asset
      const decrease = type == 'Withdrawals' || type == 'Sell'
      balances[currency] = (balances[currency] ? balances[currency] : 0) + (decrease ? -netAmount : netAmount)

      await prisma.ledgerEntry.create({
        data: {
          time: new Date(row.getCell(2).value + 'Z'),
          type: { connectOrCreate: { where: { value: type }, create: { value: type } } },
          asset: { connect: { code: currency } },
          amount: netAmount,
          fee: row.getCell(7).value,
          balance: balances[currency]
        }
      })

      rowsInserted++
    }
  }

  await prisma.$disconnect()
  return rowsInserted
}

async function importYieldTransactions(path) {

  // parse excel file and insert data into db
  const workbook = new ExcelJS.stream.xlsx.WorkbookReader(path)
  let rowsInserted = 0
  let transfers = []

  for await (const worksheet of workbook) {

    for await (const row of worksheet) {

      if (row.number == 1) {
        const correctHeader = row.getCell(1) == 'Completion Date'
          && row.getCell(2) == 'Account'
          && row.getCell(3) == 'Asset'
          && row.getCell(4) == 'Amount'
        if (!correctHeader) {
          throw Error('Incorrect header')
        }

        // skip first row
        continue
      }

      if (row.number % 10 == 0) {
        console.info(`Processed ${row.number} rows.`)
      }

      const completionDate = new Date((row.getCell(1).value - 25569) * 86400 * 1000 + (new Date(0).getTimezoneOffset() * 60 * 1000))
      const account = row.getCell(2).value ?? 'Main'
      const asset = row.getCell(3).value
      const amount = row.getCell(4).value

      transfers.push({
        completionDate: completionDate,
        account: account,
        asset: asset,
        amount: amount
      })

      rowsInserted++
    }
  }

  // order by account, asset & date
  transfers.sort((a, b) =>
    a.account.localeCompare(b.account)
    || a.asset.localeCompare(b.asset)
    || a.completionDate.getTime() - b.completionDate.getTime())

  // make sure that for the same account, asset and date there is only one transfer
  transfers = transfers.slice(1).reduce((transfers, transfer, index) => {

    const previousTransfer = transfers[transfers.length - 1]
    const sameAccountAssetDate = previousTransfer.account == transfer.account
      && previousTransfer.asset == transfer.asset
      && previousTransfer.completionDate.getTime() == transfer.completionDate.getTime()

    if (sameAccountAssetDate) {
      previousTransfer.amount += transfer.amount
    }
    else {
      transfers.push(transfer)
    }

    return transfers
  }, [transfers[0]])

  // connect to db
  const prisma = new PrismaClient()
  await prisma.$connect()

  // clean db
  await prisma.yieldTransfer.deleteMany()
  await prisma.$executeRaw('UPDATE sqlite_sequence SET seq = 0 WHERE name = "YieldTransfer"')

  // insert all transfers
  for (const transfer of transfers) {
    await prisma.yieldTransfer.create({
      data: {
        completionDate: transfer.completionDate,
        account: transfer.account,
        asset: { connect: { code: transfer.asset } },
        amount: transfer.amount
      }
    })
  }

  await prisma.$disconnect()
  return rowsInserted
}

export default async (req, res) => {

  try {
    // parse the uploaded file from the request
    const form = formidable({ uploadDir: './uploads', keepExtensions: true })
    const file = await new Promise((resolve, reject) =>
      form.parse(req, (err, _, file) => err && reject(err) || resolve(file)))

    // import file data into the database depending on the input tag's name
    let rowsInserted = 0
    if (file.hasOwnProperty('account-statement')) {
      rowsInserted = await importAccountStatement(file['account-statement'].path)
    }
    else if (file.hasOwnProperty('yield-transfers')) {
      rowsInserted = await importYieldTransactions(file['yield-transfers'].path)
    }
    else {
      throw Error('Unknown file')
    }

    console.info(`Inserted ${rowsInserted} rows`)
    res.status(200).json({ message: `Successfuly imported ${rowsInserted} entries!` })
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error uploading file' })
  }
}
