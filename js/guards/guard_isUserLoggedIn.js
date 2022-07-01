'use strict';
import {service_Cookie} from '../services/service_cookie.js';
import {router} from '../routing/router.js';
export class Guard_isUserLoggedIn{
	constructor(){
		this.router=router;
	}
	canActivate(){
		let hasAccessToken=service_Cookie.checkCookie('accessToken');
		if(!hasAccessToken){
			this.router.load('login');
			return false;
		}else{
			return true;
		}
	}
}