const express = require('express'); // Importa la biblioteca 'express' para crear el servidor web
const qrcode = require('qrcode'); // Importa la biblioteca 'qrcode' para generar códigos QR
const { Client } = require('whatsapp-web.js'); // Importa la biblioteca 'whatsapp-web.js' y obtiene la clase 'Client'

const app = express(); // Crea una nueva instancia de 'express'
const client = new Client(); // Crea una nueva instancia de 'Client' de whatsapp-web.js

let generatedQRCode = '';

// Evento 'qr': se activa cuando se genera un nuevo código QR
client.on('qr', qr => {
  generateQRCode(qr);
});

// Función para generar el código QR y guardar la imagen
function generateQRCode(qrCodeContent) {
  qrcode.toDataURL(qrCodeContent, (err, url) => {
    if (err) {
      console.error(err);
    } else {
      generatedQRCode = url;
      console.log('QR Code generated!');
    }
  });
}

// Evento 'ready': se activa cuando el cliente de 'whatsapp-web.js' está listo
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

// Evento 'message': se activa cuando se recibe un mensaje
client.on('message', message => {
  console.log(message.body); // Imprime en la consola el contenido de cada mensaje que recibe el cliente de 'whatsapp-web.js'
});

// Evento 'message': se activa cuando se recibe un mensaje específico
client.on('message', message => {
  if (message.body === 'Hola' || message.body === '¿Cómo estas?' || message.body === 'ola') {
    message.reply('HEY NODEJS *ESTE ES UN MENSAJE AUTOMATICO*'); // Responde automáticamente a ciertos mensajes con un mensaje predefinido
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000'); // Inicia el servidor web en el puerto 3000 y muestra un mensaje en la consola
});

app.use(express.urlencoded({ extended: true })); // Configura 'express' para procesar datos de formulario

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Enruta la ruta raíz del servidor al archivo 'index.html'
});

app.get('/qr-code', (req, res) => {
  res.send(`<img src="${generatedQRCode}" alt="QR Code">`); // Muestra la imagen generada del código QR
});

app.post('/', (req, res) => {
  const number = req.body.number; // Obtiene el número de teléfono de la solicitud POST
  const text = req.body.text; // Obtiene el texto del mensaje de la solicitud POST

  // Verifica si el número de teléfono está registrado en WhatsApp
  client.isRegisteredUser(number).then(function (isRegistered) {
    if (isRegistered) {
      client.sendMessage(number, text); // Si el número está registrado, envía el mensaje utilizando 'whatsapp-web.js'
    }
  });

  res.send('Mensaje enviado correctamente.'); // Envía una respuesta al cliente indicando que el mensaje se ha enviado correctamente
});

client.initialize(); // Inicializa el cliente de 'whatsapp-web.js'