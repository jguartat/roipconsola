"use strict";
import {service_Observer} from '../services/service_observers.js';
import {service_Cookie} from '../services/service_cookie.js';
import {service_Encryption} from '../services/service_encryption.js';
import {router} from '../routing/router.js';
export class Component_Header{
	constructor(brand){
		this.menubtn=$(document.createElement('div'))
			.addClass('d-grid gap-2 d-sm-flex justify-content-sm-end');
		this.container=$(document.createElement('div'))
			.addClass('container-fluid');
		this.imglogo=$(document.createElement('img'))
			.addClass('d-inline-block align-text-top')
			.attr('src','./img/logototem.png');
		this.brand=$(document.createElement('a'))
			.addClass('navbar-brand');
		this.icoBrand=$(document.createElement('i'))
			.addClass('bi bi-headset');
		this.h1=$(document.createElement('h1'))
			.addClass('navbar-text display-6')
			.css({'font-size': '1.7rem','margin-top':'auto','color':'#594bac'})
			.text(brand);
		this.btnActiveAll=$(document.createElement('button'))
			.addClass('btn')
			.text('Activar todo');
		this.btnDeactiveAll=$(document.createElement('button'))
			.addClass('btn btn-outline-danger')
			.text('Desactivar todo');



		this.imglogoProtectIA=$(document.createElement('img'))
			.attr({
				'src':'./img/logoprotectia.png',
				'role':'button',
				'tabindex':"0",
				'data-bs-container':"body",
				'data-bs-toggle':'popover',
				'data-bs-placement':'bottom',
				'data-bs-trigger':"focus"
			})
			.css({'width':'15%'});
		this.btnLogout=$(document.createElement('button'))
			.addClass('btn btn-outline-danger')
			.text('Cerrar sesión');
		this.popover=this.createPopOver();
	}
	createPopOver(){
		if(!service_Cookie.checkCookie('dataUser')){
			return null;
		}
		let dataUser=JSON.parse(service_Encryption.decrypt(service_Cookie.getCookie('dataUser'))),
			loggedInAs=service_Encryption.decrypt(service_Cookie.getCookie('loggedInAs'));
		let content=$(document.createElement('ul'))
				.addClass('list-group list-group-flush'),
			liUserType=$(document.createElement('li'))
				.addClass('list-group-item')
				.text(loggedInAs=='admin'?'Administrador':'Operador'),
			liBtnLogout=$(document.createElement('li'))
				.addClass('list-group-item');

		liBtnLogout.append(this.btnLogout);
		content.append(liUserType);
		content.append(liBtnLogout);

		let popover=new bootstrap.Popover(this.imglogoProtectIA.get(0),{
			'animation':true,
			'fallbackPlacements':['bottom'],
			'html':true,
			'title':`${dataUser.email}`,
			'content':content.get(0)
		});
		this.btnLogout.click(e=>{
			service_Cookie.deleteAllCookies();
			this.popover.disable();
			this.popover.dispose();
			this.popover=null;
			router.load('login');
		});
		return popover;
	}
	createMenuButtons(){
		if(window.location.pathname=="/comunications"){
			this.createMenuButtonsComunications();
		}
		this.menubtn.append(this.imglogoProtectIA);
		this.container.append(this.menubtn);
	}
	createMenuButtonsComunications(){
		let icoActiveAll=$(document.createElement('i'))
				.addClass('bi bi-plugin'),
			icoDeactiveAll=$(document.createElement('i'))
				.addClass('bi bi-plug-fill');
		this.btnActiveAll.append(icoActiveAll);

		this.btnActiveAll
			.css({
				'background-color': '#594bac',
				'border-color':'#594bac',
	    		'color': 'white',
			})
			.mouseover(e=>{
				$(e.target).not('i').css({'background-color':'#332682','border-color':'#332682'});
			})
			.mouseleave(e=>{
				$(e.target).not('i').css({'background-color':'#594bac','border-color':'#594bac'});
			})
			.focusout(e=>{
				$(e.target).not('i').css({'box-shadow':'rgba(89, 75, 172, 0.3) 0px 0px 0px 0px'});	
			})
			.focusin(e=>{
				$(e.target).not('i').css({'box-shadow':'rgba(89, 75, 172, 0.3) 0px 0px 0px 4px'});
			});

		this.btnDeactiveAll.append(icoDeactiveAll);

		this.menubtn.append(this.btnActiveAll);
		this.menubtn.append(this.btnDeactiveAll);

		this.btnActiveAll.click(e=>{
			console.log("Activar todos los grupos");
			service_Observer.connectAllGroupsObservable.notify(1);
		});
		this.btnDeactiveAll.click(e=>{
			console.log("Desactivar todos los grupos");
			service_Observer.disconnectAllGroupsObservable.notify(1);
		});
	}
	createMenuNavBar(list){
		let navbar=$(document.createElement('div'))
				.addClass('collapse navbar-collapse'),
			ul=$(document.createElement('ul'))
				.addClass('navbar-nav');
		navbar.append(ul);
		list.forEach(item=>{
			let li=$(document.createElement('li'))
					.addClass('nav-item'),
				a=$(document.createElement('a'))
					.addClass('nav-link')
					.attr('href',item.path)
					.text(item.name);
			li.append(a);
			ul.append(li);
		});
		this.container.append(navbar);	
	}
	createBrand(){
		this.brand
			.addClass('d-flex');
		this.brand.append(this.imglogo);
		this.h1.prepend(this.icoBrand);
		this.brand.append(this.h1);
		this.container.append(this.brand);
	}
	get get_component(){
		let component=$(document.createElement('nav')).
				addClass('navbar navbar-expand-lg navbar-light bg-light');
		component.append(this.container);

		return component;
	}
}