'use strict';
const express=require("express");
const indexController=require('../controllers/indexControllers.js');

class IndexRoutes{
	router=express.Router();
	constructor(){
		this.config();
	}
	config(){
		this.router.get('/',indexController.index);
	}
}
const indexRoutes=new IndexRoutes();
module.exports= indexRoutes.router;