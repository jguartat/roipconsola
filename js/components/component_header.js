"use strict";
import {service_Observer} from '../services/service_observers.js';
export class Component_Header{
	constructor(brand){
		this.imglogo=$(document.createElement('img'))
			.addClass('d-inline-block align-text-top')
			.attr('src','/RoipConsola/img/logototem.png');
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
	}
	createMenuButtons(){
		let menubtn=$(document.createElement('div'))
				.addClass('d-grid gap-2 d-sm-flex justify-content-sm-end'),
			icoActiveAll=$(document.createElement('i'))
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

		menubtn.append(this.btnActiveAll);
		menubtn.append(this.btnDeactiveAll);

		this.btnActiveAll.click(e=>{
			console.log("Activar todos los grupos");
			service_Observer.connectAllGroupsObservable.notify(1);
		});
		this.btnDeactiveAll.click(e=>{
			console.log("Desactivar todos los grupos");
			service_Observer.disconnectAllGroupsObservable.notify(1);
		});
		return menubtn;
	}
	get get_component(){
		this.brand
			.addClass('d-flex');
			//.addClass('d-flex w-100 justify-content-between');
		let component=$(document.createElement('nav')).
				addClass('navbar navbar-expand-lg navbar-light bg-light'),
			container=$(document.createElement('div')).
				addClass('container-fluid');
		this.brand.append(this.imglogo);
		this.h1.prepend(this.icoBrand);
		this.brand.append(this.h1);
		container.append(this.brand);
		container.append(this.createMenuButtons());
		component.append(container);

		

		return component;
	}
}