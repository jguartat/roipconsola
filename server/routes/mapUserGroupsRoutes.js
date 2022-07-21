'use strict';
const express=require("express");
const mapUserGroupsControllers=require('../controllers/mapUserGroupsControllers.js');

class MapUserGroupsRoutes{
	router=express.Router();
	constructor(){
		this.config();
	}
	config(){
		this.router.get('/',mapUserGroupsControllers.verifyToken,mapUserGroupsControllers.list);
		this.router.get('/:uuid',mapUserGroupsControllers.verifyToken,mapUserGroupsControllers.getOne);
		this.router.post('/',mapUserGroupsControllers.verifyToken,mapUserGroupsControllers.create);
		this.router.delete('/:uuid',mapUserGroupsControllers.verifyToken,mapUserGroupsControllers.delete);
		this.router.put('/:uuid',mapUserGroupsControllers.verifyToken,mapUserGroupsControllers.update);
	}

}

const mapUserGroupsRoutes = new MapUserGroupsRoutes();
module.exports=mapUserGroupsRoutes.router;