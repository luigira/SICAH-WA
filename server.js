const qrcode = require('qrcode-terminal'); // Importa la biblioteca 'qrcode-terminal' para generar códigos QR
const { Client } = require('whatsapp-web.js'); // Importa la biblioteca 'whatsapp-web.js' y obtiene la clase 'Client'
const client = new Client(); // Crea una nueva instancia de 'Client' de whatsapp-web.js

const express = require('express'); // Importa la biblioteca 'express' para crear el servidor web
const app = express(); // Crea una nueva instancia de 'express'

app.use(express.urlencoded({ extended: true })); // Configura 'express' para procesar datos de formulario

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Enruta la ruta raíz del servidor al archivo 'index.html'
});

app.post('/', (req, res) => {
  const number = req.body.number; // Obtiene el número de teléfono de la solicitud POST
  const text = req.body.text; // Obtiene el texto del mensaje de la solicitud POST

  client.isRegisteredUser(number).then(function (isRegistered) { // Verifica si el número de teléfono está registrado en WhatsApp
    if (isRegistered) {
      client.sendMessage(number, text); // Si el número está registrado, envía el mensaje utilizando 'whatsapp-web.js'
    }
  });

  res.send('Mensaje enviado correctamente.'); // Envía una respuesta al cliente indicando que el mensaje se ha enviado correctamente

});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true }); // Genera un código QR para la autenticación y lo muestra en la consola
});

client.on('ready', () => {
  console.log('Client is ready!'); // Imprime un mensaje en la consola cuando el cliente de 'whatsapp-web.js' está listo
//   const number = "5215583526554@c.us"; // Número de teléfono de destino para enviar un mensaje de prueba
//   const text = "Hey desde NodeJS"; // Texto del mensaje de prueba

//   client.isRegisteredUser(number).then(function (isRegistered) { // Verifica si el número de teléfono está registrado en WhatsApp
//     if (isRegistered) {
//       client.sendMessage(number, text); // Si el número está registrado, envía el mensaje de prueba utilizando 'whatsapp-web.js'
//     }
//   });
});

client.on('message', message => {
  console.log(message.body); // Imprime en la consola el contenido de cada mensaje que recibe el cliente de 'whatsapp-web.js'
});

client.on('message', message => {
  if (message.body === 'Hola' || message.body === '¿Cómo estas?' || message.body === 'ola') {
    message.reply('HEY NODEJS *ESTE ES UN MENSAJE AUTOMATICO*'); // Responde automáticamente a ciertos mensajes con un mensaje predefinido
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000'); // Inicia el servidor web en el puerto 3000 y muestra un mensaje en la consola
});

client.initialize(); // Inicializa el cliente de 'whatsapp-web.js'

