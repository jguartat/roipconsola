'use strict';
const bcrypt=require('bcrypt');
const jsonwebtoken=require('jsonwebtoken');
const ObjUsers=require('../models/users-model.js');
const environment=require('../environments/environment.js');

class UsersControllers{
	constructor(){
		this.secretkey=environment.secretkey;
		this.tokenExpiresIn=24*60*60;
	}
	list=async(req,res)=>{
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
	getOne=async(req,res)=>{
		let result={message:'',data:null,error:{status:0,description:""}};
		try{
			let user=await ObjUsers.Users.findOne({where:{uuid:req.params.uuid}});
			if (user===null){
				result.message='user not found';
				result.error.status=1;
				result.error.description='user is not in database'
				res.status(404).json(result);
			}else{
				result.message='user was found';
				result.data=user;
				result.error.status=0;
				res.status(200).json(user);
			}
		}catch(err){
			result.message='user was not found';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	login=async(req,res)=>{
		req.body.admin=eval(req.body.admin);
		let result={message:'',data:null,error:{status:0,description:""}};
		try{
			let user=await ObjUsers.Users.findOne({where:{email:req.body.email}});
			
			if (user===null){
				result.message='user not found';
				result.error.status=1;
				result.error.description='user is not in database'
				res.status(404).json(result);
			}else{
				const resultPassword=bcrypt.compareSync(req.body.password,user.password);
				const validProfile=user.admin || (req.body.admin==user.admin?true:false);
				if(resultPassword && validProfile){
					result.message='user was found';
					result.data=user;
					result.accessToken=jsonwebtoken.sign(
						{uuid:user.uuid},
						this.secretkey,
						{expiresIn:this.tokenExpiresIn}
					);
					result.error.status=0;
					res.status(200).json(result);
				}else{
					result.message='user was not found';
					result.error.status=1;
					res.status(200).json(result);	
				}
			}
		}catch(err){
			result.message='user was not found';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	create=async(req,res)=>{
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
	delete=async(req,res)=>{
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
	update=async(req,res)=>{
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
	changePassword=async(req,res)=>{
		let result={message:'',error:{status:0,description:""}};
		if((req.body.currentpassword!=null || req.body.currentpassword!=undefined)){
			if(req.body.currentpassword.length==0){
				result.message='password not valid';
				result.status=1;
				result.description='password should be 8 characters long';
				res.status(404).json(result);
			}
		}
		if((req.body.newpassword!=null || req.body.newpassword!=undefined)){
			if(req.body.newpassword.length==0){
				result.message='new password not valid';
				result.status=1;
				result.description='new password should be 8 characters long';
				res.status(200).json(result);
			}
		}
		try{
			let user=await ObjUsers.Users.findOne({where:{uuid:req.params.uuid}});
			let resultPassword=bcrypt.compareSync(req.body.currentpassword,user.password);
			if(user===null || !resultPassword){
				result.message='password is incorrect';
				result.error.status=1;
				result.error.description='password does not match';
				res.status(400).json(result);
			}else{
				req.body.password=bcrypt.hashSync(req.body.newpassword,10);
				delete req.body.currentpassword;
				delete req.body.newpassword;
				await ObjUsers.Users.update(req.body,{where:{uuid:req.params.uuid}});
				result.message='user has been updated';
				res.status(200).json(result);
			}
		}catch(err){
			result.message='user has not been updated';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	verifyToken=(req,res,next)=>{
		let result={message:'',error:{status:0,description:''}};
		if(!req.headers.authorization){
			result.message='unauthorized request';
			result.error.status=1;
			result.error.description='no authorization token';
			return res.status(401).json(result);
		}
		const token=req.headers.authorization.split(" ")[1];
		try{
			let payload=jsonwebtoken.verify(token,this.secretkey);
			if(token === null){
				result.message='unauthorized request';
				result.error.status=1;
				result.error.description='no authorization token';
				return res.status(401).json(result);
			}
			req.uuid=payload.uuid;
			next();
		}catch(err){
			result.message='unauthorized request';
			result.error.status=1;
			result.error.description=err;
			return res.status(401).json(result);
		}
	}
}

const usersControllers=new UsersControllers();
module.exports=usersControllers;