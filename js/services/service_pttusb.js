'use strict';
import {WS} from '../class/class_ws.js';
import {service_Observer} from './service_observers.js';

class Service_PTTusb{
	constructor(ip,port,protocol){
		this.ip=ip;
		this.port=port;
		this.protocol=protocol;
		this.ws_con=new WS();
		this.ws_con.connect('ws://'+this.ip+':'+this.port,this.protocol);
		this.ws_con.setDebugging(true);
		this.waitEvents();
	}
	waitEvents(){
		this.ws_con.on('open',()=>{
			console.log('Conectado a PTTusb');
		});
		this.ws_con.on('message',m=>{
			let message=JSON.parse(m);
			console.log(message);
			let statePTT={};
			switch(message.type){
				case 'pttusb_transmitting':
					statePTT={
						"connected":true,
						"pushbutton":(message.data.toLowerCase().indexOf('off')!=-1)?'off':'on'
					}
					service_Observer.connectToPTTusbObservable.notify(statePTT);
					break;
				case 'pttusb_disconnected':
					statePTT={
						"connected":false,
						"pushbutton":'off'
					}
					service_Observer.connectToPTTusbObservable.notify(statePTT);
					break;
			}
		});
		this.ws_con.on('close',()=>{
			console.log('Desconectado de PTTusb');
			let statePTT={
				"connected":false,
				"pushbutton":'off'
			}
			service_Observer.connectToPTTusbObservable.notify(statePTT);
			setTimeout(()=>{
				this.ws_con.connect('ws://'+this.ip+':'+this.port,this.protocol);
			},5*1000);
		});
	};
}

export var service_PTTusb=new Service_PTTusb('localhost',3000,'pttusb-protocol');