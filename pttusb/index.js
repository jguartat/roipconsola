'use strict';
const Service_WebSocket=require('./services/service_websocket.js');
const Service_PTTusb=require('./services/service_pttusb.js');


let service_WebSocket=new Service_WebSocket(3000,'pttusb-protocol'),
		service_PTTusb= new Service_PTTusb('VID_1A86&PID_7523',9600,{'cct':true,'debug':false});
service_WebSocket.httpServerListen(()=>{
	console.log(""+(new Date()) + ' Servidor es escuchando por conexiónes de websocket con puerto '+service_WebSocket.port);
});
service_WebSocket.requestEventWebSocketServer();

service_PTTusb.findSerialPort();
service_PTTusb.listenDataEvent((data)=>{
	console.log('Data: ',data);
	let message={
		'type':'pttusb_transmitting',
		'data':data,
		'timestamp':Date.now()
	};
	if(service_WebSocket.cnx!=null){
		service_WebSocket.cnx.send(JSON.stringify(message));
	}
});
service_PTTusb.triggerDisconnectEvent=()=>{
		let message={
			'type':'pttusb_disconnected',
			'timestamp':Date.now()
		};
		if(service_WebSocket.cnx!=null){
			service_WebSocket.cnx.send(JSON.stringify(message));
		}
};