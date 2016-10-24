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
// Event de connexion
client.onConnectionEstablished(() => {
  $status.textContent=('signal_wifi_4_bar')
})
client.onConnectionClosed(() => {
  $status.textContent=('signal_wifi_off')
})
// Connexion au backend
client.connect()
