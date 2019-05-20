const  zlib = require('zlib')

module.exports = (readStream, request, response) => {
  const acceptEncoding = request.headers['accept-encoding']

  if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
    return readStream
  }
  else if (acceptEncoding.match(/\bgzip\b/)) {
    response.setHeader("Content-Encoding", 'gzip')
    return readStream.pipe(zlib.createGzip())
  }
  else if (acceptEncoding.match(/\bdeflate\b/)) {
    response.setHeader("Content-Encoding", 'deflate')
    return readStream.pipe(zlib.createDeflate())
  }
}