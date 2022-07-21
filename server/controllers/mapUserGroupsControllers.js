'use strict';
const bcrypt=require('bcrypt');
const jsonwebtoken=require('jsonwebtoken');
const ObjMapUserGroups=require('../models/mapusergroups-model.js');
const environment=require('../environments/environment.js');
const ObjUsers = require('../models/users-model.js');
const ObjGroups = require('../models/groups-model.js');

class MapUserGroupsControllers{
	constructor(){
		this.secretkey=environment.secretkey;
		this.tokenExpiresIn=24*60*60;
	}
	list=async(req,res)=>{
		console.log("lista de mapeos");
		let result={message:'',data:null,error:{status:0,description:""}};
		try{
			const mappings= await ObjMapUserGroups.MapUserGroups.findAll({
				attributes:{exclude:['createdAt','updatedAt']},
				include:[
					{
						model:ObjUsers.Users,
						attributes:['email']
					},
					{
						model:ObjGroups.Groups,
						attributes:['name']
					}
				]
			});
			console.log(`All mappings: ${JSON.stringify(mappings,null,2)}`);
			result.message=(mappings.length>0)?'mappings were found':'there are no mappings to display';
			result.data=mappings;
			res.status(200).json(result);
		}
		catch(err){
			result.message='mappings were not found';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	getOne=async(req,res)=>{
		let result={message:'',data:null,error:{status:0,description:""}};
		try{
			let mapping=await ObjMapUserGroups.MapUserGroups.findOne({where:{uuid:req.params.uuid}});
			if (mapping===null){
				result.message='mapping not found';
				result.error.status=1;
				result.error.description='mapping is not in database'
				res.status(404).json(result);
			}else{
				result.message='mapping was found';
				result.data=mapping;
				result.error.status=0;
				res.status(200).json(mapping);
			}
		}catch(err){
			result.message='mapping was not found';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	create=async(req,res)=>{
		let mapping=ObjMapUserGroups.MapUserGroups.build(req.body);
		let result={message:'',error:{status:0,description:""}};
		try{
			await mapping.save();
			result.message='mapping is saved';
			res.status(200).json(result);
		}catch(err){
			result.message='mapping is not saved';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	delete=async(req,res)=>{
		let result={message:'',error:{status:0,description:""}};
		try{
			await ObjMapUserGroups.MapUserGroups.destroy({where:{uuid:req.params.uuid}});
			result.message='mapping has been deleted';
			res.status(200).json(result);
		}catch(err){
			result.message='mapping has not been deleted';
			result.error.status=1;
			result.error.description=err;
			res.status(500).json(result);
		}
	}
	update=async(req,res)=>{
		req.body.admin=eval(req.body.admin);
		let result={message:'',error:{status:0,description:""}};
		try{
			await ObjMapUserGroups.MapUserGroups.update(req.body,{where:{uuid:req.params.uuid}});
			result.message='mapping has been updated';
			res.status(200).json(result);
		}catch(err){
			result.message='mapping has not been updated';
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

const mapUserGroupsControllers=new MapUserGroupsControllers();
module.exports=mapUserGroupsControllers;