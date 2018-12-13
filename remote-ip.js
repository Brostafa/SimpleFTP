const https = require('https')


module.exports = () => new Promise((resolve, reject) => {
  https.get('https://canhazip.com', res => {
    let data = ''

    // A chunk of data has been recieved.
    res.on('data', (chunk) => {
      data += chunk
    })

    res.on('end', () => resolve(data.trim()))
  }).on("error", (err) => reject(err))
})