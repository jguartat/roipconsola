'use strict';

class IndexController{
	constructor(){}
	index(req,res){
		res.send("Api RoipConsola");
	}
}

const indexController=new IndexController();
module.exports= indexController;