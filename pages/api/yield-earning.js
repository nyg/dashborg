import { PrismaClient, Decimal } from '@prisma/client'

// TODO
// - put yield transfer in ledger?
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
        balance: new Decimal(0),
        transfered: transfer.amount
      }

      return transfers
    }, {})

  /* Arrange earnings by date, asset and account and compute daily balances. */

  const earningsByDate = earnings
    .reduce((earnings, earning) => {

      const asset = earning.asset.code
      const today = earning.time.getTime()
      const yesterday = new Date(today - 86_400_000).getTime()

      // init keys
      earnings[today] ??= {}
      earnings[today][asset] ??= {}

      // compute the total balance of the previous day for the current asset
      const accounts = Object.keys(earnings[yesterday][asset])
      const totalBalance = accounts.reduce((totalBalance, account) =>
        totalBalance
          .plus(earnings[yesterday][asset][account].balance)
          .plus(earnings[yesterday][asset][account].transfered),
        new Decimal(0))

      // compute today's balance for each account
      accounts.forEach(account => {

        // init account balance
        earnings[today][asset][account] ??= {
          balance: new Decimal(0),
          transfered: new Decimal(0)
        }

        // today's balance = yesterday's balance
        //                 + yesterday's transfered amount if any
        //                 + daily yield earning pro rata of yesterday's account balance
        const yesterdayBalance = earnings[yesterday][asset][account].balance.plus(earnings[yesterday][asset][account].transfered)
        earnings[today][asset][account].balance = yesterdayBalance.plus(yesterdayBalance.dividedBy(totalBalance).times(earning.amount))

        // update last date for which yield was received for the account
        transfersByAsset[asset][account].endDate = today
      })

      return earnings
    }, transfersByDate)

  /* Prepare data for UI. */

  const data = {}
  Object.keys(transfersByAsset).forEach(asset => {

    data[asset] = {}
    Object.keys(transfersByAsset[asset]).forEach(account => {

      // add the endDate at the end of the startDates array
      transfersByAsset[asset][account].startDates.push(transfersByAsset[asset][account].endDate)
      transfersByAsset[asset][account] = transfersByAsset[asset][account].startDates

      let totalDayCount = new Decimal(0)
      let totalTransfered = new Decimal(0)
      let firstBalance, lastBalance

      data[asset][account] = transfersByAsset[asset][account].map((startDate, index, dates) => {

        // last row shows the total values for all periods
        if (index == dates.length - 1) {
          const yieldEarned = lastBalance.minus(totalTransfered)
          return {
            dayCount: totalDayCount,
            transfered: totalTransfered,
            startBalance: firstBalance,
            endBalance: lastBalance,
            yieldEarned: yieldEarned,
            dailyAverage: yieldEarned.dividedBy(totalDayCount)
          }
        }

        const endDate = dates[index + 1]
        const dayCount = new Decimal((endDate - startDate) / 86_400_000)
        const transfered = earningsByDate[startDate][asset][account].transfered
        const startBalance = earningsByDate[startDate][asset][account].balance.plus(transfered)
        const endBalance = earningsByDate[endDate][asset][account].balance
        const yieldEarned = endBalance.minus(startBalance)

        totalDayCount = totalDayCount.plus(dayCount)
        totalTransfered = totalTransfered.plus(transfered)
        firstBalance ??= startBalance
        lastBalance = endBalance

        return {
          startDate: startDate,
          endDate: endDate,
          dayCount: dayCount,
          transfered: transfered,
          startBalance: startBalance,
          endBalance: endBalance,
          yieldEarned: yieldEarned,
          dailyAverage: yieldEarned.dividedBy(dayCount)
        }
      })
    })
  })

  res.status(200).json({ status: 'Success', earnings: data })
}
