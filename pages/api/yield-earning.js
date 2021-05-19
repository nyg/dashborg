import { PrismaClient } from '@prisma/client'


export default async (req, res) => {

  const prisma = new PrismaClient()
  await prisma.$connect()

  const earnings = await prisma.ledgerEntry.findMany({
    where: {
      type: { value: 'Yield' }
    },
    select: {
      time: true,
      ccy: { select: { code: true } },
      amount: true
    }
  })

  res.status(200).json({ status: 'Success', earnings: earnings })


  // const ledger = sb.getLedgerEntries(wb)
  // const allEarnings = sb.getEarnings(ledger)
  // const assets = [...new Set(allEarnings.map(f => f.currency))]

  // const earnings = assets.map(asset => {

  //   const assetEarnings = allEarnings.filter(e => e.currency == asset)
  //   const dayCount = assetEarnings.length
  //   const totalEarned = assetEarnings.reduce((acc, e) => acc + e.netAmount, 0)

  //   return {
  //     asset: asset,
  //     dayCount: dayCount,
  //     totalEarned: totalEarned.toFixed(2),
  //     dailyAverage: (totalEarned / dayCount).toFixed(2),
  //     yearlyEstimate: (totalEarned / dayCount * 365).toFixed(2)
  //   }
  // })
}