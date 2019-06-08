const path = require('path')
// express it's not an object but a single function
// hace falta hacer otra llamada abajo, es app.set('views')
const express = require('express')
// cargamos hbs para poder usar partial templates:
const hbs = require('hbs')
const chalk = require('chalk')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')



// SECTION: Define paths for Express config
// we call the express function above to create a new express appliaction
const app = express()
// puerto en el que se va a ejecutar la aplicación.
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

// Configurar la ruta de nuestros templates para que no sea la "views" por defecto.
const viewsPath = path.join(__dirname, '../templates/views')

// Decimos a HBS donde vamos a poner nuestos partial templates:
const partialsPath = path.join(__dirname, '../templates/partials')
// ------------------------------------------------------------



// SECTION: Setup handlebars engine and views location

// Le decimos a express qué template engine hemos instalado (hbs - handlebars para express):
// los argumentos son el nombre de la key y el valor
// express espera que todos los views (dynamic templates) esten en una
// la carpeta por defectocarpeta por defecto es raiz/views. (se puede modificar)
app.set('view engine', 'hbs')

// Llamada al viewsPath que hemos modificado arriba para que no sea la carpeta por defecto views.
// Si no lo hubiesemos modificado esta lina no haria falta y express iría
// por defecto a raíz/views.
app.set('views', viewsPath)

// Configurar el directorio de las partial templates:
hbs.registerPartials(partialsPath)
// ------------------------------------------------------------


// SECTION: Setup static directory to serve

// En este caso, añade todos los archivos .html de la carpeta public
// que pasan a ser subpáginas (ej www.app.com/about.html)
app.use(express.static(publicDirectoryPath))

/* Let's us configure what the server should do when someone tries to 
get the resource at a specific url
Takes two arguments: the partial url (after/) and a function that tells
what to do when someone visit that specific route.
The function takes two arguments, one is an object containing information
about the incoming request to the server. The other argument is the response,
which contains methods that allow us to customize what to send back*/
// This is more or less what we would get from app.com
// app.get('', (req, res) => {
//     res.send('<h1>Hello express!</h1>') //sends something back to the requester
// })
// ** no nos hace falta porque cargamos directamente el archivo html arriba.

// Configurar ruta del .hbs dinámico ('' a secas por ser la homepage):
app.get('', (req, res) => {
    // usar res.render en vez de res.send nos permite renderizar uno de nustros views de hbs.
    // el argumento simplemente tiene que coincidir con el nombre del archivo en la carpeta views.
    // este comando express coge el view index.hbs, lo convierte a html y
    // devuelve html al requester.
    // res.render('index') // hasta este punto es todavía estático, 
    // vamos a meter elementos dinámicos de Node.js:
    res.render('index', {
        title: 'Weather App',
        name: 'Nicolás de Amador',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Nicolás de Amador',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Nicolás de Amador',
        helpText: 'Helpful information.',
    })
})

// Another route: app.com/weather
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        console.log(chalk.red.bold('Location not provided.'))
        return res.send({
            error: 'Please provide a location',
        })
    } else {
        geocode(req.query.address, (error, { latitude, longitude, place_name } = {}) => {
            if (error) {
                res.send({
                    error,
                })
                return console.log(chalk.red.bold('Error:'), error)
            }

            forecast(latitude, longitude, (error, { summary, temperature, precipProbability } = {}) => {
                if (error) {
                    res.send({
                        error,
                    })
                    return console.log(chalk.red.bold('Error:'), error)
                }

                res.send({
                    addressInput: req.query.address,
                    geocodeAddress: place_name,
                    latitude,
                    longitude,
                    forecast: summary,
                    temperature,
                    precipProbability,
                })

                console.log(chalk.magenta('-------------------------------------------'))
                console.log('The coordinates for ' + chalk.magenta.bold(place_name) + ' are:')
                console.log(chalk.bold('Latitude: ') + latitude)
                console.log(chalk.bold('Longitude: ') + longitude)
                console.log()
                console.log(chalk.bold('Weather Report:'))
                console.log(summary + ' It is currently ' + temperature +
                    ' degrees out. There is a ' + precipProbability +
                    '% chance of rain.')
                console.log(chalk.magenta('-------------------------------------------'))
            })
        })
    }
})

// video 54, trasteando con querys
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    res.send({
        products: [],
    })

})

// Ruta para otro error 404 más específico
// Tiene que ir antes de la 404 general.
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error 404',
        name: 'Nicolás de Amador',
        errorMessage: 'Help article not found.',
    })
})

/* Ruta de la página de error 404.
Tiene que ir en último lugar, antes de la lina para arrancar el servidor
ya que cuando express recibe un request empieza a buscar un match en
orden, y si encuentra el * antes de su objetivo, devolvera la 404.
* (wildcard character) = "match anything that hasn't been matched so far." */
app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error 404',
        name: 'Nicolás de Amador',
        errorMessage: 'Page not found.',
    })
})



/* Start up the server (listen on a specific port):
3000 is a common development port.
The other (second) optional argument is a callback function which runs
when the server is up and running. The process of starting up a server
is an asynchornous process (though almost instant).
The server remains up until we terminate it (That's why the terminal
does not go back to the command prompt until we do ctrl+c). 
To access our local develoment host in the browser: localhost:3000*/
app.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})