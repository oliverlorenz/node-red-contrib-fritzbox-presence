# node-red-contrib-fritzbox-presence

This node for the node-RED application lists all devices that are currently
connected to a Fritz!Box.

Fritz!OS >= 5.50 is required for this to work.

## Installation
Just install this module in your node-RED configuration folder

```bash
cd ~/.node-red
npm install node-red-contrib-fritzbox-presence
```

Or globally:

```bash
npm install -g node-red-contrib-fritzbox-presence
```

## Usage

This example flow prints a list of device names to the debug console.
Make sure to configure the Fritz node to match your custom credentials.

```
[
    {
        "id": "9b89ed50.a4601",
        "type": "tab",
        "label": "Fritz!Box Presence"
    },
    {
        "id": "a189b5d7.73f498",
        "type": "fritzbox-presence",
        "z": "9b89ed50.a4601",
        "name": "",
        "host": "fritz.box",
        "x": 390,
        "y": 220,
        "wires": [ [ "ce56fe81.70f58" ] ]
    },
    {
        "id": "327b13a0.23ea1c",
        "type": "inject",
        "z": "9b89ed50.a4601",
        "name": "",
        "topic": "",
        "payload": "true",
        "payloadType": "bool",
        "repeat": "300",
        "crontab": "",
        "once": true,
        "x": 210,
        "y": 220,
        "wires": [ [ "a189b5d7.73f498" ] ]
    },
    {
        "id": "ce56fe81.70f58",
        "type": "function",
        "z": "9b89ed50.a4601",
        "name": "formatting",
        "func": "var data = msg.payload\nvar devs = []\n\nmsg.payload.forEach(function(n) {\n    devs.push(n.name)\n})\n\nmsg.payload = devs\nreturn msg",
        "outputs": 1,
        "noerr": 0,
        "x": 590,
        "y": 220,
        "wires": [ [ "feef99c8.5e23a8" ] ]
    },
    {
        "id": "feef99c8.5e23a8",
        "type": "debug",
        "z": "9b89ed50.a4601",
        "name": "",
        "active": true,
        "console": "false",
        "complete": "false",
        "x": 770,
        "y": 220,
        "wires": []
    }
]
```
