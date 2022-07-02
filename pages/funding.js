import useSWR from 'swr'
import Head from 'next/head'
import Layout from '../components/layout'
import Amount from '../components/amount'
import * as format from '../utils/format'
import TdNum from '../components/td-num'


export default function Funding() {

  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR('/api/funding', fetcher)

  let funding
  if (error) {
    funding = <div className="text-center pt-4">Failed to load data!</div>
  }
  else if (!data) {
    funding = <div className="text-center pt-4">Loading data…</div>
  }
  else {
    funding =
      Object.keys(data.funding).map(asset =>
        <table key={asset} className="table-fixed">
          <caption>{asset}</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>Movement Type</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Fee</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          {data.funding[asset].map(entry => (
            <tbody>
              <tr key={entry.time}>
                <td className="tabular-nums">{format.asDateTime(entry.time)}</td>
                <td>{entry.type}</td>
                <TdNum currency={asset}>{entry.amount}</TdNum>
                <TdNum currency={asset}>{entry.fee}</TdNum>
                <TdNum currency={asset}>{entry.balance}</TdNum>
              </tr>
            </tbody>
          ))}
        </table>
      )
  }

  return (
    <Layout name="Deposits &amp; Withdrawals">
      <div className="space-y-8 w-4/5">
        {funding}
      </div>
    </Layout>
  )
}
