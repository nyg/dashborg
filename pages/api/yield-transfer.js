import { PrismaClient } from '@prisma/client'


export default async (req, res) => {

  const prisma = new PrismaClient()
  await prisma.$connect()

  const transfers = (await prisma.yieldTransfer
    .findMany({
      orderBy: { completionDate: 'asc' },
      select: {
        completionDate: true,
        account: true,
        asset: { select: { code: true } },
        amount: true
      }
    }))
    .reduce((transfers, transfer) => {

      // init keys
      transfers[transfer.asset.code] ??= {}
      transfers[transfer.asset.code][transfer.account] ??= []

      transfers[transfer.asset.code][transfer.account].push({
        completionDate: transfer.completionDate.getTime(),
        amount: transfer.amount
      })

      return transfers
    }, {})

  await prisma.$disconnect()
  res.status(200).json({ status: 'success', transfers: transfers })
}
