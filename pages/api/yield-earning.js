import { PrismaClient } from '@prisma/client'

// TODO
// - put yield transfer in ledger?
// - keep use of Decimal.js
export default async (req, res) => {

  const prisma = new PrismaClient()
  await prisma.$connect()

  /* Retrieve yield transfers and earnings from database. */

  const transfers = await prisma
    .yieldTransfer.findMany({
      select: {
        completionDate: true,
        account: true,
        asset: { select: { code: true } },
        amount: true
      },
      orderBy: { completionDate: 'asc' }
    })

  const earnings = await prisma
    .ledgerEntry.findMany({
      select: {
        time: true,
        asset: { select: { code: true } },
        amount: true
      },
      where: { type: { value: 'Yield' } },
      orderBy: { time: 'asc' }
    })

  await prisma.$disconnect()

  /* Arrange transfer dates by asset and account. */

  const transfersByAsset = transfers
    .reduce((transfers, transfer) => {

      // init keys
      transfers[transfer.asset.code] ??= {}
      transfers[transfer.asset.code][transfer.account] ??= { startDates: [] }

      transfers[transfer.asset.code][transfer.account].startDates.push(transfer.completionDate.getTime())
      return transfers
    }, {})


  /* Arrange transfers by date, asset and account. */

  const transfersByDate = transfers
    .reduce((transfers, transfer) => {

      const date = transfer.completionDate.getTime()
      const asset = transfer.asset.code

      // init keys
      transfers[date] ??= {}
      transfers[date][asset] ??= {}
      transfers[date][asset][transfer.account] ??= {}

      transfers[date][asset][transfer.account] = {
        balance: 0,
        transfered: transfer.amount.toNumber()
      }

      return transfers
    }, {})

  /* Arrange earnings by date, asset and account. */

  const earningsByDate = earnings
    .reduce((earnings, earning) => {

      const asset = earning.asset.code
      const today = earning.time.getTime()
      const yesterday = new Date(today - 86_400_000).getTime()

      // compute the balance of all accounts for the previous day and current asset
      const accounts = Object.keys(earnings[yesterday][asset])
      const totalBalance = accounts.reduce((totalBalance, account) =>
        totalBalance + earnings[yesterday][asset][account].balance + earnings[yesterday][asset][account].transfered, 0)

      // init keys
      earnings[today] ??= {}
      earnings[today][asset] ??= {}

      accounts.forEach(account => {

        // init account balance
        earnings[today][asset][account] ??= {
          balance: 0,
          transfered: 0
        }

        // today's balance = yesterday's balance
        //                 + yesterday's transfered amount if any
        //                 + daily yield earning pro rata of yesterday's account balance
        const yesterdayBalance = earnings[yesterday][asset][account].balance + earnings[yesterday][asset][account].transfered
        earnings[today][asset][account].balance = yesterdayBalance
          + (yesterdayBalance / totalBalance) * earning.amount.toNumber()

        // update last date for which yield was received for the account
        transfersByAsset[asset][account].endDate = today
      })

      return earnings
    }, transfersByDate)

  res.status(200).json({ status: 'Success', periods: transfersByAsset, earnings: earningsByDate })
}
