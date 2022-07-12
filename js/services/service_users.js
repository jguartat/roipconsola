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
	getUsers(resolve,reject){
		$.ajax({
			type:"GET",
			url:`${this.API_URI}/users`,
			dataType:"json",
			headers:{'Authorization':`Bearer ${this.getToken()}`}
		})
		.done(function(data){
			console.log(data);
			resolve(data);
		})
		.fail(function(xhr,status,err){
			console.log("Error: ",err);
			console.log("Status: ",status);
			reject(xhr.responseJSON);
		})
		.always();
	}
	getUser(uuid,resolve,reject){
		$.ajax({
			type:"GET",
			url:`${this.API_URI}/users/${uuid}`,
			dataType:"json",
			headers:{'Authorization':`Bearer ${this.getToken()}`}
		})
		.done(function(data){
			console.log(data);
			resolve(data);
		})
		.fail(function(xhr,status,err){
			console.log("Error: ",err);
			console.log("Status: ",status);
			reject(xhr.responseJSON);
		})
		.always();
	}
	loginUser(user,resolve,reject){
		$.ajax({
			type:"POST",
			url:`${this.API_URI}/users/login`,
			dataType:"json",
			data:user
		})
		.done(function(data){
			console.log(data);
			resolve(data);
		})
		.fail(function(xhr,status,err){
			console.log("Error: ",err);
			console.log("Status: ",status);
			reject(xhr.responseJSON);
		})
		.always();
	}
	saveUser(user,resolve,reject){
		$.ajax({
			type:"POST",
			url:`${this.API_URI}/users`,
			dataType:"json",
			data:user,
			headers:{'Authorization':`Bearer ${this.getToken()}`}
		})
		.done(function(data){
			console.log(data);
			resolve(data);
		})
		.fail(function(xhr,status,err){
			console.log("Error: ",err);
			console.log("Status: ",status);
			reject(xhr.responseJSON);
		})
		.always();
	}
	deleteUser(uuid,resolve,reject){
		$.ajax({
			type:"DELETE",
			url:`${this.API_URI}/users/${uuid}`,
			dataType:"json",
			headers:{'Authorization':`Bearer ${this.getToken()}`}
		})
		.done(function(data){
			console.log(data);
			resolve(data);
		})
		.fail(function(xhr,status,err){
			console.log("Error: ",err);
			console.log("Status: ",status);
			reject(xhr.responseJSON);
		})
		.always();
	}
	updateUser(uuid,user,resolve,reject){
		$.ajax({
			type:"PUT",
			url:`${this.API_URI}/users/${uuid}`,
			dataType:"json",
			data:user,
			headers:{'Authorization':`Bearer ${this.getToken()}`}
		})
		.done(function(data){
			console.log(data);
			resolve(data);
		})
		.fail(function(xhr,status,err){
			console.log("Error: ",err);
			console.log("Status: ",status);
			reject(xhr.responseJSON);
		})
		.always();	
	}
	updateUserPassword(uuid,datapass,resolve,reject){
		$.ajax({
			type:"PUT",
			url:`${this.API_URI}/users/changepassword/${uuid}`,
			dataType:"json",
			data:datapass,
			headers:{'Authorization':`Bearer ${this.getToken()}`}
		})
		.done(function(data){
			console.log(data);
			resolve(data);
		})
		.fail(function(xhr,status,err){
			console.log("Error: ",err);
			console.log("Status: ",status);
			reject(xhr.responseJSON);
		})
		.always();	
	}
}