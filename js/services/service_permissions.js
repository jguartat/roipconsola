'use strict';
import {service_Cookie} from './service_cookie.js';
import {service_Encryption} from './service_encryption.js';
export class Service_Permissions{
	constructor(){}
	static getMenu(){
		let loggedInAs=service_Encryption.decrypt(service_Cookie.getCookie('loggedInAs'));
		let menu=[];
		switch(loggedInAs){
			case 'admin':
				menu=[
					{name:'Comunicación',path:'comunications'},
					{name:'Administración',path:'administration'}
				]
				break;
			case 'operator':
				menu=[
					{name:'Comunicación',path:'comunications'}
				];
				break;
		}
		return menu;
	}
}