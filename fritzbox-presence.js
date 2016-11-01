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
                return node.error('could not get a valid session ID. Please check credentials.')
            }
            sid = sid || sessionID
            if (sid == '' || typeof sid != 'string') {
                node.status({ fill: "green", shape: "ring", text: "connecting" })
                return fritz.getSessionID(username, password, getDevices)
            }
            fritz.checkSession(sid, function(isSession) {
                if (!isSession) {
                    return getDevices()
                }
                sessionID = sid
                node.status({ fill: "green", shape: "dot", text: "querying" })
                fritz.getData(sid, function(res) {
                    try {
                        res = JSON.parse(res)
                        var devices = res.data.active
                        node.status({ fill: "green", shape: "ring", text: `${devices.length} devices detected` })
                        node.send({ payload: devices, full_response: res })
                    } catch (e) {
                        node.status({ fill: "red", shape: "dot", text: "data error" })
                        node.error(e)
                    }
                })
            })
        }

        this.on('input', getDevices)

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
