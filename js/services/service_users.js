'use strict';
import {service_Cookie} from './service_cookie.js';
import {environment} from '../../environments/environment.js';

export class Service_Users{
	API_URI= '';
	constructor(){
		this.API_URI=environment.api_uri;
	}
	getToken(){
		return service_Cookie.getCookie('accessToken');
	}
	getUsers(callback){
		$.ajax({
			type:"GET",
			url:`${this.API_URI}/users`,
			dataType:"json",
			headers:{'Authorization':`Bearer ${this.getToken()}`}
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
			dataType:"json",
			headers:{'Authorization':`Bearer ${this.getToken()}`}
		})
		.done(function(data){
			console.log(data);
			callback(data);
		})
		.fail(function(xhr,status,err){console.log("Error: ",err);})
		.always();
	}
	loginUser(user,callback){
		$.ajax({
			type:"POST",
			url:`${this.API_URI}/users/login`,
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
	saveUser(user,callback){
		$.ajax({
			type:"POST",
			url:`${this.API_URI}/users`,
			dataType:"json",
			data:user,
			headers:{'Authorization':`Bearer ${this.getToken()}`}
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
			dataType:"json",
			headers:{'Authorization':`Bearer ${this.getToken()}`}
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
			data:user,
			headers:{'Authorization':`Bearer ${this.getToken()}`}
		})
		.done(function(data){
			console.log(data);
			callback(data);
		})
		.fail(function(xhr,status,err){console.log("Error: ",err);})
		.always();	
	}
}