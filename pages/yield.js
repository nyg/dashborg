import { Fragment } from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import Layout from '../components/layout'
import * as format from '../utils/format'
import TdNum from '../components/td-num'

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
                <table key={`${asset}-${account}`}>
                  <caption>{asset} — {account}</caption>
                  <thead className="text-right">
                    <tr>
                      <th colSpan={4} className="v-sep">Period</th>
                      <th colSpan={2} className="v-sep">Balance</th>
                      <th colSpan={3} className="pr-2">Yield</th>
                    </tr>
                    <tr>
                      <th>Start</th>
                      <th>End</th>
                      <th>Days</th>
                      <th className="v-sep">Transfered</th>
                      <th>Start</th>
                      <th className="v-sep">End</th>
                      <th>Earned</th>
                      <th>Average</th>
                      <th className="pr-2">APY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.earnings[asset][account].map(period => (
                      <tr key={period.startDate}>
                        <td className="text-right">{format.asLongDate(period.startDate)}</td>
                        <td className="text-right">{format.asLongDate(period.endDate)}</td>
                        <TdNum>{period.dayCount}</TdNum>
                        <TdNum className="v-sep">{period.transfered}</TdNum>
                        <TdNum>{period.startBalance}</TdNum>
                        <TdNum className="v-sep">{period.endBalance}</TdNum>
                        <TdNum>{period.yieldEarned}</TdNum>
                        <TdNum>{period.dailyAverage}</TdNum>
                        <td className="pr-2"></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th></th>
                      <th></th>
                      <TdNum>{totalRow.dayCount}</TdNum>
                      <TdNum className="v-sep">{totalRow.transfered}</TdNum>
                      <TdNum>{totalRow.startBalance}</TdNum>
                      <TdNum className="v-sep">{totalRow.endBalance}</TdNum>
                      <TdNum>{totalRow.yieldEarned}</TdNum>
                      <TdNum>{totalRow.dailyAverage}</TdNum>
                      <th className="pr-2"></th>
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
