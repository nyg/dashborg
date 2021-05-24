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
    earnings = (
      <Fragment>
        {Object.keys(data.earnings).map(asset =>
          <Fragment key={asset}>
            {Object.keys(data.earnings[asset]).map(account => {
              const totalRow = data.earnings[asset][account].pop()
              return (
                <table key={`${asset}-${account}`} className="w-full">
                  <caption>{asset} — {account}</caption>
                  <thead>
                    <tr className="text-right">
                      <th colSpan={4}>Period</th>
                      <th colSpan={2}>Balance</th>
                      <th rowSpan={2}>Yield earned</th>
                      <th rowSpan={2}>Daily average</th>
                      <th rowSpan={2}>Approx rate</th>
                    </tr>
                    <tr className="text-right">
                      <th className="text-left">Start</th>
                      <th className="text-left">End</th>
                      <th>Days</th>
                      <th>Transfered</th>
                      <th>Start</th>
                      <th>End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.earnings[asset][account].map(period => (
                      <tr key={period.startDate}>
                        <td>{format.asLongDate(period.startDate)}</td>
                        <td>{format.asLongDate(period.endDate)}</td>
                        <td className="num-cell">{period.dayCount}</td>
                        <td className="num-cell">{format.asDecimal(period.transfered)}</td>
                        <td className="num-cell">{format.asDecimal(period.startBalance)}</td>
                        <td className="num-cell">{format.asDecimal(period.endBalance)}</td>
                        <td className="num-cell">{format.asDecimal(period.yieldEarned)}</td>
                        <td className="num-cell">{format.asDecimal(period.dailyAverage)}</td>
                        <td className="num-cell"></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th></th>
                      <th></th>
                      <th className="num-cell">{totalRow.dayCount}</th>
                      <th className="num-cell">{format.asDecimal(totalRow.transfered)}</th>
                      <th className="num-cell">{format.asDecimal(totalRow.startBalance)}</th>
                      <th className="num-cell">{format.asDecimal(totalRow.endBalance)}</th>
                      <th className="num-cell">{format.asDecimal(totalRow.yieldEarned)}</th>
                      <th className="num-cell">{format.asDecimal(totalRow.dailyAverage)}</th>
                      <th className="num-cell"></th>
                    </tr>
                  </tfoot>
                </table>
              )
            })}
          </Fragment>
        )}
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
