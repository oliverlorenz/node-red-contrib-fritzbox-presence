const http = require('http')
const Promise = require('bluebird')

function checkSession(sessionID, options) {
    options.path = '/login_sid.lua?sid=' + (sessionID || '')
    return Promise.try(() => {
      return request(options)
    })
    .then((response) => {
      return (response.match("<SID>(.*?)</SID>")[1] === sessionID)
    })
}

function request(options) {
  return new Promise((resolve, reject) => {
    const req = http.get(options, function(response) {
      let data = ''
      response.on('data', function(chunk) {
          data += chunk
      })
      response.on('end', function() {
        resolve(data)
      })
    })
    req.on('error', (error) => {
      reject(error)
    })
  })
}

function getSessionID(username, password, options) {
    options.path = '/login_sid.lua'
    let sessionID = ""
    return Promise.try(() => {
      if (typeof username != 'string') throw new Error('Invalid username')
      if (typeof password != 'string') throw new Error('Invalid password')
    })
    .then(() => {
      return request(options)
    })
    .then((response) => {
      var challenge = response.match("<Challenge>(.*?)</Challenge>")[1]
      options.path += "?username=" + username + "&response=" + challenge + "-" + require('crypto').createHash('md5').update(Buffer(challenge + '-' + password, 'UTF-16LE')).digest('hex')
      return request(options)
    })
    .then((response) => {
      sessionID = response.match("<SID>(.*?)</SID>")[1]
      return sessionID
    })
}

function getData(sid, options) {
    options.port = 49000
    options.path = '/devicehostlist.lua?sid=' + sid
    return Promise.try(() => {
      return request(options)
    })
    .then((response) => {
      return response
    })
}

module.exports = {
  getData,
  getSessionID,
  checkSession
}
