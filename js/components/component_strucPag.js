'use strict';
import {Component_Header} from './component_header.js';
import {Component_List} from './component_list.js';
export class Componente_StrucPag{
	constructor(){
		this.header=this.createHeader();
		this.controllers=this.createControllers();
		this.list=this.createList();
		this.container=this.createContainer();
	}
	createHeader(){
		let header=new Component_Header("RoipConsola");
		return header.get_component;
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
		$('body').append(this.header);
		$('body').append(this.container);
	}
}
export var pagRoip=new Componente_StrucPag();