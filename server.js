import express from 'express';
let DriverLocation = require('./db/driver.js')
import Stops from "./db/stops";
import Legs from './db/legs'
import bodyParser from 'body-parser';

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

wss.broadcast = (data, ws) => {
    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

const updateLocation = (x_axis, y_axis) => {
    DriverLocation.x_location = x_axis
    DriverLocation.y_location = y_axis
}

const getDistance = () => {
    const location = DriverLocation.activeLegID.split('')
    const start = Stops[location[0]]
    const end = Stops[location[1]]

    if (start.x === end.x || start.y === end.y) {
        const distance = start.x - end.x - (start.y - end.y)
        console.log('straight', distance)
    } else {
        const base = start.x - end.x
        const height = start.y - end.y
        const distance = (base * height) / 2
        console.log('diagonal', distance)
    }
}

const getLocation = () => {
    const location = DriverLocation.activeLegID.split('')
    const progress = DriverLocation.legProgress
    const start = Stops[location[0]]
    const end = Stops[location[1]]
    let x_location;
    let y_location;

    if (!DriverLocation.x_location && !DriverLocation.y_location) {
        x_location = Math.floor(start.x + (start.x - end.x) * (progress / 100))
        y_location = Math.floor(start.y + (start.y - end.y) * (progress / 100))
        DriverLocation.x_location = x_location
        DriverLocation.y_location = y_location
    }
    console.log('straight', DriverLocation)
    return (DriverLocation.x_location, DriverLocation.y_location)
}

wss.on('connection', (ws) => {
    console.log('Cline Connected')
    ws.on('message', data => {
            console.log("Message Received", data);
            const msg = JSON.parse(data);
            let payload;

            switch (msg.type) {
                case "RequestDriver":
                    wss.broadcast(JSON.stringify(getLocation()));
                    break;
                case "RequestStops":
                    payload = {
                        type: 'IncomingStops',
                        data: Stops
                    }
                    wss.broadcast(JSON.stringify(payload));
                    break;
                case 'RequestLegs':
                    payload = {
                        type: 'IncomingLegs',
                        data: Legs
                    }
                    wss.broadcast(JSON.stringify(payload));
                    break;
                default:
                    throw new Error("Unknown event type " + msg.type);
            }
        }),
        // Set up a callback for when a client closes the socket. This usually means they closed their browser.
        ws.on('close', (ws) => {
            console.log('Client disconnected')
        });
});

// app.listen(PORT, () => {
//     console.log(`Rose Rocket listening on port ${PORT}!`);
// });