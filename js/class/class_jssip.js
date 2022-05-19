'use strict';
export class Cl_JsSip{
	constructor(ip,port,ext,password){
		this.ip=ip;
		this.port=port;
		this.ext=ext;
		this.password=password;
		this.socket=this.createSocket();
		this.configuration=this.createConfiguration();
		this.ua=new JsSIP.UA(this.configuration);
		
		this.call=null;
		this.audio=$("<audio id='"+this.ext+"' controls><p>Your browser noesn't support HTML5 audio.</p></audio>").
			css({'opacity':0.9});
		this.icoLed=$(document.createElement('i'))
			.addClass('bi bi-circle-fill')
			.css({'color':'black'});

		this.dtmfEvent=()=>{};
		this.peerconnectionEvent=()=>{};
	}
	connect(){
		this.ua.start();
		this.ua.register();
	}
	incomingCallEvent(){
		this.ua.on('newRTCSession',e=>{
			this.call=e.session;
			if(this.call.direction==='incoming' ){
				this.call.on('peerconnection',epc=>{
					console.log('incoming event peerconnection: ',epc);
					this.peerconnectionEvent();
					//this.call.connection es igual a epc.peerconnection
					if(epc.peerconnection.addTrack!==undefined){
						epc.peerconnection.ontrack=et=>{
			  				this.audio.get(0).srcObject=et.streams[0];
			  				this.audio.get(0).play();
						};
					}
					this.icoLed.css({'color':'#157347'});

				});
				this.call.on('sdp',esdp=>{
					console.log('iconmingevent sdp: ',esdp);
					//esdp=esdp.sdp.replace('RTP/AVPF','UDP/TLS/RTP/SAVPF');
				});
				this.call.on('failed',ef=>{
					console.log('iconmingevent Failed originator: ',ef);
				});
				this.call.on('progress',ep=>{
					console.log("incoming event progress: ",ep);
				});
				this.call.on('newDTMF',edtmf=>{
					console.log('iconmingevent edtmf: ',edtmf);
					this.dtmfEvent(edtmf);
				});
				this.call.on('newInfo',eni=>{
					console.log('iconmingevent newInfo: ',eni);
				});
				this.call.on('endend',eend=>{
					console.log('incomingevent ended: ',ended);
				});
				let options={
					'mediaConstraints':{
						'audio':true,'video':false,
					},
				};
				this.call.answer(options);
			}
		});
	}
	disconnect(){
		this.ua.stop();
	}
	createSocket(){
		return new JsSIP
			.WebSocketInterface('wss://'+this.ip+':'+this.port+'/ws');
	}
	createConfiguration(){
		var configuration = {
			sockets  : [ this.socket ],
			uri      : 'sip:'+this.ext+'@'+this.ip,
			password : this.password
		};
		return configuration
	}
	callSession(targetExt){
		let eventHandlers={
				'progress':e=>{
					console.log('outgoingevent progress');
				},
				'failed':e=>{
					console.log('outgoingevent failed with cause: '+ e.cause);
					this.call=null;
				},
				'ended':e=>{
					console.log('outgoingevent ended with cause: '+ e.cause);
				},
				'confirmed':e=>{
					console.log('outgoingevent call confirmed');
					this.sendDTMF('1',160);
				}
			},
			options={
				'eventHandlers'    : eventHandlers,
	  			'mediaConstraints' : { 'audio': true, 'video': false }
			};
			this.call=this.ua.call('sip:'+targetExt+'@'+this.ip,options);
		
	}
	hangup(){
		if(this.call){
			this.call.terminate();
			this.call=null;
		}
	}
	termitatesOngoingCalls(){
		this.ua.terminateSessions();
		this.call=null;
	}
	sendDTMF(tone,duration){
		let options={
			'duration':duration
		};
		if(this.call && this.call.isEstablished()){
			console.log('sendDTMF tone:',tone);
			this.call.sendDTMF(tone,options);
		}
	}
}

//export var objJsSip=new Cl_JsSip('192.168.107.23',8089,105,'12345');
