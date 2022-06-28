'use strict';

export class Cl_User{
	constructor(email,password){
		this.uuid=null;
		this.admin=false
		this.email=email;
		this.password=password;
	}
	json(){
		return {
			uuid:this.uuid,
			admin:this.admin,
			email:this.email,
			password:this.password
		};
	}
}