'use strict';
import {environment} from '../../environments/environment.js';

class Service_Encryption{
	constructor(){
		this.secretKey=environment.secretkey;
	}
	encrypt(value){
		return CryptoJS.AES.encrypt(value,this.secretKey).toString();
	}
	decrypt(encryptedValue){
		return CryptoJS.AES.decrypt(encryptedValue,this.secretKey).toString(CryptoJS.enc.Utf8);
	}
}

export const service_Encryption=new Service_Encryption();