'use strict';
class Service_Cookie{
	constructor(){}
	setCookie(cname,cvalue,exdays){
		let d=new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		let expires=`expires=${d.toUTCString()}`;
		document.cookie=`${cname}=${cvalue};${expires};path=/`;
	}
	getCookie(cname){
		let name = cname + "=";
		let ca = document.cookie.split(';');
		for(let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' '){
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
	checkCookie(cname){
		return this.getCookie(cname)==""?false:true;
	}
	deleteAllCookies(){
		let cookieArray=document.cookie.split("; ");
		cookieArray.forEach(cookie=>{
			let s=cookie.indexOf("=");
			name=cookie.substring(0,s);
			document.cookie=`${name}= ;max-age=0`;
		});
	}
}

export const service_Cookie=new Service_Cookie();