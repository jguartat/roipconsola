"use strict";
/*
	get audio con audiorecorder
	permite capturar audio de la pc para poder transmitir al server
*/
var audioRecorder=require('./recording/audiorecorder.js').audioRecorder;

/*
	ptt - push to talk: 
	audio para la consola
	
	Este node permite la consola la comunicación por udp:
	Entre consola y node hay una conexion por websocket.
	Y el node puede enviar y recibir paquetes udp.
	
*/

const debugModo = true;

const puertoUDPrecibir = 50005;			// recibir del servidor con ('localhost' + puertoUDPrecibir)
const puertoUDPenviar = 50005;			// enviar al servidor  con (ipServer + puertoUDPenviar)

var ipServer = '10.0.0.4';				// + puertoUDPenviar 

const puertoWebsocket = 6505;			// el navegador (client) se conecta por este puerto de websocket a audio.js

/*
	Exceptions (errores no esperados) 
*/
var fs = require('fs');
var  uncaughtExceptions = 0
,    uncaughtExceptionNombreArchivo = "uncaughtExceptions_audio_"+Date.now()+".json.log";

process.on('uncaughtException', function(err) {
  console.error('¡Ojo! Ocurrió un "uncaught exception":');
  console.error(err.stack);
  uncaughtExceptions++;
  
	try {
		//	para debugging: apunta tambien en un archivo (para cada inicio del msbroker un archivo nuevo)
		// 	porque podria ser un problema frequente cuida que solo ocupa pocos recursos
		if (uncaughtExceptions <= 10){
			var protocoloError = {
				tipo: "uncaught exception",
				estado: { 
					enlineaDesde: process.uptime(),
					timestamp: Date.now(),
					memoria: process.memoryUsage(),
					uncaughtExceptions: uncaughtExceptions
				},
				error: err.message,
				stack: err.stack
			}

			fs.appendFile(uncaughtExceptionNombreArchivo, JSON.stringify(protocoloError), {encoding: 'utf8', flags : 'w'}, function ( err) {
				if (err){
					console.error('"uncaught exception" no apuntado en archivo')
				}
			})
		}
	} catch (e){
		console.error('"uncaught exception" no apuntado en archivo:'+e.stack);
	}
	
});
			
/*

	Server UDP

*/

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('error', function (err) {
  console.log("server error:\n" +err.stack);
  server.close();
});
 
// msgUdp es del tipo Buffer -> es mensaje binario
server.on('message', function (msgUdp, rinfo) {
  ipServer = rinfo.address;	// la ip de donde enviado
  let tam=msgUdp.length;
console.log("udp recibido con tamaño:", tam);
  // por websocket a la consola
  if (tam > 100){
	enviaWs(msgUdp);
  }
});

server.on('listening', function () {
  var address = server.address();
  console.log("Udp server listening " + address.address + ":" + address.port);
});

server.bind(puertoUDPrecibir);

// de websocket por udp al server
function enviarUdp(message, port, ip){
	server.send(message, 0,message.length, port, ip, function (err){
		if (err){
			console.log("err enviar udp: "+err)
		}
	});
}

/*

	Server websocket

*/
	
var WebSocketServer = require('websocket').server  
,	http   		= require('http');

var serverHttp = http.createServer(function(request, response) {
    console.error(""+(new Date()) + ' Esperando comunicación solo por websockets pero ha recibido request por http ' + request.url);
    response.writeHead(404);	// 404 "Not Found"
    response.end();
});

// solo local !
// arancar servidor websocket (escuchar solo a conexiones locales)
serverHttp.listen(
	{
		host: 'localhost',
		port: puertoWebsocket
	}, function() {
    console.log(""+(new Date()) + ' Servidor es escuchando por coneciónes de websocket con puerto '+puertoWebsocket);
});

var wsServerInterno = new WebSocketServer({
    httpServer: serverHttp,
    autoAcceptConnections: false,
	dropConnectionOnKeepaliveTimeout: true, // con timeout  (false es para apagarlo) 
	maxReceivedFrameSize: 10485760,		// 10 MB
	maxReceivedMessageSize: 10485760	// 10 MB
});

var wsConexion;

