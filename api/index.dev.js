const app = require('express')()
const { Nuxt, Builder } = require('nuxt')
const consola = require('consola')
const api = require('./index.js')
const socket = require('./socket-io')
const auth = require('./authication')
const port = 3001
const host = 'localhost'

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const methodAllow = [ 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT' ]
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', methodAllow.join(','))
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    next()
  })
}

app.use(socket.path, socket.handler)
app.use(api.path, api.handler)
app.use(auth.path, auth.handler)

app.listen(port, () => consola.ready({ message: `Server listening on http://${host}:${port}`, badge: true }))