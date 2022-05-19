"use strict";
//import {Web} from '../sip-0.20.0.js';
export class Component_SIP{
	constructor(){
		this.audio_remote=$(document.createElement('audio'))
			.attr('id','remoteAudio');
		this.btn_call=$(document.createElement('button'))
			.attr('type','button')
			.text('call')
			.addClass('btn btn-primary');
	}
	get get_component(){
		let component=$(document.createElement('div'));
		component.append(this.audio_remote);
		component.append(this.btn_call);
		return component;
	}
}