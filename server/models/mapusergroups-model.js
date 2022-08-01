'use strict';
const {Sequelize, DataTypes, Models} = require('sequelize');

class MapUserGroupsModel{
	constructor(){
		this.MapUserGroups=null;
	}
	create(cnx){
		this.MapUserGroups=cnx.define("mapusergroups",{
			uuid:{
				type:DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				allowNull:false,
				primaryKey:true
			}
		},{
			indexes:[
				{
					unique:true,
					fields:['userUuid','groupUuid']
				}
			]
		});
	}
}

const ObjMapUserGroups=new MapUserGroupsModel();
module.exports = ObjMapUserGroups;