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
                    node.status({ fill: "green", shape: "dot", text: "querying" })
                    fritz.getData(sid, function(data) {
                        data = JSON.parse(data)
                        var devices = data.data.active
                        node.send({ payload: data.data.active })
                        node.status({ fill: "grey", shape: "ring", text: `found ${devices.length} devices - idling` })
                    })
                } else {
                    node.status({ fill: "green", shape: "ring", text: "connecting" })
                    fritz.getSessionID(username, password, getDevices)
                }
            })
        }

        this.on('input', function(msg) {
            node.status({ fill: "yellow", shape: "dot", text: "starting" })
            try {
                getDevices()
            } catch (e) {
                node.status({ fill: "red", shape: "dot", text: "error" })
            }
        })

    }

    RED.nodes.registerType("fritzbox-presence", FritzBoxPresence, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    })

}
