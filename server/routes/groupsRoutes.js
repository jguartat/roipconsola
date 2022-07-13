'use strict';
const express=require("express");
const groupsControllers=require('../controllers/groupsControllers.js');

class GroupsRoutes{
	router=express.Router();
	constructor(){
		this.config();
	}
	config(){
		this.router.get('/',groupsControllers.verifyToken,groupsControllers.list);
		this.router.get('/:uuid',groupsControllers.verifyToken,groupsControllers.getOne);
		this.router.post('/',groupsControllers.verifyToken,groupsControllers.create);
		this.router.delete('/:uuid',groupsControllers.verifyToken,groupsControllers.delete);
		this.router.put('/:uuid',groupsControllers.verifyToken,groupsControllers.update);
	}

}

const groupsRoutes = new GroupsRoutes();
module.exports=groupsRoutes.router;