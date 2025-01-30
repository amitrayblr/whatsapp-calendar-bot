const fs = require('fs').promises
const path = require('path')
const process = require('process')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')

const scopes = ['https://www.googleapis.com/auth/calendar.readonly']
const tokenPath = path.join(process.cwd(), 'config/token.json')
const credentialPath = path.join(process.cwd(), 'config/credentials.json')

async function loadCredentials() {
  try {
    const content = await fs.readFile(tokenPath)
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(credentialPath)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  })
  await fs.writeFile(tokenPath, payload)
}

async function authorize() {
  let client = await loadCredentials()
  if (client) {
    return client
  }
  client = await authenticate({
    scopes: scopes,
    keyfilePath: credentialPath,
  })
  if (client.credentials) {
    await saveCredentials(client)
  }
  return client
}

module.exports = {
  authorize,
}
