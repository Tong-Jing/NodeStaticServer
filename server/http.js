const http = require('http')
const path = require('path')

const config = require('./config')
const route = require('./route')

const server = http.createServer((request, response) => {
  let filePath = path.join(config.root, request.url)
  route(request, response, filePath)
  // response.statusCode = 200
  // response.setHeader('content-type', 'text/html')
  // response.write(`<html><body><h1>Hello World! </h1><p>${filePath}</p></body></html>`)
  // response.end()
})

server.listen(config.port, config.host, () => {
  const addr = `http://${config.host}:${config.port}`
  console.info(`server started at ${addr}`)
})