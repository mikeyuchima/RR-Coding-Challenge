import {
    getDistancetoStop,
    getFinishedLegs,
    getLegs,
    getLocation,
    getStopDistance,
    getStops,
    getTimetoDestination,
    updateLocation
} from './library'

describe('getLegs()', () => {
    it('Should contain an object with legs as the key and values matching intended shapes.', () => {
        const objectLegs = getLegs()
        expect(typeof objectLegs).toEqual('object');
        for (const key in objectLegs) {
            // Ensure each data point is an object with an exact set of keys.
            expect(typeof objectLegs[key]).toEqual('object');
            expect(Object.keys(objectLegs[key])).toEqual([
                'startStop',
                'endStop',
                'speedLimit',
                'legID',
            ]);
            // Validate simple property types.
            expect(typeof objectLegs[key].startStop).toEqual('string');
            expect(typeof objectLegs[key].endStop).toEqual('string');
            expect(typeof objectLegs[key].speedLimit).toEqual('number');
            expect(typeof objectLegs[key].legID).toEqual('string');
        }
    });
});

describe('getStops()', () => {
    it('Should contain an object with stop name as keys and values matching intended shape', () => {
        const objectStops = getStops()
        expect(typeof objectStops).toEqual('object');
        for (const key in objectStops) {
            // Ensure each data point is an object with an exact set of keys.
            expect(typeof objectStops[key]).toEqual('object');
            expect(Object.keys(objectStops[key])).toEqual([
                'name',
                'x',
                'y'
            ]);
            // Validate simple property types.
            expect(typeof objectStops[key].name).toEqual('string');
            expect(typeof objectStops[key].x).toEqual('number');
            expect(typeof objectStops[key].y).toEqual('number');
        }
    });
});

describe('getFinishedLegs()', () => {
    it('Should contain an object with stop name as keys and values matching complete', () => {
        const finishedLegs = getFinishedLegs()
        expect(typeof finishedLegs).toEqual('object');
        for (const key in finishedLegs) {
            // Ensure each data point is an object with an exact set of keys.
            expect(finishedLegs[key]).toEqual('complete');
            // Validate simple property types.
            expect(typeof finishedLegs[key]).toEqual('string');
        }
    })
})

describe('getDistancetoStop()', () => {
    it('Should contain a number', () => {
        const DistancetoStop = getDistancetoStop()
        expect(typeof DistancetoStop).toEqual('number');
    })
})

describe('getLocation()', () => {
    it('Should contain an object with stop name as keys and values matching intended shape', () => {
        const location = getLocation()
        expect(typeof location).toEqual('object');
        // Ensure each data point is an object with an exact set of keys.
        expect(Object.keys(location)).toEqual(['activeLegID', 'legProgress', 'x', 'y', 'timeRemaining']);

        // Validate simple property types.
        expect(typeof location.activeLegID).toEqual('string');
        expect(typeof location.legProgress).toEqual('string');
        expect(typeof location.x).toEqual('number');
        expect(typeof location.y).toEqual('number');
        expect(typeof location.timeRemaining).toEqual('number');
    })
})

describe('getTimetoDestination()', () => {
    it('Should contain a number', () => {
        const TimeToDestination = getTimetoDestination()
        expect(typeof TimeToDestination).toEqual('number');
    })
})

describe('getStopDistance()', () => {
    it('Should contain a number', () => {
        const DistanceBetweenStop = getStopDistance()
        expect(typeof DistanceBetweenStop).toEqual('number');
    })
})

describe('updateLication()', () => {
    it('Should contain an object with driver data', () => {
        const location = updateLocation(20, 30, 'AB')
        expect(typeof location).toEqual('object');
        // Ensure each data point is an object with an exact set of keys.
        expect(Object.keys(location)).toEqual(['activeLegID', 'legProgress', 'x', 'y', 'timeRemaining']);

        // Validate simple property types.
        expect(typeof location.activeLegID).toEqual('string');
        expect(typeof location.legProgress).toEqual('number');
        expect(typeof location.x).toEqual('number');
        expect(typeof location.y).toEqual('number');
        expect(typeof location.timeRemaining).toEqual('number');
    })
})