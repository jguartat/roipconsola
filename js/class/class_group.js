'use strict';

export class Cl_Group{
	constructor(id,jsonGroup){
		this.id=id;
		this.name=jsonGroup.name;
		this.ext=jsonGroup.ext;
		this.description=jsonGroup.description;
		this.portws=jsonGroup.portws;
		this.authorization_user=jsonGroup.authorization_user;
		this.sippassword=jsonGroup.sippassword;
		this.ipserver=jsonGroup.ipserver;
		this.portserver=jsonGroup.portserver;
	}
	get wsConnectionString(){
		return "ws://localhost:"+this.portws;
	}
	get wsProtocol(){
		return  "com-protocolo";
	}
}