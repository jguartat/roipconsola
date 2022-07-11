'use strict';
const express=require("express");
const usersControllers=require('../controllers/usersControllers.js');

class UsersRoutes{
	router=express.Router();
	constructor(){
		this.config();
	}
	config(){
		this.router.get('/',usersControllers.verifyToken,usersControllers.list);
		this.router.get('/:uuid',usersControllers.verifyToken,usersControllers.getOne);
		this.router.post('/login',usersControllers.login);
		this.router.post('/',usersControllers.verifyToken,usersControllers.create);
		this.router.delete('/:uuid',usersControllers.verifyToken,usersControllers.delete);
		this.router.put('/:uuid',usersControllers.verifyToken,usersControllers.update);
		this.router.put('/changepassword/:uuid',usersControllers.verifyToken,usersControllers.changePassword);
	}

}

const usersRoutes = new UsersRoutes();
module.exports=usersRoutes.router;