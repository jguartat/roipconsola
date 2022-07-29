'use strict';
import {Cl_User} from '../class/class_user.js';
import {Cl_MapUserGroups} from '../class/class_mapusergroups.js';
import {Service_Users} from '../services/service_users.js';
import {Service_MapUserGroups} from '../services/service_mapusergroups.js';
import {Observer} from '../../libs/observerPattern/class/class_observer.js';
import {service_Observer} from '../services/service_observers.js';
import {service_Cookie} from '../services/service_cookie.js';
import {router} from '../routing/router.js';

export class Component_ListUsersMonitoringGroups{
	constructor(objMapUserGroups){
		this.objMapUserGroups=objMapUserGroups;
		this.inputFilter=$(document.createElement('input'))
			.addClass('form-control mb-2')
			.attr('type','text')
			.attr('placeholder','Filtrar');
		this.list=$(document.createElement('div')).
			addClass('list-group list-group-flush');
		this.accordion=$(document.createElement('div'))
			.addClass('accordion accordion-flush')
			.attr('id','accordionUsers');
		this.usersService=new Service_Users();
		this.mapUserGroupsService=new Service_MapUserGroups();
		this.toast=null;//It is initialized from its parent component
		this.objUsersList={};
		this.objUserGroupsListToMap={};
		this.addMappingObserver=new Observer();
		this.setObserverEvent();
	}
	async requestUsers(){
		try{
			let objUsersList={},
				promise=new Promise((resolve,reject)=>{
					this.usersService.getUsers(resolve,reject);	
				}),
				result= await promise;
			if(result.error.status==0){
				result.data.forEach(userdb=>{
					let user=new Cl_User(userdb.email,userdb.password);
					user.admin=userdb.admin;
					user.uuid=userdb.uuid;
					objUsersList[user.uuid]=user;
				});				
			}else{
				this.toast.set_component({
					title:'Administración',
					message:'No se pudo cargar la lista de usuarios',
					textTime:'justo ahora',
					type:'danger'
				});
				this.toast.show();
			}
			this.objUsersList=objUsersList;
			this.fill();
		}catch(data){
			let message='Usted no está autorizado para hacer ésta petición',
				type='danger';
			if(data.error.description.name=='TokenExpiredError'){
				message="Su sesión ha terminado. ¡Vuelva a loguearse!";
				type='warning';
				service_Cookie.deleteAllCookies();
				this.toast.set_hiddenEvent=()=>{
					router.load('login');
				}
			}
			this.toast.set_component({
					title:'Administración',
					message:message,
					textTime:'justo ahora',
					type:type
				});
			this.toast.show();
		}
	}
	async requestMappings(objJson){//objJson={fillmapping:true|false}
		try{
			let objMapUserGroupsList={},
				promise=new Promise((resolve,reject)=>{
					this.mapUserGroupsService.getMappings(resolve,reject);	
				}),
				result= await promise;
			if(result.error.status==0){
				result.data.forEach(mappingdb=>{
					let mapping=new Cl_MapUserGroups(mappingdb.userUuid,mappingdb.groupUuid);
					mapping.uuid=mappingdb.uuid;
					mapping.userEmail=mappingdb.user.email;
					mapping.groupName=mappingdb.group.name;
					objMapUserGroupsList[mapping.uuid]=mapping;
				});
			}else{
				this.toast.set_component({
					title:'Administración',
					message:'No se pudo cargar la lista de usuarios',
					textTime:'justo ahora',
					type:'danger'
				});
				this.toast.show();
			}
			this.objUserGroupsListToMap=objMapUserGroupsList;
			if(objJson.fillMapping){
				this.fillMapping(this.objUserGroupsListToMap);
			}
		}catch(data){
			let message='Usted no está autorizado para hacer ésta petición',
				type='danger';
			if(data.error.description.name=='TokenExpiredError'){
				message="Su sesión ha terminado. ¡Vuelva a loguearse!";
				type='warning';
				service_Cookie.deleteAllCookies();
				this.toast.set_hiddenEvent=()=>{
					router.load('login');
				}
			}
			this.toast.set_component({
					title:'Administración',
					message:message,
					textTime:'justo ahora',
					type:type
				});
			this.toast.show();
		}
	}
	async resquestMappingsByUser(userUuid){
		try{
			let promise=new Promise((resolve,reject)=>{
					this.mapUserGroupsService.getMappingsByUser(userUuid,resolve,reject);
				}),
				result=await promise;
				return result.data;
				
		}catch(data){
			console.log("resquestMappingsByUser: ",data);
			return [];
		}
	}
	createItemAccordion(key){
		let usertype=this.objUsersList[key].admin?'Administrador':'Agente de control';
		let item=$(document.createElement('div'))
				.addClass('accordion-item'),
			headerItem=$(document.createElement('h2'))
				.addClass('accordion-header')
				.attr({
					'id':`flush-heading${key}`,
					'data-bs-toggle':'tooltip',
					'data-bs-placement':'right',
					'title':`${usertype}`
				}),
			collapseItem=$(document.createElement('div'))
				.addClass('accordion-collapse collapse')
				.attr({
					'id':`flush-collapse${key}`,
					'aria-labelledby':`flush-heading${key}`,
					'data-bs-parent':`#accordionUsers`
				});

		let buttonHeader=$(document.createElement('button'))
			.addClass('accordion-button collapsed')
			.attr({
				'type':'button',
				'data-bs-toggle':'collapse',
				'data-bs-target':`#flush-collapse${key}`,
				'aria-expanded':'false',
				'aria-controls':`flush-collapse${key}`
			})
			.text(`${this.objUsersList[key].email}`);
		headerItem.append(buttonHeader);

		let accordionBody=$(document.createElement('div'))
			.addClass('accordion-body')
			.attr('id',key);
		collapseItem.append(accordionBody);

		item.append(headerItem);
		item.append(collapseItem);

		this.accordion.append(item);

		item.click(e=>{
			this.objMapUserGroups.userUuid=this.objUsersList[key].uuid;
			this.objMapUserGroups.userEmail=this.objUsersList[key].email;
		});
	}
	createElementMapping(key,objMapUserGroupsList){
		let elem=$(document.createElement('button'))
				.addClass('btn btn-primary position-relative')
				.attr('type','button')
				.css({
					'margin-right': '15px'
				})
				.text(objMapUserGroupsList[key].groupName),
			span=$(document.createElement('span'))
				.addClass('position-absolute top-0 start-100 translate-middle');
				
		let	ico=$(document.createElement('i'))
				.addClass('bi bi-x-circle-fill')
				.attr('id',key)
				.css({
					'color':'red',
					'margin-left':'8px'
				});

		span.append(ico);
		elem.append(span);
		$(`#${objMapUserGroupsList[key].userUuid}`).append(elem);

		ico.click(e=>{
			this.deleteElementMapping($(e.target).attr('id'),elem);
		});
	}
	async refreshMappingByUser(userUuid){
		console.log("El uuid del usuario: ",userUuid);
		let mappings=await this.resquestMappingsByUser(userUuid);
		console.log("refreshMappingByUser: ",mappings);
		let objMapUserGroupsListByUser={};
		mappings.forEach(mappingdb=>{
			let mapping=new Cl_MapUserGroups(mappingdb.userUuid,mappingdb.groupUuid);
				mapping.uuid=mappingdb.uuid;
				mapping.userEmail=mappingdb.user.email;
				mapping.groupName=mappingdb.group.name;
				objMapUserGroupsListByUser[mapping.uuid]=mapping;
		});
		$(`#${userUuid}`).html("");
		this.fillMapping(objMapUserGroupsListByUser);
	}
	setObserverEvent(){
		this.addMappingObserver.set_trigger=(subject)=>{
			if(subject.value){
				this.refreshMappingByUser(this.objMapUserGroups.userUuid);
				this.requestMappings({fillmapping:false});
			}
		};
		service_Observer.addMappingObservable.subscribe(this.addMappingObserver);
	}
	async deleteElementMapping(uuid,elem){
		try{
			let promise=new Promise((resolve,reject)=>{
				this.mapUserGroupsService.deleteMapping(uuid,resolve,reject);	
			}),
			result=await promise;
			if(result.error.status==0){
				this.toast.set_component({
					title:'Administración',
					message:`${this.objUserGroupsListToMap[uuid].groupName} ha quedado libre para asignar`,
					textTime:'justo ahora',
					type:'success'
				});
				this.toast.show();
				elem.remove();
				service_Observer.removeMappingObservable.notify(true);
			}else{
				this.toast.set_component({
					title:'Administración',
					message:`No se pudo eliminar la asingación`,
					textTime:'justo ahora',
					type:'danger'
				});
				this.toast.show();
			}
		}catch(data){
			console.log("borrame data al borrar mapping: ",data);
			let message='Usted no está autorizado para hacer ésta petición',
				type='danger';
			if(data.error.description.name=='TokenExpiredError'){
				message="Su sesión ha terminado. ¡Vuelva a loguearse!";
				type='warning';
				service_Cookie.deleteAllCookies();
				this.toast.set_hiddenEvent=()=>{
					router.load('login');
				}
			}
			this.toast.set_component({
					title:'Administración',
					message:message,
					textTime:'justo ahora',
					type:type
				});
			this.toast.show();
		}
	}
	fill(){
		for(let key in this.objUsersList){
			this.createItemAccordion(key);
		}
	}
	fillMapping(objMapUserGroupsList){
		for(let key in objMapUserGroupsList){
			this.createElementMapping(key,objMapUserGroupsList);
		}
	}
	get get_component(){
		this.accordion.append(this.inputFilter);
		this.inputFilter.keyup(e=>{
			let filter=e.target.value.toLowerCase(),
				list_aux=this.accordion.find('.accordion-item'),
				datagroups=list_aux.toArray(),
				fnNoMatch=(datagroup)=>{
					return datagroup.textContent.toLowerCase().indexOf(filter)==-1;
				};
				list_aux.show();
			if(filter!=''){
				let exclude=datagroups.filter(fnNoMatch);
				exclude.forEach(elem=>{
					console.log(elem);
					$(elem).hide();
				});
			}else{
				list_aux.show();
			}
		});
		return this.accordion;
	}
}