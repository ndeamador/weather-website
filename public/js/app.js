var icons = new Skycons({ "color": "#333333" });
icons.play();


/* Fetch is not part of Javascript it's a client-side API, which means
it's something we can use in all modern browsers, but it's not accessible
in node.js, so we can only use it in client-side js files. */

/* fetch('http://localhost:3000/weather?address=Segovia').then((response) => {
    response.json().then((data) => {
        if (data.error) {
            console.log(data.error)
        } else {
            console.log(data.geocodeAddress)
            console.log(data.forecast)
        }
    })
}) */

// Ahora enlazamos la caja de busqueda con su funcionalidad:
// Devuelve una representación en javascript del elemento, por eso
// la guardamos en una constante por si hay que usarla en el futuro.
// En roman paladin, da acceso al form del archivo html.
const weatherForm = document.querySelector('form')
// Da acceso al <input> dentro de la <form> del html.
const search = document.querySelector('input')

// Acceso a los mensajes tras búsqueda del html:
// const messageOne = document.querySelector('p') no nos vale
// porque es un nombre genérico y simplemente va a coger el
// primero que encuentre, así que creamos ids en el html
// y por ser ids las seleccionamos con # delante del nombre.
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const messageThree = document.querySelector('#message-3')
const titleOne = document.querySelector('#title-1')
const titleTwo = document.querySelector('#title-2')

// cambiar el contenido de los parrafos de arriba en html:
// messageOne.textContent = 'mensaje numero uno'
// messageOne.textContent = 'mensaje numero 2'
// El resultado final lo dejamos justo antes y dentro de fetch.




/*
weatherForm.addEventListener('submit', () => {

console.log('testing')
})
 Si lo hacemos sin nada más, al pulsar el botón de búsqueda
"testing" solo aparece por una fracción de segundo ya que el 
navegador se vuelve a cargar completamente y borra el mensaje.
Es el comportamiento por defecto de "forms". Para evitar que
la página se carge por completo cada vez que hagamos una búsaqueda:
*/

weatherForm.addEventListener('submit', (e) => { //e stands for event, it's common in web development.
    e.preventDefault() // previene el comportamiento por defecto de la form

    const location = search.value

    // limpiamos el valor que el parrafo pudiese tener de una busqueda anterior.



    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''
    messageThree.textContent = ''
    titleOne.textContent = ''
    titleTwo.textContent = ''

    var bigIcon = document.getElementById("big-icon")
    var smallIcon = document.getElementById("small-icon")
    bigIcon.style.display="none"
    smallIcon.style.display="none"

    fetch(`/weather?address=${location}`).then((response) => {       

        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                bigIcon.style.display="block"
                smallIcon.style.display="block"
                const dotBigIcon = (data.icon.toUpperCase()).replace(/-/g, '_') // la g es para reemplazar todos los guiones, no solo el primero.
                const dotSmallIcon = (data.todayIcon.toUpperCase()).replace(/-/g, '_')
                console.log(dotBigIcon)
                console.log(data.icon)
                console.log(data.todayIcon)
                console.log(dotSmallIcon)

                icons.set("big-icon", Skycons[dotBigIcon])
                icons.set("small-icon", Skycons[dotSmallIcon])

                titleOne.textContent = 'Right now:'
                titleTwo.textContent = 'Today:'
                messageOne.textContent = `The forecast for ${data.geocodeAddress} (latitude: ${data.latitude}, longitude ${data.longitude}) is:`
                messageTwo.textContent = `${data.forecast}. It is currently ${data.temperature} degrees Celsius out. There is a ${data.precipProbability}% chance of rain.`
                messageThree.textContent = `Today's expected highest temperature is ${data.temperatureHigh} ºC and the lowest is ${data.temperatureLow} ºC. ${data.todaySummary}`
            }
        })
    })
})
