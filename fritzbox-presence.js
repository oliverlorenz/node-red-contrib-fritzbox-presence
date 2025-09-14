const fritz = require('./fritz')
const bluebird = require('bluebird')
var parseXML = require('xml2js').parseString

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

        this.on('input', (msg) => {
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
              var data = ""
              parseXML(response, {trim: true, explicitArray: false}, function (err, result) {
                data = result['List']['Item']
              })
              if(msg.payload === 'online' || msg.payload === 'offline') {
                var newList = []
                data.forEach( function(n) {
                  if(n.Active == (msg.payload==='online'?1:0))
                  newList.push(n)
                })
                data = newList
              }
              else
                msg.payload = 'all'
              node.status({ fill: "green", shape: "ring", text: `${data.length} devices (` + msg.payload + `)` })
              node.send({ payload: data, full_response: response, mode: msg.payload})
            })
            .catch((err) => {
              setNodeStatusToConnectionError(node, err)
            })
        })
        this.on('error', () => {
          console.log('error')
        })
        this.on('close', function() {
            node.status({})
        })
    }
    RED.nodes.registerType("fritzbox-presence", FritzBoxPresence)
}
