let DriverLocation = require('./db/driver.js')
const Stops = require("./db/stops")
const Legs = require('./db/legs')

const method = {
    // Send list of legs
    getLegs: () => {
        return Legs
    },
    // Send list of stops
    getStops: () => {
        return Stops
    },
    // Update location of driver
    updateLocation: (x_axis, y_axis, leg) => {
        DriverLocation.x = x_axis
        DriverLocation.y = y_axis
        DriverLocation.activeLegID = leg.value
        const distance = method.getStopDistance()
        const distance_remaining = method.getDistancetoStop()
        DriverLocation.legProgress = (distance - distance_remaining) / distance * 100
        DriverLocation.timeRemaining = method.getTimetoDestination();

        return DriverLocation
    },
    // Get the time from current driver location to the next stop
    getTimetoDestination: () => {
        const distance = method.getStopDistance()
        const current_leg = DriverLocation.activeLegID
        const speed = Legs[current_leg].speedLimit
        let time = distance / speed

        var hours = Math.floor(time);
        var minutes = (time * 60) % 60;
        time = hours + ":" + minutes;

        return time
    },
    // Indexing list of completed legs
    getFinishedLegs: () => {
        const last_stop = DriverLocation.activeLegID.split('')[0]
        const letter_number = last_stop.toUpperCase().charCodeAt(0) - 64
        let completed_stops = {}
        for (let i = 0; i < letter_number; i++) {
            completed_stops[String.fromCharCode(65 + i)] = 'complete'
        }
        return completed_stops
    },
    // Get the distacne between stops
    getStopDistance: () => {
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
    },
    // Get distance from driver to stop
    getDistancetoStop: () => {
        const location = DriverLocation.activeLegID.split('')[1]
        const start = DriverLocation
        const end = Stops[location]
        const base = Math.abs(start.x - end.x)
        const height = Math.abs(start.y - end.y)
        let distance;

        if (base === 0 || height === 0) {
            distance = Math.abs(base - height)
        } else {
            const a = Math.pow(base, 2)
            const b = Math.pow(height, 2)
            distance = Math.sqrt(a + b)
        }
        return distance
    },
    // Get the location of the driver
    getLocation: () => {
        const location = DriverLocation.activeLegID.split('')
        const progress = DriverLocation.legProgress
        const start = Stops[location[0]]
        const end = Stops[location[1]]

        if (!DriverLocation.x && !DriverLocation.y) {
            const x_location = start.x + Math.floor((end.x - start.x) * (progress / 100))
            const y_location = start.y + Math.floor((end.y - start.y) * (progress / 100))
            DriverLocation.x = x_location
            DriverLocation.y = y_location
            DriverLocation.timeRemaining = method.getTimetoDestination();
        }
        return DriverLocation
    }
}

module.exports = method