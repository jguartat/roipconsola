'use strict';

export class Cl_MapUserGroups{
	constructor(userUuid,groupUuid){
		this.uuid=null;
		this.userUuid=userUuid;
		this.groupUuid=groupUuid;

		this.userEmail=null;
		this.groupName=null;
	}
	json(){
		return {
			uuid:this.uuid,
			userUuid:this.userUuid,
			groupUuid:this.groupUuid
		}
	}
	isEmpty(){
		let empty=true;
		empty=empty && (this.uuid==null || this.uuid==undefined || this.uuid=="");
		empty=empty && (this.userUuid==null || this.userUuid==undefined || this.userUuid=="");
		empty=empty && (this.groupUuid==null || this.groupUuid==undefined || this.groupUuid=="");

		return empty;
	}
	empty(){
		this.uuid=null;
		this.userUuid=null;
		this.groupUuid=null;
	}
}