import useSWR from 'swr'
import Head from 'next/head'
import Layout from '../components/layout'
import TdNum from '../components/td-num'
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
    earnings =
      Object.keys(data.earnings).map(asset =>
        Object.keys(data.earnings[asset]).map(account => {
          const totalRow = data.earnings[asset][account].slice(-1)[0]
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
                {data.earnings[asset][account].slice(0, -1).map(period => (
                  <tr key={period.startDate}>
                    <td className="text-right">{format.asLongDate(period.startDate)}</td>
                    <td className="text-right">{format.asLongDate(period.endDate)}</td>
                    <TdNum>{period.dayCount}</TdNum>
                    <TdNum currency={asset} className="v-sep">{period.transfered}</TdNum>
                    <TdNum currency={asset}>{period.startBalance}</TdNum>
                    <TdNum currency={asset} className="v-sep">{period.endBalance}</TdNum>
                    <TdNum currency={asset}>{period.yieldEarned}</TdNum>
                    <TdNum currency={asset}>{period.dailyAverage}</TdNum>
                    <td className="pr-2"></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th></th>
                  <TdNum>{totalRow.dayCount}</TdNum>
                  <TdNum currency={asset} className="v-sep">{totalRow.transfered}</TdNum>
                  <TdNum currency={asset}>{totalRow.startBalance}</TdNum>
                  <TdNum currency={asset} className="v-sep">{totalRow.endBalance}</TdNum>
                  <TdNum currency={asset}>{totalRow.yieldEarned}</TdNum>
                  <TdNum currency={asset}>{totalRow.dailyAverage}</TdNum>
                  <th className="pr-2"></th>
                </tr>
              </tfoot>
            </table>
          )
        })
      )
  }

  return (
    <Layout name="Yield Earnings">
      <div className="space-y-12">
        {earnings}
      </div>
    </Layout>
  )
}
