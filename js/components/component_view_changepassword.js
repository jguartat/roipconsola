'use strict';
import {Component_Header} from './component_header.js';
import {Component_ChangePasswordForm} from './component_changePasswordForm.js';
import {Component_Toast} from './component_toast.js';
import {Service_Permissions} from '../services/service_permissions.js';

export class Component_View_ChangePassword{
	constructor(){
		this.toast=new Component_Toast('Hello','info','right now');
		this.header=this.createHeader();
		this.form=this.createForm();
		this.container=this.createContainer();
		this.menu=[
			{name:'Comunicación',path:'comunications',active:false}
		];
	}
	createHeader(){
		let header=new Component_Header("RoipConsola");
		return header;
	}
	createForm(){
		let form=new Component_ChangePasswordForm();
		form.toast=this.toast;
		return form;
	}
	createContainer(){
		let container=$(document.createElement('div')).addClass('container mt-4'),
			row=$(document.createElement('div')).addClass('row justify-content-center'),
			columForm=$(document.createElement('div')).addClass('col-12 col-sm-5 bg-light p-4');
		row.append(columForm);
		container.append(row);
		columForm.append(this.form.get_component);
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