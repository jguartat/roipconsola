'use strict';

export class Cl_Group{
	constructor(jsonGroup){
		this.uuid=null;
		this.name=jsonGroup.name;
		this.ext=jsonGroup.ext;
		this.description=jsonGroup.description;
		this.authorization_user=jsonGroup.authorization_user;
		this.sippassword=jsonGroup.sippassword;
		this.ipserver=jsonGroup.ipserver;
		this.portserver=jsonGroup.portserver;
	}
	json(){
		return {
			uuid:this.uuid,
			name:this.name,
			ext:this.ext,
			description:this.description,
			authorization_user:this.authorization_user,
			sippassword:this.sippassword,
			ipserver:this.ipserver,
			portserver:this.portserver
		};
	}
}