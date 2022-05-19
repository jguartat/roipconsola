"use strict";
import {enviarAWS,WS} from '../WS.js';
/*
	codigo para el navegador para audio
	
	se conecta por websocket local con el node audio.js
*/

// --------------- websocket ------------------ 

var ws = new WS();

function connectWS(url, protocolo){
	ws.connect(url, protocolo);
	
	ws.setDebugging(true);
	
	ws.binaryType = "arraybuffer";
	
	ws.on("open", function(){
		console.log("conectado");
	});
	
	ws.on("message", onMessageWS);
	
	ws.on("error", function(error){
		console.error(error);
	});
	
	ws.on("close", function(){
		console.log("Desconectado");
	
		// reconectar
		setTimeout(function(){
			ws.connect(url, protocolo);
		},15*1000);
	})
}

function onMessageWS(m){
	console.log("mensaje recibido");
		
	if (m instanceof ArrayBuffer){
		fn_procesarArrayBuffer(m);
	} else if (m instanceof Blob){
		console.log(m instanceof Blob)
		blob2arrayBuffer(m, function (err, ab){
			if (! err){
				console.log("ArrayBuffer? "+ ab instanceof ArrayBuffer)
				fn_procesarArrayBuffer(ab);
			}
		})
	} else {
		console.log("Mensaje es texto. Tiene que ser ArrayBuffer");
	}
}

// fileReader lea Blob y devuelve 
function blob2arrayBuffer(blob, cb){
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

connectWS("ws://localhost:6505", "com-protocolo");

// ---------------- procesar mensaje -------------------
// m: binario
var paqueteAudio = null;
var listoParaReproducirBl = false;	// false: todavia no hay audioCtx

// independiente de lo que debe reproducir lo guarda
function fn_procesarArrayBuffer(m){
	// es audio -> reproduce PCM 16 Bit (si es little o big endian no se sabe)
	if (listoParaReproducirBl){
		fn_reproduceAudioPCM(m);
	} else {
		paqueteAudio = m;
	}
}

// ---------------- reproducion audio ------------------

var audioCtx = null;

// binAudio tiene que ser TypedArray con PCM.
// -> reproduce PCM 16 Bit, mono tiene que ser little endian
function fn_reproduceAudioPCM(binAudio){
	var word;
	
	if (! audioCtx){
		// hay que llamar fn_iniciarReproducion antes
		return;
	}

	var dv = new DataView(binAudio);
	
	var frameCount = Math.floor(dv.byteLength / 2);

	console.log(frameCount);
	
	var myAudioBuffer = audioCtx.createBuffer(1, frameCount, 16000);	// 1 canal -> mono
	var nowBuffering = myAudioBuffer.getChannelData(0 ,16,16000);   // canal[0]
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
	var source = audioCtx.createBufferSource();
	// set the buffer in the AudioBufferSourceNode
	source.buffer = myAudioBuffer;
	// connect the AudioBufferSourceNode to the
	// destination so we can hear the sound
	source.connect(audioCtx.destination);
	// start the source playing
	source.start(0);
	
	console.log("audioCtx.state:" + audioCtx.state)
}

export function fn_iniciarReproducion(){
	if (! audioCtx){
		try {
		  var AudioContext = window.AudioContext || window.webkitAudioContext;
		  audioCtx = new AudioContext();
		  
		  if (audioCtx){
			listoParaReproducirBl = true;
		  }
		} catch(e) {
		  console.error('Reprodución de audio no es supportado en este navigador');
		  alert('Reprodución de audio no es supportado en este navigador');
		}	
	} else {
		listoParaReproducirBl = true;
	}
	
	if (paqueteAudio !== null){
		// ya reproduce ultimo paquete
		fn_reproduceAudioPCM(paqueteAudio);
		paqueteAudio = null;
	}
}

export function fn_terminarReproducion(){
	listoParaReproducirBl = false; // pausar reproducion
}	

// ------------ interface usuario ---------

/*document.getElementById('reproduceAudio').onclick = function(e)
{ 
	e.preventDefault();
	
	fn_iniciarReproducion()		// iniciar reproducion
	
}

document.getElementById('apagaAudio').onclick = function(e)
{ 
	e.preventDefault();
	
	fn_terminarReproducion();	// pausar reproducion
	
}*/

/*
// reproduce archivos de audio (pero no puros paquetes de PCM)
function fn_reproduceAudioPCM(binAudio){
	if (! audioCtx){
		return;
	}
	
	var source = audioCtx.createBufferSource();
	
	audioCtx.decodeAudioData(binAudio, function(buffer) {
		source.buffer = buffer;

		source.connect(audioCtx.destination);
		source.loop = false;
		
		source.start(0);
	  },
	  function(e){ 
		console.log("Error decoding audio data " + e); 
	});

}
*/