// recibe conexiones de websockets
function fn_onRequest (request) {
	var wsConexionLocal;
	
	if (debugModo){
		console.log("request de conectar con websocket detectado")
	}
	
	// datos individuales para la conexion
	var	requestedProtocols = request.requestedProtocols	// lo que quiere el client (array debe tener 'com-protocolo')
	,	protocoloAceptado = null;

	if (typeof requestedProtocols !== 'object'){
		return;
	}
	
	for (var i = 0, l= requestedProtocols.length; i < l; i++){
		if (requestedProtocols[i].toLowerCase() === "com-protocolo"){
			protocoloAceptado = requestedProtocols[i];
			break; // encontrado
		}
	}
	
	if (protocoloAceptado === null){
		// negar conexion
		request.reject(404, "Protocolo no conocido")
		console.error("Protocolo pedido no existe. Protocol requerido: "+JSON.stringify(request.protocol))
		return;
	}
		
	// crear conexion
	wsConexionLocal = request.accept(protocoloAceptado, request.origin);
	
	// evento: cerar conexion websocket
	wsConexionLocal.on('close', function(reasonCode, description){  
		if (debugModo) console.log(""+(new Date()) + ' conexion de websocket desconectado.');
		wsConexionLocal.removeAllListeners();
		wsConexionLocal = null;
	});
	
	// evento: recibir mensaje (utf8 o binario) por websocket
	wsConexionLocal.on('message', function(message) {
    if (message.type == 'utf8') {
			console.log("Por websocket mensaje de texto recibido: "+message.utf8Data);
			let msgutf8JSON=JSON.parse(message.utf8Data);
			switch(msgutf8JSON.tipo){
				case 'habilitar':
					console.log("se debe de capturar audio y enviar");
					audioRecorder.start();
					audioRecorder.stream().on('data', (chunk)=> {
						let aux=Buffer.from(chunk),
								tamaux=aux.length,
								pedacito=640;
						for(let i=0;i<tamaux;){
							let auxsend=aux.slice(i,pedacito+i);
							console.log("udp enviando consola: ",auxsend.length);
							enviarUdp(auxsend,puertoUDPenviar,ipServer);
							if(auxsend.length){
								i+=pedacito;
							}
						}
					});
					
					break;
				case 'deshabilitar':
					console.log("se debe detener la captura de audio y no enviar");
					audioRecorder.stop();
					break;
			}
			
		} else {
			// no es texto -> tiene que ser binario
			
			// udp: enviar mensaje audio
			enviarUdp(message.binaryData, puertoUDPenviar, ipServer);	
		} 
	});
	
	// usable por enviarWs
	wsConexion = wsConexionLocal;
	
	// simula audio por archivos:
	// fn_envia();	// xxx
} 

// m es un Buffer (Buffer.isBuffer(m)) == true)
function enviaWs (m){
	try {
		if (wsConexion && wsConexion.connected){
			wsConexion.sendBytes(m);
			console.log("udp enviado con tamaño: ",m.length);
		}
	} catch (e){ 
		// ignora problema temporal de conexion
		console.log(e)
	}
}

/*
var fs = require('fs');
var async = require('async');
var archivos = ["1524677388506", "1524677388530", "1524677388569", "1524677388628","1524677388649", "1524677388723", "1524677388729", "1524677388768", "1524677388833", "1524677388849",
"1524677388833","1524677388849","1524677388889","1524677388928","1524677388968","1524677389008","1524677389048","1524677389088","1524677389129","1524677389173","1524677389209","1524677389249","1524677389293","1524677389329","1524677389373"];
function fn_envia(){
	async.forEach(archivos, function (nombreArchivo, cb){
		fs.readFile(nombreArchivo + '.pcm', function (err, data) {
			if (err){
				console.error("Fracasó leer el archivo: "+err)
			} else {
				enviaWs(data);
				console.log(data.length)
				console.log("audio enviado")
			}
			
			setTimeout(function (){
				cb(null);
			}, 19)
		})
	})
}
*/

// arranca servidor local (solo escuchando a localhost)
wsServerInterno.on('request', fn_onRequest);
 
// evento de terminar el node
['exit','SIGPIPE','SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function(element, index, array) {
  process.on(element, function(signal){

	console.log("Terminando ahora por "+signal)
	wsServerInterno.shutDown();

	process.removeAllListeners();
	setTimeout(function (){process.exit();},500)
  });
});

