'use strict';
import {Component_Header} from './component_header.js';
import {Component_ListGroupToAssign} from './component_listGroupToAssign.js';
import {Component_ListUsersMonitoringGroups} from './component_listUsersMonitoringGroups.js';
import {Component_Toast} from './component_toast.js';
import {Service_Permissions} from '../services/service_permissions.js';
import {Cl_MapUserGroups} from '../class/class_mapusergroups.js';
export class Component_View_GroupsAssignment{
	constructor(){
		this.toast=new Component_Toast('Hello','info','right now');
		this.header=this.createHeader();
		this.objMapUserGroups=new Cl_MapUserGroups(null,null);
		this.groupsList=this.createGroupsList(this.objMapUserGroups);
		this.usersList=this.createUsersList(this.objMapUserGroups);
		this.container=this.createContainer();

		this.menu=[
			{name:'Asignación',path:'groupsassignment',active:true}
		];
	}
	createHeader(){
		let header=new Component_Header("RoipConsola");
		return header;
	}
	createGroupsList(objMapUserGroups){
		let list=new Component_ListGroupToAssign(objMapUserGroups);
		list.requestGroups();
		list.toast=this.toast;
		return list;
	}
	createUsersList(objMapUserGroups){
		let list=new Component_ListUsersMonitoringGroups(objMapUserGroups);
		list.requestUsers();
		list.requestMappings({fillMapping:true});
		list.toast=this.toast;
		return list;
	}
	async createUsersList_(objMapUserGroups){
		let list=new Component_ListUsersMonitoringGroups(objMapUserGroups);
		await list.requestUsers();
		await list.requestMappings({fillMapping:true});
		list.toast=this.toast;
		return list;
	}
	createContainer(){
		let container=$(document.createElement('div')).addClass('container mt-4'),
			row=$(document.createElement('div')).addClass('row justify-content-center'),
			columGroupsList=$(document.createElement('div')).addClass('col-12 col-sm-4'),
			columUsersList=$(document.createElement('div')).addClass('col-12 col-sm-6');
		row.append(columGroupsList);
		row.append(columUsersList);
		container.append(row);

		columUsersList.append(this.usersList.get_component);
		columGroupsList.append(this.groupsList.get_component);
		
		return container;
	}
	load(){
		let menu=Service_Permissions.getMenu();
		if(menu==[]){menu=this.menu;}
		this.header.createBrand();
		this.header.createMenuNavBar(menu);
		this.header.createMenuButtons();

		$('body').append(this.header.get_component);
		$('body').append(this.container);
		$('body').append(this.toast.get_component);
	}
}
