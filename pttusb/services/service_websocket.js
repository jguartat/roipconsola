'use strict';
const WebSocketServer = require('websocket').server;
const http = require('http');

module.exports= class Service_WebSocket{
	constructor(port,protocolAccepted){
		this.port=port;
		this.protocolAccepted=protocolAccepted;
		this.httpServer=this.httpCreateServer();
		this.webSocektServer=this.webSocketConfig();
		this.cnx=null;
	}
	httpCreateServer(){
		return http.createServer(function(request, response) {
			console.error(""+(new Date()) + ' Esperando comunicación solo por websockets pero ha recibido request por http ' + request.url);
			console.error(' rawHeaders: ' + request.rawHeaders);
			response.writeHead(404);	// 404 "Not Found"
			response.end();
		});
	}
	httpServerListen(callback){
		this.httpServer.listen(this.port, callback);
	}
	webSocketConfig(){
		return new WebSocketServer({
			httpServer: this.httpServer,
			autoAcceptConnections: false,
			dropConnectionOnKeepaliveTimeout: true, 	// con timeouts para detectar si conexion todavia existe   
			keepaliveInterval: 17000,			// default: 20000 ms (cada cuanto ms envia servidor un ping para provocar recibir un pong) 
			keepaliveGracePeriod: 15000,		// default: 10000 ms (tiempo esperando pong despues de cada ping (pero recibir cualquier mensaje tambien resetea counter de espera)
			maxReceivedFrameSize: 10485760,		// 10 MB
			maxReceivedMessageSize: 10485760	// 10 MB
		});
	}
	originIsAllowed(origin){
		return true;
	}
	requestEventWebSocketServer(){
		this.webSocektServer.on('request', request=>{
			if (!this.originIsAllowed(request.origin)) {
				// Make sure we only accept requests from an allowed origin
				request.reject();
				console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
				return;
			}
			this.cnx = request.accept(this.protocolAccepted, request.origin);
			console.log((new Date()) + ' Connection accepted.');
			this.cnx.on('message', message =>{
				if (message.type === 'utf8') {
					console.log('Received Message: ' + message.utf8Data);
					//this.cnx.sendUTF(message.utf8Data);
				}
				else if (message.type === 'binary') {
					console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
					this.cnx.sendBytes(message.binaryData);
				}
			});
			this.cnx.on('close', (reasonCode, description)=>{
			    console.log((new Date()) + ' Peer ' + this.cnx.remoteAddress + ' disconnected.');
			});
		});
	}
}