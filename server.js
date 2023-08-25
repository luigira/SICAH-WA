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
  listenMessage(); // Llama a la función para iniciar la escucha del chatbot
 const number = "5644673893@c.us"; // Número de teléfono de destino para enviar un mensaje de prueba
  const text = "Hey desde NodeJS"; // Texto del mensaje de prueba

   client.isRegisteredUser(number).then(function (isRegistered) { // Verifica si el número de teléfono está registrado en WhatsApp
    if (isRegistered) {
       client.sendMessage(number, text); // Si el número está registrado, envía el mensaje de prueba utilizando 'whatsapp-web.js'
     }
   });
});

// Evento 'message': se activa cuando se recibe un mensaje
client.on('message', message => {
  console.log(message.body); // Imprime en la consola el contenido de cada mensaje que recibe el cliente de 'whatsapp-web.js'
});

//Función para enviar mensajes
const sendMessage = (to, message) => {
  client.sendMessage(to, message)
}

//Función para el chatbot flow
const listenMessage = () => {
  client.on('message', (msg) => {
    const { from, body } = msg;
    let txt = body.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

              //Algoritmo de deteccion de mensajes
              //Saludo
              if(txt === 'hola' || txt === 'ola' || txt === 'buenos dias' || txt === 'buenas tardes' || txt === 'buenas noches' || txt === 'buen dia'){
                  if(report.has(from)){
                      sendMessage(from, 'Hola de nuevo, ¿Cómo puedo ayudarte hoy?, si deseas cerrar tu sesión, envía un 0 (cero)');
                  }
                  else{
                      sendMessage(from, 'Hola! Bienvenido al sistema de comunicaciones de Capital Humano de ESIME Zacatenco. ¿Cómo puedo ayudarte hoy? \n Tienes las siguientes opciones para elegir: \n \n 1) Escribe "Horarios" para consultar los horarios de servicio de Capital Humano. \n 2) Escribe "Faltas" para verificar tus inasistencias. \n 3) Escribe "Avisos" para recibir anuncios generales. \n Escribe un 0 (cero) para cerrar tu sesión.');
                  }
// Opciones
} else if (txt === '1' || txt === 'Horarios' || txt === 'horarios') {
  sendMessage(from, 'Nuestro horario de oficina es de 9:00 AM a 5:00 PM, de lunes a viernes. Estamos cerrados los fines de semana y días festivos.');
} else if (txt === '2' || txt === 'Faltas' || txt === 'faltas') {
  sendMessage(from, 'Para proteger la privacidad de los empleados, necesito que proporciones algunos detalles de verificación. Por favor, ingresa tu CURP');
  report.set(from, ['1']);
} else if (txt === '3' || txt === 'Avisos' || txt === 'avisos') {
  sendMessage(from, 'No hay avisos por el momento');
// Agrega el flujo para la solicitud especial al final del bloque listenMessage
} else if (txt === '0') {
  report.delete(from);
  if (report.has(from)) report.delete(from);
  console.log(`Sesion finalizada por ${from}`);
  sendMessage(from, 'Sesión finalizada, Hasta luego');
  sendGoodbyeMessage(from); // Llama a la función para enviar el mensaje de despedida
} else {
  sendMessage(from, 'Lamento informarte que no puedo ayudar con esa solicitud específica. Por favor selecciona alguna de las opciones disponibles o bien contacta a nuestro equipo de Capital Humano para obtener más ayuda.');
}

console.log(from, txt);
});

              // Función para enviar el mensaje de despedida
const sendGoodbyeMessage = (to) => {
  const goodbyeMessage = "¡Gracias por usar nuestro asistente de Capital Humano! ¡Que tengas un excelente día!";
  sendMessage(to, goodbyeMessage);
};

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

client.initialize();//Inicializa el cliente de 'whatsapp-web.js'