import { PrismaClient } from '@prisma/client'


export default async (req, res) => {

  const prisma = new PrismaClient()
  await prisma.$connect()

  if (req.method === 'POST') {

    // NTUI lol
    const r = await prisma.yieldTransfer.create({
      data: {
        activeSince: req.body['activation-date'],
        ccy: { connect: { code: req.body.asset } },
        amout: req.body.amount
      }
    })

    res.status(200).json({ status: 'Success', r: r })
  }
  else {

    const subscriptions = await prisma.yieldTransfer.findMany({
      orderBy: { assetId: 'asc' },
      select: {
        activeSince: true,
        asset: { select: { code: true } },
        amount: true
      }
    })

    res.status(200).json({ status: 'Success', subscriptions: subscriptions })
  }
}
