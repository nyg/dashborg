import Head from 'next/head'
import Layout from '../components/layout'
import Amount from '../components/amount'

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
      <table className="w-full">
        <thead>
          <tr className="text-right">
            <th className="text-left">Asset</th>
            <th>Number of Days</th>
            <th>Total Earned</th>
            <th>Daily Average</th>
            <th>Yearly Estimate</th>
          </tr>
        </thead>
        <tbody>
          {data.earnings.map(earning => (
            <tr key={earning.asset} className="text-right">
              <td className="text-left">{earning.asset}</td>
              <td>{earning.dayCount}</td>
              <td><Amount value={earning.totalEarned} /></td>
              <td><Amount value={earning.dailyAverage} /></td>
              <td><Amount value={earning.yearlyEstimate} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <Layout>
      <Head>
        <title>Yield Earnings</title>
      </Head>
      <h1>Yield Earnings</h1>
      <div className="space-y-12 w-700">
        {earnings}
      </div>
    </Layout>
  )
}
