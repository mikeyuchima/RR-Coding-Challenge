const express = require('express')
const Stops = require("./db/stops")
const Legs = require('./db/legs')
const {
    getLocation,
    getFinishedLegs,
    updateLocation,
    getLegs,
    getStops
} = require('./library')

const app = express()
const WebSocket = require('ws');

const PORT = 8080;

// Create a new express server
const server = express()
    // Make the express server serve static assets (html, javascript, css) from the /public folder
    .use(express.static('public'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new WebSocket.Server({
    server,
    path: "/websocket"
});
// Send data to connected clients
wss.broadcast = (data, ws) => {
    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', (ws) => {
    console.log('Client Connected')
    ws.on('message', data => {
            console.log("Message Received", data);
            const pack = JSON.parse(data);
            let payload;

            switch (pack.type) {
                case "RequestDriver":
                    payload = {
                        type: 'IncomingDriver',
                        data: getLocation()
                    }
                    wss.broadcast(JSON.stringify(payload));
                    break;
                case "RequestStops":
                    payload = {
                        type: 'IncomingStops',
                        data: getStops()
                    }
                    wss.broadcast(JSON.stringify(payload));
                    break;
                case 'RequestLegs':
                    payload = {
                        type: 'IncomingLegs',
                        data: getLegs()
                    }
                    wss.broadcast(JSON.stringify(payload));
                    break;
                case 'RequestCompletedLegs':
                    payload = {
                        type: 'IncomingCompletedLegs',
                        data: getFinishedLegs()
                    }
                    wss.broadcast(JSON.stringify(payload));
                    break
                case 'RequestUpdate':
                    const {
                        x,
                        y,
                        leg
                    } = pack
                    payload = {
                        type: 'IncomingDriver',
                        data: updateLocation(x, y, leg)
                    }
                    wss.broadcast(JSON.stringify(payload));
                    payload = {
                        type: 'IncomingCompletedLegs',
                        data: getFinishedLegs()
                    }
                    wss.broadcast(JSON.stringify(payload))
                    break;
                default:
                    throw new Error("Unknown event type " + pack.type);
            }
        }),
        // Set up a callback for when a client closes the socket. This usually means they closed their browser.
        ws.on('close', (ws) => {
            console.log('Client disconnected')
        });
});