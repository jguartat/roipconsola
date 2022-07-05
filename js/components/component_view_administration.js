'use strict';
import {Component_Header} from './component_header.js';
import {Component_UserForm} from './component_userForm.js';
import {Component_ListUserForm} from './component_listUserForm.js';
import {Component_Toast} from './component_toast.js';
import {Service_Permissions} from '../services/service_permissions.js';
export class Component_View_Administration{
	constructor(){
		this.toast=new Component_Toast('Hello','info','right now');
		this.header=this.createHeader();
		this.form=this.createForm();
		this.usersList=this.createList(this.form);
		this.container=this.createContainer();

		this.menu=[
			{name:'Administración',path:'administration'}
		];
	}
	createHeader(){
		let header=new Component_Header("RoipConsola");
		return header;
	}
	createForm(){
		let form=new Component_UserForm();
		form.toast=this.toast;
		return form;
	}
	createList(form){
		let list=new Component_ListUserForm(form);
		list.requestUsers();
		list.toast=this.toast;
		return list;
	}
	createContainer(){
		let container=$(document.createElement('div')).addClass('container mt-4'),
			row=$(document.createElement('div')).addClass('row justify-content-center'),
			columForm=$(document.createElement('div')).addClass('col-12 col-sm-6 bg-light p-4'),
			columUserList=$(document.createElement('div')).addClass('col-12 col-sm-4');
		row.append(columForm);
		row.append(columUserList);
		container.append(row);

		columForm.append(this.form.get_component);
		columUserList.append(this.usersList.get_component);
		
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
