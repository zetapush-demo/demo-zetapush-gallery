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
const api = client.createService({
  Type: ZetaPush.services.Macro,
  listener: {
    addFile({ data: { result } }) {
      $progress.classList.add('hide')
      api.call({ name: 'listFiles' })
    },
    listFiles({ data: { result } }) {
      const cards = result.listing.entries.content
      $cards.textContent=(JSON.stringify(cards))
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
  api.call({ name: 'listFiles' })
  $status.textContent=('signal_wifi_4_bar')
})
client.onConnectionClosed(() => {
  $status.textContent=('signal_wifi_off')
})
// Connexion au backend
client.connect()
// Manager Form Submit
$form.addEventListener('submit', (event) => {
  event.preventDefault()
  $progress.classList.remove('hide')
  api.call({ name: 'uploadFile' })
})
