'use strict';

export class Service_Users{
	API_URI= '';
	constructor(){
		this.API_URI='http://localhost:4000/api';
	}
	getUsers(callback){
		$.ajax({
			type:"GET",
			url:`${this.API_URI}/users`,
			dataType:"json"
		})
		.done(function(data){
			console.log(data);
			callback(data);
		})
		.fail(function(xhr,status,err){console.log("Error: ",err);})
		.always();
	}
	getUser(uuid,callback){
		$.ajax({
			type:"GET",
			url:`${this.API_URI}/users/${uuid}`,
			dataType:"json"
		})
		.done(function(data){
			console.log(data);
			callback(data);
		})
		.fail(function(xhr,status,err){console.log("Error: ",err);})
		.always();
	}
	saveUser(user,callback){
		$.ajax({
			type:"POST",
			url:`${this.API_URI}/users`,
			dataType:"json",
			data:user
		})
		.done(function(data){
			console.log(data);
			callback(data);
		})
		.fail(function(xhr,status,err){console.log("Error: ",err);})
		.always();
	}
	deleteUser(uuid,callback){
		$.ajax({
			type:"DELETE",
			url:`${this.API_URI}/users/${uuid}`,
			dataType:"json"
		})
		.done(function(data){
			console.log(data);
			callback(data);
		})
		.fail(function(xhr,status,err){console.log("Error: ",err);})
		.always();
	}
	updateUser(uuid,user,callback){
		$.ajax({
			type:"PUT",
			url:`${this.API_URI}/users/${uuid}`,
			dataType:"json",
			data:user	
		})
		.done(function(data){
			console.log(data);
			callback(data);
		})
		.fail(function(xhr,status,err){console.log("Error: ",err);})
		.always();	
	}
}