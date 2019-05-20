const fs = require('fs')
const util = require('util')
const path = require('path')
const ejs = require('ejs')
const config = require('./config')
const mime = require('./mime')
const compress = require('./compress')
const isCache = require('./cache')
// 异步优化
const stat = util.promisify(fs.stat)
const readdir = util.promisify(fs.readdir)
// 引入模版
const tplPath = path.join(__dirname,'../src/template/index.ejs')
const sourse = fs.readFileSync(tplPath) // 读出来的是buffer

module.exports = async function (request, response, filePath) {
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) {
      const mimeType = mime(filePath)
      response.setHeader('Content-Type', mimeType)

      if (isCache(stats, request, response)) {
        response.statusCode = 304;
        response.end();
        return;
      }

      response.statusCode = 200
      // fs.createReadStream(filePath).pipe(response)
      let readStream = fs.createReadStream(filePath)
      if(filePath.match(config.compress)) {
        readStream = compress(readStream,request, response)
      }
      readStream.pipe(response)
    }
    else if (stats.isDirectory()) {
      const files = await readdir(filePath)
      response.statusCode = 200
      response.setHeader('content-type', 'text/html')
      // response.end(files.join(','))

      const dir = path.relative(config.root, filePath) // 相对于根目录

      const data = {
        files,
        dir: dir ? `${dir}` : '' // path.relative可能返回空字符串（）
      }

      const template = ejs.render(sourse.toString(),data)
      response.end(template)
    }
  } catch (err) {
    console.error(err)
    response.statusCode = 404
    response.setHeader('content-type', 'text/plain')
    response.end(`${filePath} is not a file`)
  }
}


// module.exports = async function (request, response, filePath) {
//   try {
//     const stats = await stat(filePath)
//     if (stats.isFile()) {
//       response.statusCode = 200
//       response.setHeader('content-type', 'text/plain')
//       fs.createReadStream(filePath).pipe(response)
//     }
//     else if (stats.isDirectory()) {
//       const files = await readdir(filePath)
//       response.statusCode = 200
//       response.setHeader('content-type', 'text/plain')
//       response.end(files.join(','))
//     }
//   } catch (err) {
//     console.error(err)
//     response.statusCode = 404
//     response.setHeader('content-type', 'text/plain')
//     response.end(`${filePath} is not a file`)
//   }
// }


// module.exports = function (request, response, filePath){
//
//   fs.stat(filePath, (err, stats) => {
//     if (err) {
//       response.statusCode = 404
//       response.setHeader('content-type', 'text/plain')
//       response.end(`${filePath} is not a file`)
//       return;
//     }
//     if (stats.isFile()) {
//       response.statusCode = 200
//       response.setHeader('content-type', 'text/plain')
//       fs.createReadStream(filePath).pipe(response)
//     } else if (stats.isDirectory()) {
//       fs.readdir(filePath, (err, files) => {
//         response.statusCode = 200
//         response.setHeader('content-type', 'text/plain')
//         response.end(files.join(','))
//       })
//     }
//   })
// }