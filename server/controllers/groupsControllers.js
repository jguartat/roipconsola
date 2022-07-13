'use strict';
const bcrypt=require('bcrypt');
const jsonwebtoken=require('jsonwebtoken');
const ObjGroups=require('../models/groups-model.js');
const environment=require('../environments/environment.js');

class GroupsControllers{
	constructor(){
		this.secretkey=environment.secretkey;
		this.tokenExpiresIn=24*60*60;
	}
	list=async(req,res)=>{
		console.log("lista de grupos");
		let result={message:'',data:null,error:{status:0,description:""}};
		try{
			const groups= await ObjGroups.Groups.findAll({
				attributes:{exclude:['createdAt','updatedAt']}
			});
			console.log(`All groups: ${JSON.stringify(groups,null,2)}`);
			result.message=(groups.length>0)?'groups were found':'there are no groups to display';
			result.data=groups;
			res.status(200).json(result);
		}
		catch(err){
			result.message='groups were not found';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	getOne=async(req,res)=>{
		let result={message:'',data:null,error:{status:0,description:""}};
		try{
			let group=await ObjGroups.Groups.findOne({where:{uuid:req.params.uuid}});
			if (group===null){
				result.message='group not found';
				result.error.status=1;
				result.error.description='group is not in database'
				res.status(404).json(result);
			}else{
				result.message='group was found';
				result.data=group;
				result.error.status=0;
				res.status(200).json(group);
			}
		}catch(err){
			result.message='group was not found';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	create=async(req,res)=>{
		let group=ObjGroups.Groups.build(req.body);
		let result={message:'',error:{status:0,description:""}};
		try{
			await group.save();
			result.message='group is saved';
			res.status(200).json(result);
		}catch(err){
			result.message='group is not saved';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	delete=async(req,res)=>{
		let result={message:'',error:{status:0,description:""}};
		try{
			await ObjGroups.Groups.destroy({where:{uuid:req.params.uuid}});
			result.message='group has been deleted';
			res.status(200).json(result);
		}catch(err){
			result.message='group has not been deleted';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	update=async(req,res)=>{
		req.body.admin=eval(req.body.admin);
		let result={message:'',error:{status:0,description:""}};
		try{
			await ObjGroups.Groups.update(req.body,{where:{uuid:req.params.uuid}});
			result.message='group has been updated';
			res.status(200).json(result);
		}catch(err){
			result.message='group has not been updated';
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

const groupsControllers=new GroupsControllers();
module.exports=groupsControllers;