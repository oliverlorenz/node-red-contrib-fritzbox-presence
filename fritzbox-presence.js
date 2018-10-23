const fritz = require('./fritz')
const bluebird = require('bluebird')

function setNodeStatusToConnectionError(node, error) {
  node.status({ fill: "red", shape: "dot", text: error.message })
  node.error(error)
}

function setNodeStatusToQuerying(node) {
  node.status({ fill: "yellow", shape: "ring", text: "querying" })
}

module.exports = function(RED) {

    function FritzBoxPresence(config) {
        RED.nodes.createNode(this, config)
        var credentials = RED.nodes.getNode(config.fritz)
        var username = credentials.username
        var password = credentials.password
        var hostname = credentials.hostname
        var node = this
        let sessionID

        this.on('input', () => {
          setNodeStatusToQuerying(node)
          const options = { host: hostname }
          return fritz.checkSession(sessionID, options)
            .then((isSession) => {
              if (!isSession) {
                return fritz.getSessionID(username, password, options)
              }
              return Promise.resolve(sessionID)
            })
            .then((foundSessionId) => {
              if (foundSessionId === '0000000000000000') {
                throw new Error('Unvaild session id')
              }
              sessionID = foundSessionId
              return fritz.getData(sessionID, options)
            })
            .then((response) => {
              response = JSON.parse(response)
              const devices = response.data.net.devices
              node.status({ fill: "green", shape: "ring", text: `${devices.length} active devices detected` })
              node.send({ payload: devices, full_response: response })
            })
            .catch((err) => {
              setNodeStatusToConnectionError(node, err)
            })
        })
        this.on('error', () => {
          console.log('ääääääääääääää')
        })
        this.on('close', function() {
            node.status({})
        })
    }
    RED.nodes.registerType("fritzbox-presence", FritzBoxPresence)
}
