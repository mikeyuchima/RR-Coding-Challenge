import express from 'express';
let DriverLocation = require('./db/driver.js')
import Stops from "./db/stops";
import Legs from './db/legs'
import bodyParser from 'body-parser';

const app = express()
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

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

getLocation()

// get all legs 
app.get('/api/v1/legs', function (req, res) {
    res.status(200).send({
        success: 'true',
        message: 'list of legs retrieved successfully',
        legs: Legs
    })
})

// get all stops
app.get('/api/v1/stops', function (req, res) {
    res.status(200).send({
        success: 'true',
        message: 'list of stops retrieved successfully',
        stops: Stops
    })
})

// get driver's location
app.get('/api/v1/driver', function (req, res) {
    res.status(200).send({
        success: 'true',
        message: 'driver location retrieved successfully',
        driver_location: getLocation()
    })
})

app.put('/api/v1/driver', function (req, res) {
    res.send('hello world')
})

app.listen(PORT, () => {
    console.log(`Rose Rocket listening on port ${PORT}!`);
});