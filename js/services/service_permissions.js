'use strict';
import {service_Cookie} from './service_cookie.js';
import {service_Encryption} from './service_encryption.js';
export class Service_Permissions{
	constructor(){}
	static getMenu(){
		let loggedInAs=service_Encryption.decrypt(service_Cookie.getCookie('loggedInAs'));
		let menu=[];
		let pathname=window.location.pathname.replace("/","");
		switch(loggedInAs){
			case 'admin':
				menu=[
					{name:'Comunicación',path:'comunications',active:pathname=='comunications'},
					{name:'Usuarios',path:'users',active:pathname=='users'},
					{name:'Grupos',path:'groups',active:pathname=='groups'}
				]
				break;
			case 'operator':
				menu=[
					{name:'Comunicación',path:'comunications',active:pathname=='comunications'}
				];
				break;
		}
		return menu;
	}
}