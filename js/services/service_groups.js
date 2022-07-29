'use strict';
import {service_Cookie} from './service_cookie.js';
import {environment} from '../../environments/environment.js';

export class Service_Groups{
	API_URI= '';
	constructor(){
		this.API_URI=environment.api_uri;
	}
	getToken(){
		return service_Cookie.getCookie('accessToken');
	}
	getGroups(resolve,reject){
		$.ajax({
			type:"GET",
			url:`${this.API_URI}/groups`,
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
	getUnassignedGroups(resolve,reject){
		$.ajax({
			type:"GET",
			url:`${this.API_URI}/groups/unassignedList`,
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
	getGroup(uuid,resolve,reject){
		$.ajax({
			type:"GET",
			url:`${this.API_URI}/groups/${uuid}`,
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
	saveGroup(user,resolve,reject){
		$.ajax({
			type:"POST",
			url:`${this.API_URI}/groups`,
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
	deleteGroup(uuid,resolve,reject){
		$.ajax({
			type:"DELETE",
			url:`${this.API_URI}/groups/${uuid}`,
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
	updateGroup(uuid,user,resolve,reject){
		$.ajax({
			type:"PUT",
			url:`${this.API_URI}/groups/${uuid}`,
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
}