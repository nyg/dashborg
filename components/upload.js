import { useState } from 'react'


export default function Upload({ name, url }) {

  const [uploadStatus, setUploadStatus] = useState()

  const uploadFile = async event => {

    // prevent form from being submitted after the button being clicked
    event.preventDefault()

    // if (event.target.fileChooser.files.length != 1) {
    //   setUploadStatus('Choose a file before uploading!')
    //   return
    // }

    const uploadResponse = await (await fetch(url, {
      method: 'POST',
      body: new FormData(event.target)
    })).json()

    console.debug(uploadResponse)
    setUploadStatus(uploadResponse.status)
  }

  return (
    <form method="post" onSubmit={uploadFile}>
      <div className="pt-2 pb-2 flex flex-row space-x-6">
        <input className="my-auto" type="file" name={name} />
        <button className="rounded-sm border-gray-400 border bg-gray-200 pt-1 pb-1 pl-3 pr-3">Upload</button>
        <p className="my-auto font-semibold">{uploadStatus}</p>
      </div>
    </form>
  )
}
