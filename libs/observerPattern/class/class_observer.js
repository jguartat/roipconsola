'use strict';
export class Observer{
	constructor(){
		this.trigger=null;
	}
	set set_trigger(mifuncion){
		this.trigger=mifuncion;
	}
	notify(subject){
		if(this.trigger!=null){
			this.trigger(subject);
		}
	}
}