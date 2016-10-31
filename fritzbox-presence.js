const fritz = require('./fritz')


module.exports = function(RED) {

    function FritzBoxPresence(config) {
        RED.nodes.createNode(this, config)
        var username = this.credentials.username || ''
        var password = this.credentials.password || ''
        var node = this

        function getDevices(sid) {
            sid = sid || ''
            fritz.checkSession(sid, function(isSession) {
                if (isSession) {
                    fritz.getData(sid, function(data) {
                        data = JSON.parse(data)
                        var devices = data.data.active
                        node.send({payload: data.data.active})
                    })
                } else {
                    fritz.getSessionID(username, password, getDevices)
                }
            })
        }
        this.on('input', function(msg) {
            getDevices()
        })
    }

    RED.nodes.registerType("fritzbox-presence", FritzBoxPresence, {
        credentials: {
            username: {
                type: "text"
            },
            password: {
                type: "password"
            }
        }
    })

}
