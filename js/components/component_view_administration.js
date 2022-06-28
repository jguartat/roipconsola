'use strict';
import {Component_Header} from './component_header.js';
import {Component_UserForm} from './component_userForm.js';
import {Component_ListUserForm} from './component_listUserForm.js';
import {Component_Toast} from './component_toast.js';
export class Component_View_Administration{
	constructor(){
		this.toast=new Component_Toast('Hello','info','right now');
		this.header=this.createHeader();
		this.form=this.createForm();
		this.usersList=this.createList(this.form);
		this.controller=this.createController();//Here will be the form
		this.container=this.createContainer();

		this.menu=[
			{name:'Comunicación',path:'#/comunications'},
			{name:'Administración',path:'#/administration'}
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
			row=$(document.createElement('div')).addClass('row'),
			columForm=$(document.createElement('div')).addClass('col-12 col-sm-6'),
			columUserList=$(document.createElement('div')).addClass('col-12 col-sm-4');
		row.append(columForm);
		row.append(columUserList);
		container.append(row);

		columForm.append(this.form.get_component);
		columUserList.append(this.usersList.get_component);
		
		return container;
	}
	createController(){
		let controller=$(document.createElement('div')).addClass('col-12 col-sm-6 bg-light'),
			row=$(document.createElement('div')).addClass('row groupList mt-3');
		controller.append(row);
		return controller;
	}
	load(){
		$('body').append(this.header.get_component);
		$('body').append(this.container);
		$('body').append(this.toast.get_component);
		this.header.createMenuNavBar(this.menu);
	}
}
export var component_view_administration=new Component_View_Administration();
