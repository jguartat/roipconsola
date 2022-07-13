'use strict';
import {Cl_Group} from '../class/class_group.js';
import {Service_Groups} from '../services/service_groups.js';
import {Observer} from '../../libs/observerPattern/class/class_observer.js';
import {service_Observer} from '../services/service_observers.js';
import {service_Cookie} from '../services/service_cookie.js';
import {router} from '../routing/router.js';

export class Component_ListGroupForm{
	constructor(groupForm){
		this.groupForm=groupForm;
		this.inputFilter=$(document.createElement('input'))
			.addClass('form-control mb-2')
			.attr('type','text')
			.attr('placeholder','Filtrar');
		this.list=$(document.createElement('div')).
			addClass('list-group list-group-flush');
		this.groupsService=new Service_Groups();
		this.toast=null;//It is initialized from its parent component
		this.objGroupsList={};
		this.changeGroupsListObserver= new Observer();
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
					.addClass('bi bi-x-lg').
					css({'font-size': 'larger'}),
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
				this.groupForm.fill(this.objGroupsList[key]);
				this.groupForm.set_edit=true;
			})
			.mouseover(e=>{
				elem.css({'cursor':'pointer'});
				elemContentHead.css({'color': 'cornflowerblue'});
			})
			.mouseleave(e=>{
				elemContentHead.css({'color': 'black'});
			});

			elemContentIco.click(e=>{
				let promise=new Promise((resolve,reject)=>{
					this.groupsService.deleteGroup(this.objGroupsList[key].uuid,resolve,reject);
				});
				promise.then(result=>{
					if(result.error.status==0){
						this.toast.set_component({
							title:'Administración',
							message:`Grupo ${this.objGroupsList[key].name} ha sido eliminado`,
							textTime:'justo ahora',
							type:'success'
						});
						this.toast.show();
						service_Observer.changeGroupsListObservable.notify(true);
					}else{
						this.toast.set_component({
							title:'Administración',
							message:`Grupo ${this.objGroupsList[key].name} no ha sido eliminado`,
							textTime:'justo ahora',
							type:'danger'
						});
						this.toast.show();
					}
				},result=>{
					let message='Usted no está autorizado para hacer ésta petición',
						type='danger';
					if(result.error.description.name=='TokenExpiredError'){
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
				});
			})
			.mouseover(e=>{
				elemContentIco.css({'color': 'red'});
			})
			.mouseleave(e=>{
				elemContentIco.css({'color': 'black'});
			});

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