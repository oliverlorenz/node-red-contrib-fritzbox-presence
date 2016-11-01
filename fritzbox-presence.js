const fritz = require('./fritz')

module.exports = function(RED) {

    function FritzBoxPresence(config) {

        RED.nodes.createNode(this, config)
        var username = this.credentials.username || ''
        var password = this.credentials.password || ''
        var node = this
        var sessionID = ''

        node.status({})

        function getDevices(sid) {
            if (sid == '0000000000000000') {
                node.status({ fill: "red", shape: "dot", text: "connection error" })
                node.error('could not get a valid session ID. Please check credentials.')
                return
            }
            sid = sid || sessionID
            fritz.checkSession(sid, function(isSession) {
                if (isSession) {
                    sessionID = sid
                    node.status({ fill: "green", shape: "dot", text: "querying" })
                    fritz.getData(sid, function(data) {
                        data = JSON.parse(data)
                        var devices = data.data.active
                        node.send({ payload: data.data.active })
                        node.status({ fill: "green", shape: "ring", text: `${devices.length} devices detected` })
                    })
                } else {
                    node.status({ fill: "green", shape: "ring", text: "connecting" })
                    fritz.getSessionID(username, password, getDevices)
                }
            })
        }

        this.on('input', function(msg) {
            node.status({ fill: "yellow", shape: "dot", text: "starting" })
            getDevices()
        })

        this.on('close', function() {
            node.status({})
        })
    }

    RED.nodes.registerType("fritzbox-presence", FritzBoxPresence, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    })

}
