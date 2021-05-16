import useSWR from 'swr'
import Layout from '../components/layout'
import Upload from '../components/upload'


const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Import() {

  const { data, error } = useSWR('/api/subscription', fetcher)
  let subscriptions
  if (error) {
    subscriptions = <div className="text-center pt-4">Failed to load data!</div>
  }
  else if (!data) {
    subscriptions = <div className="text-center pt-4">Loading data…</div>
  }
  else {
    subscriptions = (data.subscriptions.length == 0
      ? <></>
      : <table>
        <caption>Imported Transactions</caption>
        <thead>
          <tr>
            <th>Activation date</th>
            <th>Asset</th>
            <th>Amount</th>
          </tr>
          {data.subscriptions.map(subscription => (
            <tr key={subscription.date}>
              <td>{subscription.date}</td>
              <td>{subscription.asset}</td>
              <td><Amount value={subscription.amount} /></td>
            </tr>
          ))}
        </thead>
      </table>
    )
  }

  return (
    <Layout name="Import">
      <h2 className="mt-6 mb-2 font-bold border-b border-gray-700">Account Statement</h2>

      <p>Upload your account statement (can be generated in the SwissBorg app).</p>
      <Upload name="account-statement" url="/api/upload" />

      <h2 className="mt-6 mb-2 font-bold border-b border-gray-700">Smart Yield Transactions</h2>

      <p>
        Smart Yield transactions (subscriptions & redemptions) are not made available in the account statement generated by SwissBorg.
        It is therefore necessary to add them seperately by uploading a separate Excel file.
      </p>
      <Upload name="yield-transactions" url="/api/upload" />

      {subscriptions}
    </Layout>
  )
}
