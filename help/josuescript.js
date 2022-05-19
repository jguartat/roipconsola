#! /usr/bin/env node
'use strict';
//---------------------------------------------------------------------
const {DgramAsPromised} = require("dgram-as-promised");
const socket = DgramAsPromised.createSocket("udp4");
 
const MEMBERSHIP = /*"170.150.120.6";*/"192.168.107.21";
const PORT = 50005;
let enviarUdp = async (message,port,ip)=>{
  const bytes = await socket.send(message, 0, message.length, port, ip);
}
//----------------------------------------------------------------------
var transmiteptt = () => {
  var fs   = require('fs');
  const { Writable } = require('stream');
  var options={
    fd:3
  };
  const audio=fs.createReadStream(null,options);
  //const audio=fs.createReadStream('/var/lib/asterisk/sounds/es/agent-loggedoff.g722');
  const outStream = new Writable({
    write(chunk, encoding, callback) {
      let aux=Buffer.from(chunk),
          tamaux=aux.length,
          pedacito=640;
          for(let i=0;i<tamaux;){
            let auxsend=aux.slice(i,pedacito+i);
            console.log("udp enviando asterisk: ",auxsend.length);
            enviarUdp(auxsend,PORT,MEMBERSHIP);
            if(auxsend.length){
              i+=pedacito;
            }
          }
      callback();
    }
  });
  audio.pipe(outStream);
};
//----------------------------------------------------------------------
/*const WebSocketClient = require('websocket').client;
const wsclient = new WebSocketClient();
const credentials = {tipo:"login", nombre:"ext105", contrasenia:"ext105"};
var ptt = {"tipo":null,"grupo":null,"uuid":null,"token":null};
var token=null, uuid=null, grupo='grp4dB2JLFN';
wsclient.connect('ws://170.150.120.6:6504','com-protocolo');
wsclient.on('connect',connection=>{
  console.log("WebSocket Client Connected");
  connection.on('message',message=>{
    if(message.type === 'utf8'){
      let jsonmessage=JSON.parse(message.utf8Data);
      switch(jsonmessage.tipo){
        case 'loginRespuesta':
          token=jsonmessage.token;
          uuid=jsonmessage.uuid;
          console.log(token);
          if(token != null){
            ptt.tipo="envia";
            ptt.grupo=grupo;
            ptt.uuid=uuid;
            ptt.token=token;
          }
          console.log("login: ",JSON.stringify(ptt));
          connection.send(JSON.stringify(ptt));
          break;
        case "enviaRespuesta":
          console.log("enviaRespuesta: ",jsonmessage);
          if(jsonmessage.resultado=="si"){
            console.log("instancia ptt: tenemos permiso de enviar");
            transmiteptt();
          }
          break;
        case "terminoRespuesta":
          console.log("terminoRespuesta: ",jsonmessage);
          if(jsonmessage.error.status==0){
            console.log("instancia ptt: servidor informa que ya dejó de recibir audio");
          }
      }
    }
  });
  var login = ()=>{
    if(connection.connected){
      let login=credentials;
      connection.send(JSON.stringify(login));
    }
  }
  login();
});
wsclient.on('connectFailed',(error)=>{
  console.log('Connect Error: ' + error.toString());
});*/
//----------------------------------------------------------------------
transmiteptt();