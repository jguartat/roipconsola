'use strict';
import {Cl_User} from '../class/class_user.js';
import {Service_Users} from '../services/service_users.js';
import {Observer} from '../../libs/observerPattern/class/class_observer.js';
import {service_Observer} from '../services/service_observers.js';

export class Component_ListUserForm{
	constructor(userForm){
		this.userForm=userForm;
		this.inputFilter=$(document.createElement('input'))
			.addClass('form-control mb-2')
			.attr('type','text')
			.attr('placeholder','Filtrar');
		this.list=$(document.createElement('div')).
			addClass('list-group list-group-flush');
		this.usersService=new Service_Users();
		this.toast=null;//It is initialized from its parent component
		this.objUsersList={};
		this.changeUsersListObserver= new Observer();
		this.setObserverEvent();
	}
	async requestUsers(){
		let objUsersList={},
			promise=new Promise((resolve,reject)=>{
				let listUsers= this.usersService.getUsers(resolve);	
			}),
			result= await promise;
			/*promise.then(result=>{
				console.log(result);
			});*/
		if(result.error.status==0){
			result.data.forEach(userdb=>{
				let user=new Cl_User(userdb.email,userdb.password);
				user.admin=userdb.admin;
				user.uuid=userdb.uuid;
				objUsersList[user.uuid]=user;
			});
		}else{
			this.toast.set_component({
				title:'Administración',
				message:'No se pudo cargar la lista de usuarios',
				textTime:'justo ahora',
				type:'danger'
			});
			this.toast.show();
		}
		this.objUsersList=objUsersList;		
		this.fill();
	}
	fill(){
		for(let key in this.objUsersList){
			let elem=$(document.createElement('a'))
					.addClass('list-group-item list-group-item-action'),
				elemContent=$(document.createElement('div'))
					.addClass('d-flex w-100 justify-content-between'),
				elemContentHead=$(document.createElement('h5'))
					.addClass('mb-1 display-6')
					.css({'font-size': '1rem','font-weight': 'normal'})
					.text(this.objUsersList[key].email),
				elemContentIco=$(document.createElement('i'))
					.addClass('bi bi-person-x-fill').
					css({'font-size': 'larger'}),
				elemDescription=$(document.createElement('p'))
					.addClass('mb-1')
					.css({'font-size': '0.8rem','font-weight': 'normal'})
					.text((this.objUsersList[key].admin?'Administrador':'Agente de control')),
				elemExt=$(document.createElement('small'))
					.text('Ext: '+this.objUsersList[key].ext);

			elemContent.append(elemContentHead);
			elemContent.append(elemContentIco);
			elem.append(elemContent);
			elem.append(elemDescription);
			//elem.append(elemExt);
			this.list.append(elem);

			elem.click(e=>{
				this.userForm.fill(this.objUsersList[key]);
				this.userForm.set_edit=true;
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
					this.usersService.deleteUser(this.objUsersList[key].uuid,resolve);
				});
				promise.then(result=>{
					if(result.error.status==0){
						this.toast.set_component({
							title:'Administración',
							message:`Usuario ${this.objUsersList[key].email} ha sido eliminado`,
							textTime:'justo ahora',
							type:'success'
						});
						this.toast.show();
						service_Observer.changeUsersListObservable.notify(true);
					}else{
						this.toast.set_component({
							title:'Administración',
							message:`Usuario ${this.objUsersList[key].email} no ha sido eliminado`,
							textTime:'justo ahora',
							type:'danger'
						});
						this.toast.show();
					}
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
		this.changeUsersListObserver.set_trigger=(subject)=>{
			if(subject.value){
				this.list.html("");
				this.requestUsers();
			}
		};
		service_Observer.changeUsersListObservable.subscribe(this.changeUsersListObserver);
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