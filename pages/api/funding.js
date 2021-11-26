import { PrismaClient } from '@prisma/client'


export default async (req, res) => {

  const prisma = new PrismaClient()
  await prisma.$connect()

  const funding = (await prisma.ledgerEntry
    .findMany({
      select: {
        type: { select: { value: true } },
        asset: { select: { code: true } },
        time: true,
        amount: true,
        fee: true,
        balance: true,
      },
      where: {
        OR: [
          { type: { value: 'Deposit' } },
          { type: { value: 'Withdrawal' } },
          { type: { value: 'Reward' } },
        ]
      },
      orderBy: [{ assetId: 'asc' }, { time: 'asc' }],
    }))
    .reduce((funding, entry) => {

      funding[entry.asset.code] ??= []
      funding[entry.asset.code].push({
        time: entry.time.getTime(),
        type: entry.type.value,
        amount: entry.amount,
        fee: entry.fee,
        balance: entry.balance,
      })

      return funding
    }, {})

  await prisma.$disconnect()
  res.status(200).json({ status: 'success', funding: funding })
}
