'use strict';
export class Subject{//Clase observable
	constructor(){
		this.observers=[];
	}
	subscribe(o){
		this.observers.push(o);
	}
	unsubscribe(o){
		this.observers=this.observers.filter(observer=> observer instanceof o !==true);
	}
	notify(model){
		this.observers.forEach(observer=>{
			observer.notify(model); //Observadores deben de tener un método llamado notify ( para que reciba el model=subject )
		});
	} 
}