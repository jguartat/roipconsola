'use strict';
const {Sequelize} = require('sequelize');
const bcrypt=require('bcrypt');
const ObjUsers = require('./users-model.js');
const ObjGroups = require('./groups-model.js');
const ObjMapUserGroups = require('./mapusergroups-model.js');
const environment = require('../environments/environment.js');
class PostgresCnx{
	cnx=null;
	urlCnx="";
	user="";
	password="";
	ip="";
	port="";
	dbname="";
	constructor(){
		this.config();
	}
	config(){
		this.user=environment.postgres_user;
		this.password=environment.postgres_password;
		this.dbname=environment.postgres_dbname;
		this.ip=environment.postgres_ip;
		this.port=environment.postgres_port;
		this.urlCnx=`postgres://${this.user}:${this.password}@${this.ip}:${this.port}/${this.dbname}`;
	}
	async start(){
		this.cnx=new Sequelize(this.urlCnx);
		try{
			await this.cnx.authenticate();
			console.log(`Connected to database: ${this.dbname}`);
		}catch(err){
			console.error('Unable to connect to the database: ',err);
		}
	}
	async syncUp(){
		ObjUsers.create(this.cnx);
		ObjGroups.create(this.cnx);
		ObjMapUserGroups.create(this.cnx);

		ObjUsers.Users.hasOne(ObjMapUserGroups.MapUserGroups);
		ObjMapUserGroups.MapUserGroups.belongsTo(ObjUsers.Users);

		ObjGroups.Groups.hasOne(ObjMapUserGroups.MapUserGroups);
		ObjMapUserGroups.MapUserGroups.belongsTo(ObjGroups.Groups);

		await this.cnx.sync({alter:true});
	}
	async createUserDefault(){
		let match={
				where:{email:environment.system_defaultUserAdmin}
			},
			userDefault={
				admin:true,
				email:environment.system_defaultUserAdmin,
				password:bcrypt.hashSync(environment.system_defaultPasswordAdmin,10)
			};
		let count=await ObjUsers.Users.count(match);
		if(count==0){
			const [instance,created]=await ObjUsers.Users.upsert(userDefault);
			if(created){
				console.log("User default created");
			}
		}
	}
}

const postgresCnx=new PostgresCnx();
postgresCnx.start();
postgresCnx.syncUp();
postgresCnx.createUserDefault();
