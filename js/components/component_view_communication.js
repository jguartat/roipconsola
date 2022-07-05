'use strict';
import {Component_Header} from './component_header.js';
import {Component_List} from './component_list.js';
import {Service_Permissions} from '../services/service_permissions.js';
export class Component_View_Communication{
	constructor(){
		this.header=this.createHeader();
		this.controllers=this.createControllers();
		this.list=this.createList();
		this.container=this.createContainer();

		//Default menu
		this.menu=[
			{name:'Comunicación',path:'comunications'}
		];
	}
	createHeader(){
		let header=new Component_Header("RoipConsola");
		return header;
	}
	createContainer(){
		let container=$(document.createElement('div')).addClass('container-fluid mt-4'),
			row=$(document.createElement('div')).addClass('row'),
			columList=$(document.createElement('div')).addClass('col-12 col-sm-4'),
			columControllers=this.controllers;
		row.append(columList);
		row.append(columControllers);
		container.append(row);

		columList.append(this.list);
		return container;
	}
	createList(){
		let list=new Component_List(this.controllers);
		return list.get_component;	
	}
	createControllers(){
		let controllers=$(document.createElement('div')).addClass('col-12 col-sm-8 bg-light'),
			row=$(document.createElement('div')).addClass('row groupList mt-3');
		controllers.append(row);
		return controllers;
	}
	load(){
		let menu=Service_Permissions.getMenu();
		if(menu==[]){menu=this.menu;}
		this.header.createBrand();
		this.header.createMenuNavBar(menu);
		this.header.createMenuButtons();

		$('body').append(this.header.get_component);
		$('body').append(this.container);
	}
}
