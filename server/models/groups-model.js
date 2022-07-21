'use strict';
const {Sequelize, DataTypes, Models} = require('sequelize');

class GroupsModel{
	constructor(){
		this.Groups=null;
	}
	create(cnx){
		this.Groups=cnx.define("groups",{
			uuid:{
				type:DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				allowNull:false,
				primaryKey:true
			},
			name:{
				type:DataTypes.STRING,
				allowNull:false
			},
			ext:{
				type:DataTypes.INTEGER,
				allowNull:false,
				unique:true//'someIndex'
			},
			description:{
				type:DataTypes.STRING,
				allowNull:false
			},
			authorization_user:{
				type:DataTypes.INTEGER,
				allowNull:false
			},
			sippassword:{
				type:DataTypes.STRING,
				allowNull:false
			},
			ipserver:{
				type:DataTypes.STRING,
				allowNull:false
			},
			portserver:{
				type:DataTypes.INTEGER,
				allowNull:false
			}
		},{
			indexes:[
				{
					unique:true,
					fields:['ext'],
					name: 'extIndex'
				}
			]
		});
	}
}

const ObjGroups=new GroupsModel();
module.exports = ObjGroups;