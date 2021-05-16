import formidable from 'formidable'
import ExcelJS from 'exceljs'
import { PrismaClient } from '@prisma/client'


export const config = {
  api: { bodyParser: false }
}

export default async (req, res) => {

  try {
    // parse file from form data
    const form = formidable({ uploadDir: './uploads', keepExtensions: true })
    const file = await new Promise((resolve, reject) =>
      form.parse(req, (err, _, file) => err && reject(err) || resolve(file)))

    switch (file) {
      case 'account-statement':
        break
      case 'yield-transactions':
        break
      default:
        // unknown file
        break
    }


    // connect to db
    const prisma = new PrismaClient()
    await prisma.$connect()

    await prisma.ledgerEntry.deleteMany()
    await prisma.ledgerEntryType.deleteMany()
    await prisma.$executeRaw('UPDATE sqlite_sequence SET seq = 0 WHERE name = "LedgerEntry" OR name = "LedgerEntryType"')

    // parse excel file and insert data into db
    const workbook = new ExcelJS.stream.xlsx.WorkbookReader(file.fileChooser.path)
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

      // ignore other worksheets
      break
    }

    await prisma.$disconnect()
    console.info(`Inserted ${rowsInserted} rows`)
    res.status(200).json({ status: `Successfuly imported ${rowsInserted} entries!` })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ status: 'Error uploading file' })
  }
}
