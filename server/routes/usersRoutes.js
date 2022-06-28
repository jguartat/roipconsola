'use strict';
const express=require("express");
const usersControllers=require('../controllers/usersControllers.js');

class UsersRoutes{
	router=express.Router();
	constructor(){
		this.config();
	}
	config(){
		this.router.get('/',usersControllers.list);
		this.router.get('/:uuid',usersControllers.getOne);
		this.router.post('/',usersControllers.create);
		this.router.delete('/:uuid',usersControllers.delete);
		this.router.put('/:uuid',usersControllers.update);
	}

}

const usersRoutes = new UsersRoutes();
module.exports=usersRoutes.router;