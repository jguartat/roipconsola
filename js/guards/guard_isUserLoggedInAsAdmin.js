'use strict';
import {service_Cookie} from '../services/service_cookie.js';
import {router} from '../routing/router.js';
import {service_Encryption} from '../services/service_encryption.js';
export class Guard_isUserLoggedInAsAdmin{
	constructor(){
		this.router=router;
	}
	canActivate(){
		let loggedInAs=service_Encryption.decrypt(service_Cookie.checkCookie('loggedInAs'));
		if(loggedInAs!="admin"){
			this.router.load('comunications');
			return false;
		}else{
			return true;
		}
	}
}