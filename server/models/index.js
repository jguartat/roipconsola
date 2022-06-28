'use strict';
const {Sequelize} = require('sequelize');
const ObjUsers = require('./users-model.js');
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
		this.user="postgres";
		this.password="j0$u3p0$79r3$";
		this.dbname="totemroip";
		this.ip="localhost";
		this.port=5432;
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
		await this.cnx.sync({alter:true});
	}
}

const postgresCnx=new PostgresCnx();
postgresCnx.start();
postgresCnx.syncUp();
