"use strict";
import {WS} from '../WS.js';

export class Cl_AudioBrowser{
	constructor(){
		this.ws=new WS();
		//Para procesar mensaje--------
		this.paqueteAudio=null;
		this.listoParaReproducirBl=false;// false: todavia no hay this.audioCtx
		//Para reproducir audio----------
		this.audioCtx=null;
		this.reconnect=false;
		//Events
		this.connectEvent=()=>{};
		this.disconnectEvent=()=>{};
	}
	connectWS(url, protocolo){
		this.ws.connect(url, protocolo);
		this.ws.setDebugging(true);
		this.ws.binaryType = "arraybuffer";
		this.ws.on("open", ()=>{
			console.log("conectado");
			this.connectEvent();
		});
		this.ws.on("message", m=>{this.onMessageWS(m)});
		this.ws.on("error", (error)=>{console.error(error);});
		this.ws.on("close", ()=>{
			console.log("Desconectado");
			this.disconnectEvent();
			if(this.reconnect){
				setTimeout(()=>{
					this.ws.connect(url, protocolo);
				},8*1000);
			}
		})
	}
	disconnectWS(){
		this.ws.disconnect();
	}
	onMessageWS(m){
		console.log("mensaje recibido");
		if (m instanceof ArrayBuffer){
			this.procesarArrayBuffer(m);
		} else if (m instanceof Blob){
			console.log(m instanceof Blob);
			this.blob2arrayBuffer(m, (err, ab)=>{
				if (! err){
					console.log("ArrayBuffer? "+ ab instanceof ArrayBuffer);
					this.procesarArrayBuffer(ab);
				}
			});
		} else {
			console.log("Mensaje es texto. Tiene que ser ArrayBuffer");
		}
	}
	blob2arrayBuffer(blob, cb){
		// fileReader lea Blob y devuelve 
		var fileReader = new FileReader()
		,	cbHechoBl = false;
		
		fileReader.onloadend = function(e) {
			if (cbHechoBl){
				return;
			}

			cbHechoBl = true;
			cb(null, fileReader.result );
		};

		fileReader.onerror = function () {
			if (cbHechoBl){
				return;
			}
			cbHechoBl = true;
			cb("error");
		}
		fileReader.readAsArrayBuffer(blob);
	}
	procesarArrayBuffer(m){
		//Para procesar mensaje
		//m:binario
		// independiente de lo que debe reproducir lo guarda
		// es audio -> reproduce PCM 16 Bit (si es little o big endian no se sabe)
		if (this.listoParaReproducirBl){
			this.reproduceAudioPCM(m);
		} else {
			this.paqueteAudio = m;
		}
	}
	reproduceAudioPCM(binAudio){
		//Para reproducir audio
		// binAudio tiene que ser TypedArray con PCM.
		// -> reproduce PCM 16 Bit, mono tiene que ser little endian
		var word;
		
		if (! this.audioCtx){
			// hay que llamar iniciarReproducion antes
			return;
		}

		var dv = new DataView(binAudio);
		
		var frameCount = Math.floor(dv.byteLength / 2);

		console.log(frameCount);
		
		var myAudioBuffer = this.audioCtx.createBuffer(1, frameCount, 8000);	// 1 canal -> mono, 8kHz
		var nowBuffering = myAudioBuffer.getChannelData(0 ,16,8000);   // canal[0]
		for (var i = 0; i < frameCount; i++) {
			// audio needs to be in [-1.0; 1.0] -> lea byte por byte 16 unsigned integer y convierte lo a [-1.0; 1.0]
			
			// supone little endian 
			word = (dv.getUint8(i * 2) & 0xff) + ((dv.getUint8(i * 2 + 1) & 0xff) << 8);
			/* version para big endian seria:
			word = ((dv.getUint8(i * 2) & 0xff) << 8) + (dv.getUint8(i * 2 + 1) & 0xff)
			*/
			// word esta ahora un 16 unsigned integer entre 0 y 65535
			// ((word + 32768) % 65536 - 32768) -> 16 bit signed integer entre -32768 y 32767
			// / 32768 -> float entre -1 y 1
			
			nowBuffering[i] = ((word + 32768) % 65536 - 32768) / 32768.0;
		}
		
		console.log("nowBuffering:"+nowBuffering.length)
		// Get an AudioBufferSourceNode.
		// This is the AudioNode to use when we want to play an AudioBuffer
		var source = this.audioCtx.createBufferSource();
		// set the buffer in the AudioBufferSourceNode
		source.buffer = myAudioBuffer;
		// connect the AudioBufferSourceNode to the
		// destination so we can hear the sound
		source.connect(this.audioCtx.destination);
		// start the source playing
		source.start(0);
		
		console.log("this.audioCtx.state:" + this.audioCtx.state)
	}
	iniciarReproducion(){
		//Para reproducir audio
		if (! this.audioCtx){
			try {
			  var AudioContext = window.AudioContext || window.webkitAudioContext;
			  this.audioCtx = new AudioContext();
			  
			  if (this.audioCtx){
				this.listoParaReproducirBl = true;
			  }
			} catch(e) {
			  console.error('Reprodución de audio no es supportado en este navigador');
			  alert('Reprodución de audio no es supportado en este navigador');
			}	
		} else {
			this.listoParaReproducirBl = true;
		}
		
		if (this.paqueteAudio !== null){
			// ya reproduce ultimo paquete
			this.reproduceAudioPCM(this.paqueteAudio);
			this.paqueteAudio = null;
		}
	}
	terminarReproducion(){
		//Para reproducir audio
		this.listoParaReproducirBl = false; // pausar reproducion
	}

}