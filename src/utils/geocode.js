const request = require('request')

// const geocode = (address, callback) => {
//     const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/L${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiaGlnb2NodW1ibyIsImEiOiJjandrMmkxdHIxOXpjNGFvMmY5MTdsNnVjIn0.9iV-jr_9VdDP3qkvj0xDPg&limit=1`
    
//     request({url: url, json: true}, (error, response) => {
//         if (error) {
//             callback('Unable to connect to location service.', undefined) // El undefined no es necesario, pero deja claro el input que se va a llevar el caller abajo, para el argumento "data".
//         } else if (response.body.features.length === 0) {
//             callback('Location not found.', undefined)
//         } else {
//             callback(undefined, {
//                 latitude: response.body.features[0].center[1],
//                 longitude: response.body.features[0].center[0],
//                 place_name: response.body.features[0].place_name,
//             })
//         }
//     })
// }

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/L${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiaGlnb2NodW1ibyIsImEiOiJjandrMmkxdHIxOXpjNGFvMmY5MTdsNnVjIn0.9iV-jr_9VdDP3qkvj0xDPg&limit=1`
    
    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback('Unable to connect to location service.', undefined) // El undefined no es necesario, pero deja claro el input que se va a llevar el caller abajo, para el argumento "data".
        } else if (body.features.length === 0) {
            callback('Location not found.', undefined)
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                place_name: body.features[0].place_name,
            })
        }
    })
}

module.exports = geocode