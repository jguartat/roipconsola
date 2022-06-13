"use strict";

export var ws_con=new WS();

export function WS(){
	var socket = null;
	var debug = false;
	var isOpen = false;
	var onOpenFunction = null, onCloseFunction = null, onErrorFunction = null, onMessageFunction = null;
	this.on = function(name, c){
		switch(name){
			case "open":{
				onOpenFunction = c;
			}break;
			case "close":{
				onCloseFunction = c;
			}break;
			case "error":{
				onErrorFunction = c;
			}break;
			case "message":{
				onMessageFunction = c;
			}break;
			default:{
				console.error("There's no event suitable for: "+name);
			}
		}
	}
	this.connect = function(url, options){
		if(!socket || !(socket instanceof WebSocket)){
			let opts = options || [];
			socket = new WebSocket(url, opts);
			if(debug){
				console.info("WebSocket connection state: "+socket.readyState);
			}
			socket.onopen = function(){
				//let isOpen;
				if(debug){
					console.info("WebSocket connection state: "+socket.readyState);
				}
				if(socket.readyState === 1){
					isOpen = true;
					console.info("WebSocket connected!");
				}
				if(onOpenFunction){
					onOpenFunction({isOpen:isOpen,timestamp:Date.now()});
				}
			};
			socket.onclose = function(){
				//let isOpen;
				if(debug){
					console.info("WebSocket connection state: "+socket.readyState);
					if(socket.readyState === 3){
						console.info("WebSocket connection state: "+socket.readyState);
						isOpen = false;
						console.info("WebSocket closed!");
						socket = null;
					}
				}
				if(onCloseFunction){
					onCloseFunction({isOpen:isOpen,timestamp:Date.now()});
				}
			}
			socket.onerror = function(e){
				if(debug){
					console.info("WebSocket connection state: "+socket.readyState);
					console.error(e);
				}
				sendError(e);
			}
			socket.onmessage = function(m){
				if(onMessageFunction){
					onMessageFunction(m.data);
				};
			}
		}else{
			console.error("ERROR: WebSocket must be closed first!");
			console.log(socket);
		}
	}
	this.disconnect = function(){
		if(socket && (socket instanceof WebSocket)){
			socket.close();
		}else{
			console.error("ERROR: WebSocket must be opened first!");
		}
	}
	this.send = function(o){
		if(socket instanceof WebSocket){
			if(socket.readyState === 1){//CONNECTION IS MADE AND IT'S POSSIBLE TO SEND MESSAGES
				switch(typeof o){
					case "object":{
						try{
							o = JSON.stringify(o);
						}catch(e){//TODO: RAISE AN ERROR EVENT
							console.error(e);
							sendError(e);
						}
					}break;
					default:{
						if(typeof o !== "string"){//TODO: RAISE AN ERROR EVENT!
							sendError("dataType not allowed");
						}
					}
				}
				socket.send(o);
				if(debug){
					console.info("Message sent! Total amount of bytes sent: "+socket.bufferedAmount);
				}
			}else{//CONNECTION IS CLOSED OR IT HAS NOT BEEN ESTABLISHED YET! TODO: RAISE AN ERROR EVENT
				sendError("WebSocket not ready!");
			}
		}else{
			console.error("ERROR: WebSocket must be opened before sending data!");
		}
	}
	this.setDebugging = function(b){
		if (typeof b === "boolean"){
			debug = b;
		}else{
			console.error("This method does not accepts '"+typeof b+"' variables!");
		}
	}
	function sendError(e){
		if(onErrorFunction){
			onErrorFunction({isOpen:isOpen,timestamp:Date.now(),error:e})
		}
	}
}
export function enviarAWS(msg){
	if(ws_con !== null){
		ws_con.send(msg);
	}
}