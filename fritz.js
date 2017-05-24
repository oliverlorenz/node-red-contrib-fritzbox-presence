const http = require('http')

module.exports.checkSession = function(sid, callback, options) {
    options || (options = {})
    options.path || (options.path = '/login_sid.lua')
    options.path += '?sid=' + sid
    try {
        http.get(options, function(response) {
            var str = ''
            response.on('data', function(chunk) {
                str += chunk
            })
            response.on('end', function() {
                callback(str.match("<SID>(.*?)</SID>")[1] == sid)
            })
        })
    } catch (e) {
        throw new Error('Error getting sid from FritzBox. Please check login and url')
    }
}

module.exports.getSessionID = function(username, password, callback, options) {
    if (typeof username != 'string') throw new Error('Invalid username')
    if (typeof password != 'string') throw new Error('Invalid password')

    options || (options = {})
    options.path || (options.path = '/login_sid.lua')

    var sessionID = ""
    try {
        http.get(options, function(response) {
            var str = ''
            response.on('data', function(chunk) {
                str += chunk
            })
            response.on('end', function() {
                var challenge = str.match("<Challenge>(.*?)</Challenge>")[1]
                options.path += "?username=" + username + "&response=" + challenge + "-" + require('crypto').createHash('md5').update(Buffer(challenge + '-' + password, 'UTF-16LE')).digest('hex')
                http.get(options, function(response) {
                    var str = ''
                    response.on('data', function(chunk) {
                        str += chunk
                    })
                    response.on('end', function() {
                        sessionID = str.match("<SID>(.*?)</SID>")[1]
                        callback(sessionID, str)
                    })
                })
            })
        })
    } catch (e) {
        throw new Error('Error getting Session ID from FritzBox. Please check configuration.')
    }
}

module.exports.getData = function(sid, callback, options) {
    options || (options = {})
    options.host || (options.host = 'fritz.box')
    options.path || (options.path = '/data.lua?xhr=1&page=netDev&type=cleanup&no_sidrenew=&sid=' + sid)
    try {
        http.get(options, function(response) {
            var str = ''
            response.on('data', function(chunk) {
                str += chunk
            })
            response.on('end', function() {
                callback(str)
            })
        })
    } catch (e) {
        throw new Error('Error getting data from FritzBox. Please check configuration.')
    }
}
