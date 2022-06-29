'use strict';
import {Service_Users} from '../services/service_users.js';
import {Cl_User} from '../class/class_user.js';
import {service_Observer} from '../services/service_observers.js';
export class Component_UserForm{
	constructor(){
		this.head=$(document.createElement('div'))
			.addClass('d-flex w-100 justify-content-between')
		this.title=$(document.createElement('h1'))
			.addClass('fw-lighter mb-4')
			.css({'color':'#7E4BAC'})
			.text("  Nuevo usuario");
		this.icoTitle=$(document.createElement('i'))
			.addClass('bi bi-person-plus-fill')
			.css({'font-size': 'xx-large',
				'color':'#7E4BAC'});
		this.icoBtnTitle=$(document.createElement('i'))
			.addClass('bi bi-plus-square')
			.css({'font-size': 'xx-large'});
		this.inputEmail=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'id':'idemail',
				'type':'email',
				'placeholder':'usuario@ejemplo.com'
			});
		this.inputPassword=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'id':'idpassword',
				'type':'password',
				'placeholder':'contraseña'
			});
		this.inputPasswordConfirm=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'type':'password',
				'placeholder':'contraseña'
			});
		this.inputIsAdmin=$(document.createElement('input'))
			.addClass('form-check-input')
			.attr({
				'type':'checkbox',
				'id':'isadmin'
			});
		this.btnCreateUser=$(document.createElement('button'))
			.addClass('btn btn-outline-success')
			.text('Guardar ');
		this.btnCleanForm=$(document.createElement('button'))
			.addClass('btn btn-outline-danger')
			.text('Limpiar ');

		this.usersService=new Service_Users();
		this.toast=null;//It is initialized from its parent component
		this.edit=false;
		this.userToEdit=null;
	}
	get get_component(){
		let form=$(document.createElement('div')),
			inputArray=[
				{'label':'Correo electrónico','input':this.inputEmail},
				{'label':'Contraseña','input':this.inputPassword},
				{'label':'Confirmar contraseña','input':this.inputPasswordConfirm},
			];
		this.title.prepend(this.icoTitle);
		this.head.append(this.title);
		form.append(this.head);
		inputArray.forEach(element=>{
			form.append(this.createFormInputsElements(element));
		});
		form.append(this.createFormIsAdminElement());
		form.append(this.createFormButtonsElements());

		return form;
	}
	set set_edit(boolean){
		this.edit=boolean;
		if(this.edit){
			this.title.text("  Editar usuario");
			this.icoTitle
				.removeClass('bi-person-plus-fill')
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
			this.title.text("  Nuevo usuario");
			this.icoTitle
				.removeClass('bi-pen-fill')
				.addClass('bi-person-plus-fill');
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
	createFormIsAdminElement(){
		let formCheck=$(document.createElement('div'))
			.addClass('form-check form-check-reverse form-switch mb-3'),
			label=$(document.createElement('label'))
			.addClass('form-check-label')
			.attr('for','isadmin')
			.text('Administrador');

		formCheck.append(this.inputIsAdmin);
		formCheck.append(label);
		return formCheck;
	}
	cleanForm(){
		this.inputEmail.val("");
		this.inputPassword.val("");
		this.inputPasswordConfirm.val("");
		this.inputIsAdmin.prop("checked",false);
	}
	emailIsValid(){
		let response={'value':false,'description':"Email no es válido"}
		let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(this.inputEmail.val().match(mailformat)){
			response.value=true;
			response.description="Email es válido";
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
	passwordIsValid(){
		let response={'value':true,'description':"Contraseña válida"};
		let hasLowerCaseLetter=/[a-z]/g,
			hasUpperCaseLetter= /[A-Z]/g,
			hasNumber = /[0-9]/g;
		if(!this.inputPassword.val().match(hasLowerCaseLetter)){
			response.value=false;
			response.description="Contraseña debe contener una letra minúscula";
			this.toast.set_component({
				title:'Administración',
				message:response.description,
				textTime:'justo ahora',
				type:'warning'
			});
			this.toast.show();
			return response;
		}
		if(!this.inputPassword.val().match(hasUpperCaseLetter)){
			response.value=false;
			response.description="Contraseña debe contener una letra mayúscula";
			this.toast.set_component({
				title:'Administración',
				message:response.description,
				textTime:'justo ahora',
				type:'warning'
			});
			this.toast.show();
			return response;
		}
		if(!this.inputPassword.val().match(hasNumber)){
			response.value=false;
			response.description="Contraseña debe contener un número";
			this.toast.set_component({
				title:'Administración',
				message:response.description,
				textTime:'justo ahora',
				type:'warning'
			});
			this.toast.show();
			return response;
		}
		if(this.inputPassword.val().length<8){
			response.value=false;
			response.description="Contraseña debe tener mínimo 8 caracteres";
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
		response=response && this.emailIsValid().value;
		response=response && this.passwordIsValid().value;
		return response
	}
	createFormButtonsElements(){
		let menubtn=$(document.createElement('div'))
				.addClass('d-grid gap-2 d-sm-flex justify-content-sm-end'),
			icoCreate=$(document.createElement('i'))
				.addClass('bi bi-save2-fill'),
			icoClean=$(document.createElement('i'))
				.addClass('bi bi-eraser-fill');
		this.btnCreateUser.append(icoCreate);
		this.btnCleanForm.append(icoClean);

		menubtn.append(this.btnCreateUser);
		menubtn.append(this.btnCleanForm);

		this.btnCreateUser.click(e=>{
			if(this.edit){this.updateUser();}
			else{this.saveNewUser();}
		});
		this.btnCleanForm.click(e=>{
			this.cleanForm();
			this.set_edit=false;
		});

		return menubtn;
	}
	fill(user){
		this.userToEdit=user;
		this.inputEmail.val(user.email);
		this.inputPassword.val(user.password);
		this.inputPasswordConfirm.val(user.password);
		this.inputIsAdmin.prop("checked",user.admin);
	}
	async saveNewUser(){
		let objuser=new Cl_User(this.inputEmail.val(),this.inputPassword.val());
		objuser.admin=this.inputIsAdmin.is(':checked');
		let jsonuser=objuser.json();
		delete jsonuser.uuid;
		if(!this.isComplete()){return;}
		if(this.inputPassword.val()===this.inputPasswordConfirm.val()){
			let promise=new Promise((resolve,reject)=>{
				this.usersService.saveUser(jsonuser,resolve);
			}),
			result=await promise;
			/*promise.then(result=>{
				console.log(result);
				this.cleanForm();
			});*/
			if(result.error.status==0){
				this.cleanForm();
				this.toast.set_component({
					title:'Administración',
					message:`Nuevo usuario ${objuser.email} guardado`,
					textTime:'justo ahora',
					type:'success'
				});
				this.toast.show();
				service_Observer.changeUsersListObservable.notify(true);
			}else{
				this.toast.set_component({
					title:'Administración',
					message:`No se pudo guardar el nuevo usuario ${objuser.email}`,
					textTime:'justo ahora',
					type:'danger'
				});
				this.toast.show();
			}
		}else{
			this.toast.set_component({
					title:'Administración',
					message:'No coinciden las contraseñas',
					textTime:'justo ahora',
					type:'warning'
				});
			this.toast.show();
		}
	}
	async updateUser(){
		let uuidUserToEdit=this.userToEdit.uuid,
			objuser=new Cl_User(this.inputEmail.val(),this.inputPassword.val());
		objuser.admin=this.inputIsAdmin.is(':checked');
		let jsonuser=objuser.json();
		delete jsonuser.uuid;
		if(!this.isComplete()){return;}
		if(this.inputPassword.val()===this.inputPasswordConfirm.val()){
			if(this.userToEdit.password==objuser.password){delete jsonuser.password;}
			let promise=new Promise((resolve,reject)=>{
				this.usersService.updateUser(uuidUserToEdit,jsonuser,resolve);
			}),
			result=await promise;
			if(result.error.status==0){
				this.cleanForm();
				this.toast.set_component({
					title:'Administración',
					message:`Usuario ${this.userToEdit.email} ha sido actualizado`,
					textTime:'justo ahora',
					type:'success'
				});
				this.toast.show();
				service_Observer.changeUsersListObservable.notify(true);
			}else{
				this.toast.set_component({
					title:'Administración',
					message:`No se pudo actualizar el nuevo usuario ${this.userToEdit.email}`,
					textTime:'justo ahora',
					type:'danger'
				});
				this.toast.show();
			}
		}else{
			this.toast.set_component({
					title:'Administración',
					message:'No coinciden las contraseñas',
					textTime:'justo ahora',
					type:'warning'
				});
			this.toast.show();
		}
	}
}