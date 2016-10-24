// Création du client ZetaPush
const client = new ZetaPush.Client({
  sandboxId: prompt('Set your sandbox id'),
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
    error(message) {
      console.error('error', message)
    },
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
    searchFiles({ data: { result } }) {
      const cards = result.items.content.map(({ data }) => data)
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
  api.call({ name: 'listFiles' })
  $status.textContent=('signal_wifi_4_bar')
})
client.onConnectionClosed(() => {
  $status.textContent=('signal_wifi_off')
})
// Connexion au backend
client.connect()
$form.addEventListener('submit', (event) => {
  event.preventDefault()
  $progress.classList.remove('hide')
  api.call({ name: 'uploadFile' })
})
$('main').on('click', '[data-tag]', (event) => {
  api.call({ name: 'searchFiles', parameters: { tags: [ event.target.dataset.tag ] } })
})
$(window).on('keyup', ({ key }) => {
  if (key === 'Escape') {
    api.call({ name: 'listFiles' })
  }
})
