'use strict';
import {Component_Header} from './component_header.js';
import {Component_List} from './component_list.js';
export class Component_View_Communication{
	constructor(){
		this.header=this.createHeader();
		this.controllers=this.createControllers();
		this.list=this.createList();
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
		$('body').append(this.header.get_component);
		$('body').append(this.container);
		this.header.createMenuNavBar(this.menu);
		this.header.createMenuButtons();
	}
}
export var component_view_communication=new Component_View_Communication();
