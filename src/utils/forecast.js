const request = require('request')

// const forecast = (latitude, longitude, callback) => {
//     const url = `https://api.darksky.net/forecast/4ddcbe14b38d3f734299be0a3f662118/${latitude},${longitude}?units=si`

//     request({url: url, json: true}, (error, response) => {
//         if (error) {
//             callback('Unable to connect to weather service.', undefined) 
//         } else if (response.body.error) {
//             callback(response.body.error, undefined)
//         } else {
//             callback(undefined, {
//                 summary: response.body.daily.data[0].summary,
//                 temperature: response.body.currently.temperature,
//                 precipProbability: response.body.currently.precipProbability,
//             })
//         }
//     })
// }

const forecast = (latitude, longitude, callback) => {
    const url = `https://api.darksky.net/forecast/4ddcbe14b38d3f734299be0a3f662118/${latitude},${longitude}?units=si`

    request({url, json: true}, (error, {body}) => { // era url:url pero usamos shorthand.
        if (error) {
            callback('Unable to connect to weather service.', undefined) 
        } else if (body.error) {
            callback(body.error, undefined)
        } else {
            callback(undefined, {
                summary: body.daily.data[0].summary,
                temperature: body.currently.temperature,
                precipProbability: body.currently.precipProbability,
            })
        }
    })
}

module.exports = forecast