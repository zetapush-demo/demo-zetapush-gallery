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
// Event de connexion
client.onConnectionEstablished(() => {
  $cards.textContent=('onConnectionEstablished')
})
// Connexion au backend
client.connect()
