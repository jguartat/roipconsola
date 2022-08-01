'use strict';
import {Cl_Group} from '../class/class_group.js';
import {Service_Groups} from '../services/service_groups.js';
import {Service_MapUserGroups} from '../services/service_mapusergroups.js';
import {Observer} from '../../libs/observerPattern/class/class_observer.js';
import {service_Observer} from '../services/service_observers.js';
import {service_Cookie} from '../services/service_cookie.js';
import {router} from '../routing/router.js';

export class Component_ListGroupToAssign{
	constructor(objMapUserGroups){
		this.objMapUserGroups=objMapUserGroups;
		this.inputFilter=$(document.createElement('input'))
			.addClass('form-control mb-2')
			.attr('type','text')
			.attr('placeholder','Filtrar');
		this.list=$(document.createElement('div')).
			addClass('list-group list-group-flush');
		this.groupsService=new Service_Groups();
		this.mappingService=new Service_MapUserGroups();
		this.toast=null;//It is initialized from its parent component
		this.objGroupsList={};
		this.removeMappingObserver=new Observer();
		this.setObserverEvent();
	}
	async requestGroups(){
		try{
			let objGroupsList={},
				promise=new Promise((resolve,reject)=>{
					let listGroups= this.groupsService.getGroups(resolve,reject);
				}),
				result= await promise;
			if(result.error.status==0){
				result.data.forEach(groupdb=>{
					let group=new Cl_Group(groupdb);
					group.uuid=groupdb.uuid;
					objGroupsList[group.uuid]=group;
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
			this.objGroupsList=objGroupsList;
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
		for(let key in this.objGroupsList){
			let elem=$(document.createElement('a'))
					.addClass('list-group-item list-group-item-action'),
				elemContent=$(document.createElement('div'))
					.addClass('d-flex w-100 justify-content-between'),
				elemContentHead=$(document.createElement('h5'))
					.addClass('mb-1 display-6')
					.css({'font-size': '1rem','font-weight': 'normal'})
					.text(`${this.objGroupsList[key].name}`),
				elemContentIco=$(document.createElement('i'))
					.addClass('bi bi-chevron-right')
					.attr('id',key)
					.css({'font-size': 'larger'}),
				elemDescription=$(document.createElement('p'))
					.addClass('mb-1')
					.css({'font-size': '0.8rem','font-weight': 'normal'})
					.text((`${this.objGroupsList[key].description} [Ext: ${this.objGroupsList[key].ext}]`)),
				elemExt=$(document.createElement('small'))
					.text('Ext: '+this.objGroupsList[key].ext);

			elemContent.append(elemContentHead);
			elemContent.append(elemContentIco);
			elem.append(elemContent);
			elem.append(elemDescription);
			//elem.append(elemExt);
			this.list.append(elem);

			elem.click(e=>{
			})
			.mouseover(e=>{
				elem.css({'cursor':'pointer'});
				elemContentHead.css({'color': 'cornflowerblue'});
			})
			.mouseleave(e=>{
				elemContentHead.css({'color': 'black'});
			});

			elemContentIco.click(e=>{
				this.saveNewMapping($(e.target).attr('id'),elem);
			})
			.mouseover(e=>{
				elemContentIco.css({'color': 'green'});
			})
			.mouseleave(e=>{
				elemContentIco.css({'color': 'black'});
			});

		}
	}
	setObserverEvent(){
		this.removeMappingObserver.set_trigger=(subject)=>{
			if(subject.value){
				this.list.find('a').remove();
				this.requestGroups();
			}
		};
		service_Observer.removeMappingObservable.subscribe(this.removeMappingObserver);
	}
	async saveNewMapping(key,elem){
		try{
			this.objMapUserGroups.groupUuid=this.objGroupsList[key].uuid;
			this.objMapUserGroups.groupName=this.objGroupsList[key].name;
			if(this.objMapUserGroups.userUuid==null || this.objMapUserGroups.userUuid==undefined || this.objMapUserGroups.userUuid==""){
				this.toast.set_component({
					title:'Administración',
					message:`Debe primero seleccionar un usuario`,
					textTime:'justo ahora',
					type:'warning'
				});
				this.toast.show();
				return;
			}
			let objMapping=this.objMapUserGroups.json();
			delete objMapping.uuid;
			let promise=new Promise((resolve,reject)=>{
					this.mappingService.saveMapping(objMapping,resolve,reject);
				}),
			result=await promise;
			if(result.error.status==0){
				this.toast.set_component({
					title:'Administración',
					message:`${this.objMapUserGroups.groupName} ha sido asignado a ${this.objMapUserGroups.userEmail}`,
					textTime:'justo ahora',
					type:'success'
				});
				this.toast.show();
				//elem.remove();
				service_Observer.addMappingObservable.notify(true);
			}else{
				this.toast.set_component({
					title:'Administración',
					message:`No se pudo asignar`,
					textTime:'justo ahora',
					type:'danger'
				});
				this.toast.show();
			}
				
		}catch(data){
			let message='Usted no está autorizado para hacer ésta petición',
				type='danger';

			switch(data.error.description.name){
				case 'TokenExpiredError':
					message="Su sesión ha terminado. ¡Vuelva a loguearse!";
					type='warning';
					service_Cookie.deleteAllCookies();
					this.toast.set_hiddenEvent=()=>{
						router.load('login');
					}
					break;
				case 'SequelizeUniqueConstraintError':
					message=`No se puede asignar ${this.objMapUserGroups.groupName} porque ya ha sido asignado`;
					type='warning';
					break;
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
	get get_component(){
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