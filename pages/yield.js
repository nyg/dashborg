import { Fragment } from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import Layout from '../components/layout'
import * as format from '../utils/format'

export default function Yield() {

  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR('/api/yield-earning', fetcher)

  let earnings
  if (error) {
    earnings = <div className="text-center pt-4">Failed to load data!</div>
  }
  else if (!data) {
    earnings = <div className="text-center pt-4">Loading data…</div>
  }
  else {
    console.dir(Object.keys(data.periods))
    earnings = (
      <Fragment>
        {Object.keys(data.periods).map(asset => (
          <Fragment key={asset}>
            {Object.keys(data.periods[asset]).map(account => {
              let totalDayCount = 0
              let totalSubscription = 0
              let totalYieldEarned = 0
              let firstBalance
              let lastBalance
              return (
                <table key={`${asset}-${account}`} className="w-full">
                  <caption>{asset} — {account}</caption>
                  <thead>
                    <tr className="text-right">
                      <th className="text-left">From</th>
                      <th className="text-left">To</th>
                      <th>Days</th>
                      <th>Subscription</th>
                      <th>Start balance</th>
                      <th>End balance</th>
                      <th>Yield earned</th>
                      <th>Daily average</th>
                      <th>Approx rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.periods[asset][account].startDates.map((startDate, index, startDates) => {

                      const endDate = index + 1 < startDates.length ? startDates[index + 1] : data.periods[asset][account].endDate
                      const transfered = data.earnings[startDate][asset][account].transfered
                      const balanceFrom = data.earnings[startDate][asset][account].balance + transfered
                      const balanceTo = data.earnings[endDate][asset][account].balance
                      const yieldEarned = balanceTo - balanceFrom
                      const dayCount = (endDate - startDate) / 86_400_000

                      totalDayCount += dayCount
                      totalSubscription += transfered
                      totalYieldEarned += yieldEarned
                      firstBalance ??= balanceFrom
                      lastBalance = balanceTo

                      return (
                        <tr key={index}>
                          <td>{format.asLongDate(startDate)}</td>
                          <td>{format.asLongDate(endDate)}</td>
                          <td className="num-cell">{dayCount}</td>
                          <td className="num-cell">{format.asDecimal(transfered)}</td>
                          <td className="num-cell">{format.asDecimal(balanceFrom)}</td>
                          <td className="num-cell">{format.asDecimal(balanceTo)}</td>
                          <td className="num-cell">{format.asDecimal(yieldEarned)}</td>
                          <td className="num-cell">{format.asDecimal(yieldEarned / dayCount)}</td>
                          <td className="num-cell"></td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th></th>
                      <th></th>
                      <th className="num-cell">{totalDayCount}</th>
                      <th className="num-cell">{format.asDecimal(totalSubscription)}</th>
                      <th className="num-cell">{format.asDecimal(firstBalance)}</th>
                      <th className="num-cell">{format.asDecimal(lastBalance)}</th>
                      <th className="num-cell">{format.asDecimal(totalYieldEarned)}</th>
                      <th className="num-cell">{format.asDecimal(totalYieldEarned / totalDayCount)}</th>
                      <th className="num-cell"></th>
                    </tr>
                  </tfoot>
                </table>
              )
            })}
          </Fragment>
        ))}
      </Fragment>
    )
  }

  return (
    <Layout>
      <Head>
        <title>Yield Earnings</title>
      </Head>
      <div className="space-y-12">
        {earnings}
      </div>
    </Layout>
  )
}
