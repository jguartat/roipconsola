'use strict';
const bcrypt=require('bcrypt');
const ObjUsers=require('../models/users-model.js');

class UsersControllers{
	constructor(){}
	async list(req,res){
		console.log("lista de usuarios");
		let result={message:'',data:null,error:{status:0,description:""}};
		try{
			const users= await ObjUsers.Users.findAll({
				attributes:{exclude:['createdAt','updatedAt']}
			});
			console.log(`All users: ${JSON.stringify(users,null,2)}`);
			result.message=(users.length>0)?'users were found':'there are no users to display';
			result.data=users;
			res.status(200).json(result);
		}
		catch(err){
			result.message='users were not found';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	async getOne(req,res){
		let user=await ObjUsers.Users.findOne({where:{uuid:req.params.uuid}});
		if (user===null){
			res.status(404).json({text:'user not found'});
		}else{
			res.status(500).json(user);
		}
	}
	async create(req,res){
		req.body.admin=eval(req.body.admin);
		req.body.password=bcrypt.hashSync(req.body.password,10);
		let user=ObjUsers.Users.build(req.body);
		let result={message:'',error:{status:0,description:""}};
		try{
			await user.save();
			result.message='user is saved';
			res.status(200).json(result);
		}catch(err){
			result.message='user is not saved';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	async delete(req,res){
		let result={message:'',error:{status:0,description:""}};
		try{
			await ObjUsers.Users.destroy({where:{uuid:req.params.uuid}});
			result.message='user has been deleted';
			res.status(200).json(result);
		}catch(err){
			result.message='user has not been deleted';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	async update(req,res){
		req.body.admin=eval(req.body.admin);
		if((req.body.password!=null || req.body.password!=undefined)){
			if(req.body.password.length==0){delete req.body.password;}
			else{req.body.password=bcrypt.hashSync(req.body.password,10);}
		}
		let result={message:'',error:{status:0,description:""}};
		try{
			await ObjUsers.Users.update(req.body,{where:{uuid:req.params.uuid}});
			result.message='user has been updated';
			res.status(200).json(result);
		}catch(err){
			result.message='user has not been updated';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
}

const usersControllers=new UsersControllers();
module.exports=usersControllers;