'use strict'
module.exports = Listener
const dgram = require('dgram')
const routes = require('./routes')

function Listener (harbour) {
  this.server = dgram.createSocket('udp4')
  this.server.on('message', (msg, rinfo) => {
    let path = msg.toString()
    for (let i = 0; i < routes.length; i++) {
      let route = routes[i]
      if (checkRoute(harbour, path, route)) return
    }
  })
  this.server.on('listening', () => {
    const address = this.server.address()
    console.log(`Server listening for UDP:\n ${address.address}:${address.port}`)
  })
  this.server.on('error', (err) => {
    console.log(`Server error:\n ${err.stack}`)
    server.close()
  })
  this.server.bind(49161) // TODO - make this configurable
}

function checkRoute(harbour, path, route) {
  let match = path.match(route.path)
  if (!match) return false
  let paramsName = Object.keys(route.params)
  let argValues = match.slice(1)
  // match args to the specified params
  let args = {}
  for (var i = 0; i < argValues.length; i++) {
    let paramName = paramsName[i]
    let argValue = argValues[i]
    if (paramName && argValue && argValue !== '') args[paramName] = argValue
  }
  route.handler(harbour, args)
  return true
}
