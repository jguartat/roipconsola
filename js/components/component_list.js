'use strict';
import {Service_Groups} from '../services/service_groups.js';
import {Component_ControllerPTT} from './component_controllerPTT.js';
import {Cl_Group} from '../class/class_group.js';
import {Observer} from '../../libs/observerPattern/class/class_observer.js';
import {service_Observer} from '../services/service_observers.js';
export class Component_List{
	constructor(HTML_Controllers){
		this.groupsService=new Service_Groups();
		this.objGroupList={};
		this.controllers=HTML_Controllers;
		this.inputFilter=$(document.createElement('input'))
			.addClass('form-control mb-2')
			.attr('type','text')
			.attr('placeholder','Filtrar');
		this.list=$(document.createElement('div')).
			addClass('list-group list-group-flush');
		this.toast=null;//It is initialized from its parent component
		this.connectAllGroupsObserver=new Observer();
		this.disconnectAllGroupsObserver=new Observer();
		this.changeGroupsListObserver= new Observer();
		this.setObserverEvent();
	}
	async requestGroups(){
		try{
			let objGroupList={},
				promise=new Promise((resolve,reject)=>{
				this.groupsService.getGroups(resolve,reject);
			}),
			result= await promise;
			if(result.error.status==0){
				result.data.forEach(groupdb=>{
					let group=new Cl_Group(groupdb);
					group.uuid=groupdb.uuid;
					objGroupList[group.uuid]=group;
				});
			}else{
				this.toast.set_component({
					title:'Administración',
					message:'No se pudo cargar la lista de grupos',
					textTime:'justo ahora',
					type:'danger'
				});
				this.toast.show();
			}
			this.objGroupList=objGroupList;
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
	fill(){
		for(let key in this.objGroupList){
			let elem=$(document.createElement('a'))
					.addClass('list-group-item list-group-item-action'),
				elemContent=$(document.createElement('div'))
					.addClass('d-flex w-100 justify-content-between'),
				elemContentHead=$(document.createElement('h5'))
					.addClass('mb-1 display-6')
					.css({'font-size': '1.4rem','font-weight': 'normal'})
					.text(this.objGroupList[key].name),
				elemContentIco=$(document.createElement('i'))
					.addClass('bi bi-sliders2-vertical'),
				elemDescription=$(document.createElement('p'))
					.addClass('mb-1')
					.text('Descripción: '+this.objGroupList[key].description),
				elemExt=$(document.createElement('small'))
					.text('Ext: '+this.objGroupList[key].ext);

			elemContent.append(elemContentHead);
			elemContent.append(elemContentIco);
			elem.append(elemContent);
			elem.append(elemDescription);
			elem.append(elemExt);
			this.list.append(elem);

			elem.click(e=>{
				/*Puede haber hecho esto:let controller=new Component_ControllerPTT(this.objGroupList[key])*/
				if(!this.objGroupList[key].controller){
					this.objGroupList[key].controller=new Component_ControllerPTT(this.objGroupList[key]);
					let column=$(document.createElement('div'))
						.addClass('col-12 col-md-12 col-lg-6');
					column.append(this.objGroupList[key].controller.get_component);
					this.controllers.find('.row.groupList').append(column);
					this.objGroupList[key].controller.connect();
					this.objGroupList[key].controller.closeEvent=()=>{
						delete this.objGroupList[key].controller;
					}
				}else{
					this.objGroupList[key].controller.card.css({
						'animation':'bounceIn',
						'animation-duration':'1s'
					});
					this.objGroupList[key].controller.card.on('animationend',e=>{
						$(e.target).attr('style','');
					});
				}
			})
			.mouseover(e=>{
				elem.css({'cursor':'pointer'});
				elemContentIco.css({'color': 'cornflowerblue'});
				elemContentHead.css({'color': 'cornflowerblue'});
			})
			.mouseleave(e=>{
				elemContentIco.css({'color': 'black'});
				elemContentHead.css({'color': 'black'});
			});
		}
	}
	connectAll(){
		for(let key in this.objGroupList){
			if(!this.objGroupList[key].controller){
				this.objGroupList[key].controller=new Component_ControllerPTT(this.objGroupList[key]);
				let column=$(document.createElement('div'))
					.addClass('col-12 col-md-12 col-lg-6');
				column.append(this.objGroupList[key].controller.get_component);
				this.controllers.find('.row.groupList').append(column);
				this.objGroupList[key].controller.connect();
				this.objGroupList[key].controller.closeEvent=()=>{
					delete this.objGroupList[key].controller;
				}
			}
		}
	}
	disconnectAll(){
		for(let key in this.objGroupList){
			if(this.objGroupList[key].controller){
				this.objGroupList[key].controller.card.css({
					'animation':'zoomOut',
					'animation-duration':'0.3s'
				});
				this.objGroupList[key].controller.card.on('animationend',e=>{
					$(e.target).parent().remove();
				});
				this.objGroupList[key].controller.disconnect();
				//this.objGroupList[key].controller.card.parent().remove();
				delete this.objGroupList[key].controller;
			}
		}
	}
	setObserverEvent(){
		this.changeGroupsListObserver.set_trigger=(subject)=>{
			if(subject.value){
				this.list.html("");
				this.requestGroups();
			}
		};
		service_Observer.changeGroupsListObservable.subscribe(this.changeGroupsListObserver);
	}
	get get_component(){

		this.connectAllGroupsObserver.set_trigger=(subject)=>{
			console.log("subject cambio de valor: ",subject.value);
			if(subject.value!=null){
				this.connectAll();
			}
		}
		service_Observer.connectAllGroupsObservable.subscribe(this.connectAllGroupsObserver);

		this.disconnectAllGroupsObserver.set_trigger=(subject)=>{
			console.log("subject cambio de valor: ",subject.value);
			if(subject.value!=null){
				this.disconnectAll();
			}
		}
		service_Observer.disconnectAllGroupsObservable.subscribe(this.disconnectAllGroupsObserver);

		this.list.append(this.inputFilter);
		this.inputFilter.keyup(e=>{
			let filter=e.target.value.toLowerCase(),
				list_aux=this.list.find('a'),
				datagroups=list_aux.toArray(),
				fnNoMatch=(datagroup)=>{
					return datagroup.text.toLowerCase().indexOf(filter)==-1;
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
		return this.list;
	}
}