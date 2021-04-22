import path from 'path'
import Head from 'next/head'

import Layout from '../components/layout'
import Amount from '../components/amount'

import sb from '../lib/swissborg'

export default function Funding({ currencies, funding }) {
  return (
    <Layout>
      <Head>
        <title>Deposits &amp; Withdrawals</title>
      </Head>
      <h1>Funding</h1>
      <div className="space-y-12 w-700">
        {currencies.map(currency => (
          <table key={currency} className="w-full">
            <caption>{currency}</caption>
            <thead>
              <tr>
                <th>Date</th>
                <th>Movement</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {funding.filter(f => f.currency == currency).map(deposit => (
                <tr key={deposit.time}>
                  <td>{deposit.time}</td>
                  <td>{deposit.type}</td>
                  <td className="text-right"><Amount value={deposit.netAmount} /></td>
                  <td className="text-right"><Amount value={deposit.balance} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {

  const accountStatement = path.join('resources', 'account-statement.xlsx')
  return await sb.parse(accountStatement).then(wb => {

    const ledger = sb.getLedgerEntries(wb)
    const funding = sb.getFunding(ledger)
    const currencies = [...new Set(funding.map(f => f.currency))]

    return {
      props: {
        currencies, funding
      }
    }
  })
}
