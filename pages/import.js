import Layout from '../components/layout'
import { useState } from 'react'
import useSWR from 'swr'


export default function Import() {

  const [status, setStatus] = useState()

  async function uploadFile(url, form) {
    return (await fetch('/api/upload', {
      method: 'POST',
      body: new FormData(document.forms[formName])
    })).json()
  }

  async function uploadFile() {
    form.preventDefault()
    const resp = await uploadFile('/api/upload', 'account-statement')
    console.info(resp)
    setStatus(resp.status)
  }

  async function addSubscription(form) {
    form.preventDefault()
    const resp = await uploadFile('/api/subscription', 'yield-subscription')
    console.info(resp)
  }

  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR('/api/subscription', fetcher)

  let subscriptions
  if (error) {
    subscriptions = <div className="text-center pt-4">Failed to load data!</div>
  }
  else if (!data) {
    subscriptions = <div className="text-center pt-4">Loading data…</div>
  }
  else {
    subscriptions = (
      <table>
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
      <h2>Account Statement</h2>
      <p>Upload your account statement</p>
      <input type="file" id="upload" name="account-statement" />
      <button onClick={uploadFile}>Import</button>
      <p>{status}</p>

      <h2>Smart Yield Subscriptions</h2>

      <h3>Current Subscriptions</h3>
      {subscriptions}

      <h3>Add New Subscription</h3>
      <form id="addSubscription">
        <label htmlFor="activation-date">Activation date</label>
        <input type="text" id="activation-date" name="activation-date"></input>
        <label htmlFor="asset">Asset</label>
        <input type="text" id="asset" name="asset"></input>
        <label htmlFor="amount">Amount</label>
        <input type="text" id="amount" name="amount"></input>
        <button onClick={addSubscription}>Add subscription</button>
      </form>
    </Layout>
  )
}
