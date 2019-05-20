const path = require('path')
const mimeTypes = {
  'js': 'application/x-javascript',
  'html': 'text/html',
  'css': 'text/css',
  'txt': "text/plain"
}

module.exports = (filePath) => {
  let ext = path.extname(filePath)
    .split('.').pop().toLowerCase() // 取扩展名

  if (!ext) { // 如果没有扩展名，例如是文件
    ext = filePath
  }
  return mimeTypes[ext] || mimeTypes['txt']
}