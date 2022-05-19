'use strict';
import {Subject} from './class_subject.js';

export class Observable extends Subject{
	constructor(value){
		super();
		this.value=value;
	}
	notify(value){
		this.value=value;
		super.notify(this);
	}
	get get_value(){
		return this.get_value;
	}
	set set_value(value){
		this.value=value;
	}
}