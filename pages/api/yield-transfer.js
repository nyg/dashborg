import { PrismaClient } from '@prisma/client'


export default async (req, res) => {

  const prisma = new PrismaClient()
  await prisma.$connect()

  const yieldTransfers = await prisma.yieldTransfer.findMany({
    orderBy: { assetId: 'asc' },
    select: {
      completionDate: true,
      account: true,
      asset: { select: { code: true } },
      amount: true
    }
  })

  res.status(200).json({ status: 'success', yieldTransfers: yieldTransfers })
}
