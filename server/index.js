'use strict';
require("./models/index.js");
const express= require("express");
const morgan= require("morgan");
const cors= require("cors");

const indexRoutes= require("./routes/indexRoutes.js");
const usersRoutes= require("./routes/usersRoutes.js");


class Server{
	constructor(){
		this.app=express();
		this.config();
		this.routes();
	}
	config(){
		this.app.set('port',4000);
		this.app.use(morgan('dev'));
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({extended:false}));
	}
	routes(){
		this.app.use('/',indexRoutes);
		this.app.use('/api/users',usersRoutes);
	}
	start(){
		this.app.listen(this.app.get('port'),()=>{
			console.log("Server listen on port: ",this.app.get("port"));
		});
	}
}

const server=new Server();
server.start();