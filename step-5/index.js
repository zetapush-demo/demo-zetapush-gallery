// Création du client ZetaPush
const client = new ZetaPush.Client({
  sandboxId: 'qOFdwGSn',
  authentication() {
    return ZetaPush.Authentication.simple({
      login: 'demo',
      password: 'demo'
    })
  }
})
const fs = client.createService({
  Type: ZetaPush.services.Zpfs_hdfs,
  listener: {
    updateMeta({ data }) {
      document.querySelector(`[card-name="${data.name}"] img`).src = thumnail(data)
    }
  }
})
const api = client.createService({
  Type: ZetaPush.services.Macro,
  listener: {
    addFile({ data: { result } }) {
      $progress.classList.add('hide')
      api.call({ name: 'listFiles' })
    },
    deleteFile({ data: { result } }) {
      api.call({ name: 'listFiles' })
    },
    listFiles({ data: { result } }) {
      const cards = result.listing.entries.content
      render(cards)
    },
    uploadFile({ data: { result } }) {
      const [ file ] = $file.files
      const { url, httpMethod, guid } = result.upload
      const tags = $tags.value ? $tags.value.split(' ') : []
      upload({ file, url, httpMethod, guid, tags }).then(() => {
        $form.reset()
        api.call({ name: 'addFile', parameters: { guid, tags } })
      })
    }
  }
})
// Event de connexion
client.onConnectionEstablished(() => {
  $cards.textContent=('onConnectionEstablished')
  api.call({ name: 'listFiles' })
})
// Connexion au backend
client.connect()
// Manager Form Submit
$form.addEventListener('submit', (event) => {
  event.preventDefault()
  $progress.classList.remove('hide')
  api.call({ name: 'uploadFile' })
})
