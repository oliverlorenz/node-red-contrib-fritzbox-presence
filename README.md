[![NPM](https://nodei.co/npm/node-red-contrib-fritzbox-presence.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-red-contrib-fritzbox-presence/)

# node-red-contrib-fritzbox-presence

A node for node-RED to list active devices connected to a Fritz!Box.

## Prerequisites

* a Fritz!Box running Fritz!OS >= 5.50

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

There is an example flow in `examples/simple-flow.json` that prints a list of
active devices to the debug console. To run it in node-RED, copy the file's
content and import it via *Menu > Import > Clipboard*. Make sure to configure
the Fritz node to match your custom credentials.
