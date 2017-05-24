module.exports = function (RED) {
  function FritzBoxPresenceCredentialNode (config) {
    RED.nodes.createNode(this, config)
    this.hostname = config.hostname
    this.username = config.username
    this.password = config.password
  }

  RED.nodes.registerType(
    'fritzbox-presence-credentials',
    FritzBoxPresenceCredentialNode
  )
}
