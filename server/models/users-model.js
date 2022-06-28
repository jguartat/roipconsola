'use strict';
const {Sequelize, DataTypes, Models} = require('sequelize');

class UsersModel{
	constructor(){
		this.Users=null;
	}
	create(cnx){
		this.Users=cnx.define("users",{
			uuid:{
				type:DataTypes.UUID,
				defaultValue:DataTypes.UUIDV4,
				allowNull:false,
				primaryKey:true
			},
			admin:{
				type:DataTypes.BOOLEAN,
			},
			email:{
				type:DataTypes.STRING,
				allowNull:false,
				unique:true//'someIndex'
			},
			password:{
				type:DataTypes.STRING,
				allowNull:false
			}
		},{
			indexes:[
				{
					unique:true,
					fields:['email'],
					name: 'someIndex'
				}
			]
		});
	}
}

const ObjUsers=new UsersModel();
module.exports = ObjUsers;