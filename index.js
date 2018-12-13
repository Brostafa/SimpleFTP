const express = require('express')
const app = express()
const path = require('path')
const serveIndex = require('serve-index')
const basicAuth = require('basic-auth-connect')
const commander = require('commander')
const ip = require('ip')
const getRemoteIp = require('./remote-ip')

commander
  .version('1.0.0')
  .usage('<directory> [options]')
  .option('--port <n>', 'Port to listen on. Default: 8080')
  .option('-u,--username <s>', 'Basic HTTP auth username. Default: admin')
  .option('-p, --password <s>', 'Basic HTTP auth password. Default: password')
  .parse(process.argv)

const port = commander.port || '8080'
const directory = commander.args[0] || __dirname
const username = commander.username || 'admin'
const password = commander.password || 'password'
const localIP = ip.address()
const startServer = (remoteIp = '') => {
  const endpoint = '/ftp'
  const remoteUrl = `http://${remoteIp}:${port}${endpoint}`
  const localUrl = `http://${localIP}:${port}${endpoint}`
  const message = `Listening on ${remoteUrl} - username: ${username} & password: ${password}\n\nIf you were testing locally go to ${localUrl}`

  app.get('/ping', (req,res) => res.send('OK'))
  app.use(basicAuth(username, password))
  app.use(endpoint, express.static(directory), serveIndex(directory, {'icons': true}))
  app.listen(port, () => console.log(message))
}

console.log('Spawning a server to serve directory: %s', directory)

getRemoteIp()
.then(remoteIp => startServer(remoteIp))
.catch(err => {
  console.log(`Couldn't retreive remote ip address`)
  startServer()
})