import express from 'express';
let DriverLocation = require('./db/driver.js')
import Stops from "./db/stops";
import Legs from './db/legs'
import Driver from './src/Driver.jsx';

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

const updateLocation = (x_axis, y_axis, leg) => {
    DriverLocation.x_location = x_axis
    DriverLocation.y_location = y_axis
    DriverLocation.activeLegID = leg
    const distance = getDistance()
    const distance_remaining = getDistancetoStop()
    DriverLocation.legProgress = distance / distance_remaining

    return DriverLocation
}

const updateProgress = () => {}

const autoUpdate = () => {
    const distance = getDistance() * 1000
    const current_leg = DriverLocation.activeLegID
    let progress = ((DriverLocation.progress / 100) * distance)
    let distance_remaining = progress - distance
    const speed = Legs[current_leg].speedLimit
    const time = distance / speed
    const distance_per_minute = (speed * 10000) / 60

    setInterval(() => {
        progress = distance_remaining + distance_per_minute
        percentage = progress / distance
    }, 60000);
}

const getFinishedLegs = () => {
    const last_stop = DriverLocation.activeLegID.split('')[0]
    const letter_number = last_stop.toUpperCase().charCodeAt(0) - 64
    let completed_stops = {}
    for (let i = 0; i < letter_number; i++) {
        completed_stops[String.fromCharCode(65 + i)] = 'complete'
    }
    return completed_stops
}

const getStopDistance = () => {
    const location = DriverLocation.activeLegID.split('')
    const start = Stops[location[0]]
    const end = Stops[location[1]]
    const base = Math.abs(start.x - end.x)
    const height = Math.abs(start.y - end.y)
    let distance;

    if (start.x === end.x || start.y === end.y) {
        distance = Math.abs(base - height)
    } else {
        const a = Math.pow(base, 2)
        const b = Math.pow(height, 2)
        distance = Math.sqrt(a + b)
    }
    return distance
}

const getDistancetoStop = () => {
    const location = DriverLocation.activeLegID.split('')[1]
    const start = DriverLocation
    const end = Stops[location]
    const base = Math.abs(start.x_location - end.x)
    const height = Math.abs(start.y_location - end.y)
    let distance;

    if (base === 0 || height === 0) {
        distance = Math.abs(base - height)
    } else {
        const a = Math.pow(base, 2)
        const b = Math.pow(height, 2)
        distance = Math.sqrt(a + b)
    }

    return distance
}

const getLocation = () => {
    const location = DriverLocation.activeLegID.split('')
    const progress = DriverLocation.legProgress
    const start = Stops[location[0]]
    const end = Stops[location[1]]
    let x_location;
    let y_location;

    if (!DriverLocation.x_location && !DriverLocation.y_location) {
        x_location = start.x + Math.floor((end.x - start.x) * (progress / 100))
        y_location = start.y + Math.floor((end.y - start.y) * (progress / 100))
        DriverLocation.x = x_location
        DriverLocation.y = y_location
    }
    return (DriverLocation)
}

wss.on('connection', (ws) => {
    console.log('Client Connected')
    ws.on('message', data => {
            console.log("Message Received", data);
            const data = JSON.parse(data);
            let payload;
            console.log(data.type)

            switch (data.type) {
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
                    } = data
                    payload = {
                        type: 'IncomingDriver',
                        data: updateLocation(x, y, leg)
                    }
                    wss.broadcast(JSON.stringify(payload));
                    break;
                default:
                    throw new Error("Unknown event type " + data.type);
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