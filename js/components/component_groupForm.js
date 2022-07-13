'use strict';
import {Service_Groups} from '../services/service_groups.js';
import {Cl_Group} from '../class/class_group.js';
import {service_Observer} from '../services/service_observers.js';
import {service_Cookie} from '../services/service_cookie.js';
import {router} from '../routing/router.js';

export class Component_GroupForm{
	constructor(){
		this.form=$(document.createElement('div'));
		this.head=$(document.createElement('div'))
			.addClass('d-flex w-100 justify-content-between')
		this.title=$(document.createElement('h1'))
			.addClass('fw-lighter mb-4')
			.css({'color':'#7E4BAC'})
			.text("  Nuevo grupo");
		this.icoTitle=$(document.createElement('i'))
			.addClass('bi bi-people-fill')
			.css({'font-size': 'xx-large',
				'color':'#7E4BAC'});
		this.icoBtnTitle=$(document.createElement('i'))
			.addClass('bi bi-plus-square')
			.css({'font-size': 'xx-large'});
		this.inputName=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'id':'idname',
				'type':'text',
				'placeholder':'Nombre del grupo',
				'aria-label':'Nombre del grupo'
			});
		this.inputExt=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'id':'idext',
				'type':'number',
				'placeholder':'Extensión',
				'aria-label':'Extensión'
			});
		this.inputDescription=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'id':'iddescription',
				'type':'text',
				'placeholder':'Descripción',
				'aria-label':'Descripción'
			});
		this.inputAuthUser=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'id':'idauthuser',
				'type':'number',
				'placeholder':'Usuario de autorización',
				'aria-label':'Usuario de autorización'
			});
		this.inputSipPassword=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'id':'idsippassword',
				'type':'password',
				'placeholder':'contraseña sip'
			});
		this.inputIPServer=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'id':'idipserver',
				'type':'text',
				'placeholder':'IP del servidor'
			});
		this.inputPortServer=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'id':'idportserver',
				'type':'number',
				'placeholder':'Puerto del servidor'
			});
		this.btnCreateGroup=$(document.createElement('button'))
			.addClass('btn btn-outline-success')
			.text('Guardar ');
		this.btnCleanForm=$(document.createElement('button'))
			.addClass('btn btn-outline-danger')
			.text('Limpiar ');

		this.groupsService=new Service_Groups();
		this.toast=null;//It is initialized from its parent component
		this.edit=false;
		this.groupToEdit=null;
	}
	createFormNameExt(){
		let row=$(document.createElement('div'))
			.addClass('row'),
			colName=$(document.createElement('div'))
			.addClass('col'),
			colExt=$(document.createElement('div'))
			.addClass('col');
		colName.append(this.createFormInputsElements({'label':'Nombre','input':this.inputName}));
		colExt.append(this.createFormInputsElements({'label':'Extensión','input':this.inputExt}));
		row.append(colName);
		row.append(colExt);
		return row;
	}
	createFormUserPassSip(){
		let row=$(document.createElement('div'))
			.addClass('row'),
			colName=$(document.createElement('div'))
			.addClass('col'),
			colExt=$(document.createElement('div'))
			.addClass('col');
		colName.append(this.createFormInputsElements({'label':'Usuario de autorización','input':this.inputAuthUser}));
		colExt.append(this.createFormInputsElements({'label':'Contraseña sip','input':this.inputSipPassword}));
		row.append(colName);
		row.append(colExt);
		return row;
	}
	createFormIPPortServer(){
		let row=$(document.createElement('div'))
			.addClass('row'),
			colIPServer=$(document.createElement('div'))
			.addClass('col'),
			colPortServer=$(document.createElement('div'))
			.addClass('col');

		colIPServer.append(this.createFormInputsElements({'label':'IP del servidor','input':this.inputIPServer}));
		colPortServer.append(this.createFormInputsElements({'label':'Puerto del servior','input':this.inputPortServer}));
		row.append(colIPServer);
		row.append(colPortServer);
		return row;
	}
	get get_component(){
		this.title.prepend(this.icoTitle);
		this.head.append(this.title);
		this.form.append(this.head);
		this.form.append(this.createFormNameExt());
		this.form.append(this.createFormInputsElements({'label':'Descripción','input':this.inputDescription}));
		this.form.append(this.createFormUserPassSip());
		this.form.append(this.createFormIPPortServer());
		this.form.append(this.createFormButtonsElements());

		return this.form;
	}
	set set_edit(boolean){
		this.edit=boolean;
		if(this.edit){
			this.title.text("  Editar grupo");
			this.icoTitle
				.removeClass('bi-people-fill')
				.addClass('bi-pen-fill');
			this.head.append(this.icoBtnTitle);
			this.icoBtnTitle
			.mouseover(e=>{
				$(e.target).css({
					'cursor':'pointer',
					'color': 'cornflowerblue'
				});
			})
			.mouseleave(e=>{
				$(e.target).css({
					'color': 'black'
				});	
			})
			.click(e=>{
				this.set_edit=false;
			});
		}else{
			this.title.text("  Nuevo grupo");
			this.icoTitle
				.removeClass('bi-pen-fill')
				.addClass('bi-people-fill');
			this.icoBtnTitle.remove();
			this.cleanForm();
		}
		this.title.prepend(this.icoTitle);
	}
	createFormInputsElements(e){
		let formFloating=$(document.createElement('div'))
			.addClass('form-floating mb-3'),
			label=$(document.createElement('label'))
			.attr('for',e.input.attr('id'))
			.text(e.label);

		formFloating.append(e.input);
		formFloating.append(label);
		return formFloating;
	}
	cleanForm(){
		this.form.find('input').val("");
	}
	ipIsValid(){
		let response={'value':false,'description':"IP no es válida"}
		let ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		if(this.inputIPServer.val().match(ipformat)){
			response.value=true;
			response.description="IP es válida";
			return response;
		}
		this.toast.set_component({
			title:'Administración',
			message:response.description,
			textTime:'justo ahora',
			type:'warning'
		});
		this.toast.show();
		return response;
	}
	elementIsFull(inputElement){
		let placeholder=inputElement.attr('placeholder');
		let response={'value':true,'description':`${placeholder} no está vacía`};
		if(inputElement.val().length==0){
			response.value=false;
			response.description=`${placeholder} no debe estar vacía`;
			this.toast.set_component({
				title:'Administración',
				message:response.description,
				textTime:'justo ahora',
				type:'warning'
			});
			this.toast.show();
			return response;	
		}
		return response;
	}
	isComplete(){
		let response=true;
		response=response && this.elementIsFull(this.inputName).value;
		response=response && this.elementIsFull(this.inputExt).value;
		response=response && this.elementIsFull(this.inputAuthUser).value;
		response=response && this.elementIsFull(this.inputSipPassword).value;
		response=response && this.elementIsFull(this.inputIPServer).value;
		response=response && this.elementIsFull(this.inputPortServer).value;
		response=response && this.ipIsValid().value;
		return response
	}
	createFormButtonsElements(){
		let menubtn=$(document.createElement('div'))
				.addClass('d-grid gap-2 d-sm-flex justify-content-sm-end'),
			icoCreate=$(document.createElement('i'))
				.addClass('bi bi-save2-fill'),
			icoClean=$(document.createElement('i'))
				.addClass('bi bi-eraser-fill');
		this.btnCreateGroup.append(icoCreate);
		this.btnCleanForm.append(icoClean);

		menubtn.append(this.btnCreateGroup);
		menubtn.append(this.btnCleanForm);

		this.btnCreateGroup.click(e=>{
			if(this.edit){this.updateGroup();}
			else{this.saveNewGroup();}
		});
		this.btnCleanForm.click(e=>{
			this.cleanForm();
			this.set_edit=false;
		});

		return menubtn;
	}
	fill(group){
		this.groupToEdit=group;
		this.inputName.val(group.name);
		this.inputExt.val(group.ext);
		this.inputDescription.val(group.description);
		this.inputAuthUser.val(group.authorization_user);
		this.inputSipPassword.val(group.sippassword);
		this.inputIPServer.val(group.ipserver);
		this.inputPortServer.val(group.portserver);
	}
	async saveNewGroup(){
		try{
			if(!this.isComplete()){return;}
			let paramNewGroup={
				name:this.inputName.val(),
				ext:this.inputExt.val(),
				description:this.inputDescription.val(),
				authorization_user:this.inputAuthUser.val(),
				sippassword:this.inputSipPassword.val(),
				ipserver:this.inputIPServer.val(),
				portserver:this.inputPortServer.val()
			}
			let objgroup=new Cl_Group(paramNewGroup);
			let jsongroup=objgroup.json();
			delete jsongroup.uuid;
			
			let promise=new Promise((resolve,reject)=>{
				this.groupsService.saveGroup(jsongroup,resolve,reject);
			}),
			result=await promise;
			if(result.error.status==0){
				this.cleanForm();
				this.toast.set_component({
					title:'Administración',
					message:`Nuevo grupo ${objgroup.name} guardado`,
					textTime:'justo ahora',
					type:'success'
				});
				this.toast.show();
				service_Observer.changeGroupsListObservable.notify(true);
			}else{
				this.toast.set_component({
					title:'Administración',
					message:`No se pudo guardar el nuevo grupo ${objgroup.name}`,
					textTime:'justo ahora',
					type:'danger'
				});
				this.toast.show();
			}
			
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
	async updateGroup(){
		try{
			if(!this.isComplete()){return;}
			let uuidGroupToEdit=this.groupToEdit.uuid,
				paramNewGroup={
					name:this.inputName.val(),
					ext:this.inputExt.val(),
					description:this.inputDescription.val(),
					authorization_user:this.inputAuthUser.val(),
					sippassword:this.inputSipPassword.val(),
					ipserver:this.inputIPServer.val(),
					portserver:this.inputPortServer.val()
				},
				objgroup=new Cl_Group(paramNewGroup);
			let jsongroup=objgroup.json();
			delete jsongroup.uuid;
			
			let promise=new Promise((resolve,reject)=>{
				this.groupsService.updateGroup(uuidGroupToEdit,jsongroup,resolve,reject);
			}),
			result=await promise;
			if(result.error.status==0){
				this.cleanForm();
				this.toast.set_component({
					title:'Administración',
					message:`Grupo ${this.groupToEdit.name} ha sido actualizado`,
					textTime:'justo ahora',
					type:'success'
				});
				this.toast.show();
				service_Observer.changeGroupsListObservable.notify(true);
			}else{
				this.toast.set_component({
					title:'Administración',
					message:`No se pudo actualizar el nuevo grupo ${this.groupToEdit.name}`,
					textTime:'justo ahora',
					type:'danger'
				});
				this.toast.show();
			}
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
}