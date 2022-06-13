'use strict';
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

module.exports= class Service_PPTusb{
	constructor(hardwareid,baudRate,checkConnMethod){
		this.baudRate=baudRate;//9600
		this.hardwareid=hardwareid;//"VID_1A86&PID_7523";
		this.readline = SerialPort.parsers.Readline;
		this.serialport=null;
		this.parser=new Readline();
		this.idCheckingStatePTTusb=null;
		this.idReconnect=null;
		this.checkingStatePTTusb();
		this.dataEventCallback=null;

		this.chkcnm=(
			(checkConnMethod.cc==null && checkConnMethod.cct==null) || 
			(checkConnMethod.cc==undefined && checkConnMethod.cct==undefined) || 
			(checkConnMethod.cc==true && checkConnMethod.cct==true)
		)?{cc:false,cct:true}:checkConnMethod;
		this.debug=(checkConnMethod.debug==null || checkConnMethod.debug==undefined)?false:checkConnMethod.debug;
		this.dataTime=Date.now();
		this.maxDataTimeWaiting=5000; //default 5seg
		this.idCheckingConnectionTime=null;
		this.checkingConnectionTime();
		this.triggerDisconnectEvent=()=>{};
	}
	console_log(m){
		if(this.debug ){
			console.log(m);
		}
	}
	checkingConnection(){
		if(this.chkcnm.cc){
			clearTimeout(this.idReconnect);
			this.console_log("Data are still received...");
			this.idReconnect=setTimeout(()=>{
				this.triggerDisconnectEvent();
				this.console_log("No messages received. Ready to reconnect...");
				this.reconnect();
			},3000);
		}
	}
	checkingConnectionTime(){
		if(this.chkcnm.cct){
			this.idCheckingConnectionTime=setInterval(()=>{
				let newDataTime=Date.now();
				if(newDataTime-this.dataTime>this.maxDataTimeWaiting){
					this.triggerDisconnectEvent();
					this.console_log("Timeout: 5 seg");
					clearInterval(this.idCheckingStatePTTusb);
					this.reconnect();
				}else{
					this.console_log("Checking timeout: 5 seg");
				}
			},this.maxDataTimeWaiting);
		}
	}
	reconnect(){
		this.serialport=null;
		this.checkingStatePTTusb();
		this.findSerialPort();
	}
	isDevicePTTusbConnected(){
		let status=true;
		if(this.serialport==null){
			status=false;
		}
		return status;
	}
	checkingStatePTTusb(){
		this.idCheckingStatePTTusb=setInterval(()=>{
			this.console_log("Waiting for PTTusb device connection...");
			if(!this.isDevicePTTusbConnected()){
				this.findSerialPort();
			}
		},3000);
	}
	findSerialPort(){
		let listport_promise=SerialPort.list(),
			index=null;
		listport_promise.then(lp=>{
			this.console_log("Port list: ", lp);
			for(let i=0;i<lp.length;i++){
				if(lp[i].pnpId.indexOf(this.hardwareid)!=-1){
					index=i;
					i=lp.length;
				}
			}
			if(index!=null){
				this.serialport=new SerialPort(lp[index].path,{baudRate:this.baudRate});
				this.serialport.pipe(this.parser);
				this.listenOpenEvent(()=>{
					clearInterval(this.idCheckingStatePTTusb);
					this.dataTime=Date.now();
					this.console_log("Device PTTusb connected");
				});
				this.listenErrorEvent((err)=>{
					this.serialport=null;
					clearInterval(this.idCheckingStatePTTusb);
					this.console_log("An error occurred:",err);
				});
			}
		});
	}
	listenOpenEvent(callback){
		this.serialport.on('open',()=>{
			callback();
		});
	}
	listenDataEvent(callback){
		this.parser.on('data',data=>{
			this.checkingConnection();
			this.dataTime=Date.now();
			callback(data);
		});
	}
	listenErrorEvent(callback){
		this.serialport.on('error',err=>{
			callback(err);
		});
	}

}