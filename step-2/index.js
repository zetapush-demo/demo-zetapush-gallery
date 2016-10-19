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
    listFiles({ data: { result } }) {
      const cards = result.listing.entries.content
      $cards.textContent=(JSON.stringify(cards))
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
