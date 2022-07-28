'use strict';
import {service_Cookie} from './service_cookie.js';
import {environment} from '../../environments/environment.js';

export class Service_MapUserGroups{
	API_URI= '';
	constructor(){
		this.API_URI=environment.api_uri;
	}
	getToken(){
		return service_Cookie.getCookie('accessToken');
	}
	getMappings(resolve,reject){
		$.ajax({
			type:"GET",
			url:`${this.API_URI}/mappings`,
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
	getMapping(uuid,resolve,reject){
		$.ajax({
			type:"GET",
			url:`${this.API_URI}/mappings/${uuid}`,
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
	getMappingsByUser(uuid,resolve,reject){
		$.ajax({
			type:"GET",
			url:`${this.API_URI}/mappings/byUser/${uuid}`,
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
	saveMapping(mapping,resolve,reject){
		$.ajax({
			type:"POST",
			url:`${this.API_URI}/mappings`,
			dataType:"json",
			data:mapping,
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
	deleteMapping(uuid,resolve,reject){
		$.ajax({
			type:"DELETE",
			url:`${this.API_URI}/mappings/${uuid}`,
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
	updateMapping(uuid,mapping,resolve,reject){
		$.ajax({
			type:"PUT",
			url:`${this.API_URI}/mappings/${uuid}`,
			dataType:"json",
			data:mapping,
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