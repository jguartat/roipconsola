'use strict';
import {Cl_User} from '../class/class_user.js';
import {Service_Users} from '../services/service_users.js';
import {router} from '../routing/router.js';

export class Component_LoginForm{
	constructor(){
		this.head=$(document.createElement('div'))
			.addClass('d-flex w-100 justify-content-between')
		this.title=$(document.createElement('h1'))
			.addClass('fw-lighter mb-4')
			.css({'color':'#7E4BAC'})
			.text("  Ingreso al sistema");
		this.icoTitle=$(document.createElement('i'))
			.addClass('bi bi-key-fill')
			.css({'font-size': 'xx-large',
				'color':'#7E4BAC'});
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
		this.inputIsAdmin=$(document.createElement('input'))
			.addClass('form-check-input')
			.attr({
				'type':'checkbox',
				'id':'isadmin'
			});
		this.btnLogin=$(document.createElement('button'))
			.addClass('btn btn-outline-success')
			.text('Login ');
		this.btnCleanForm=$(document.createElement('button'))
			.addClass('btn btn-outline-danger')
			.text('Limpiar ');

		this.usersService=new Service_Users();
	}
	get get_component(){
		let form=$(document.createElement('div')),
			inputArray=[
				{'label':'Correo electrónico','input':this.inputEmail},
				{'label':'Contraseña','input':this.inputPassword}
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
	passwordIsFull(){
		let response={'value':true,'description':"Contraseña no está vacía"};
		if(this.inputPassword.val().length==0){
			response.value=false;
			response.description="Contraseña no debe estar vacía";
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
		response=response && this.passwordIsFull().value;
		return response
	}
	createFormButtonsElements(){
		let menubtn=$(document.createElement('div'))
				.addClass('d-grid gap-2 d-sm-flex justify-content-sm-end'),
			icoLogin=$(document.createElement('i'))
				.addClass('bi bi-lock-fill'),
			icoClean=$(document.createElement('i'))
				.addClass('bi bi-eraser-fill');
		this.btnLogin.append(icoLogin);
		this.btnCleanForm.append(icoClean);

		menubtn.append(this.btnLogin);
		menubtn.append(this.btnCleanForm);

		this.btnLogin.click(e=>{
			let objuser=new Cl_User(this.inputEmail.val(), this.inputPassword.val());
			objuser.admin=this.inputIsAdmin.is(':checked');
			let jsonuser=objuser.json();
			delete jsonuser.uuid;
			if(!this.isComplete()){return;}

			let promise=new Promise((resolve,reject)=>{
				this.usersService.loginUser(jsonuser,resolve);
			});
			promise.then(result=>{
				if(result.error.status==0){
					router.load('');
				}else{
					
				}
			});

		});
		this.btnCleanForm.click(e=>{
			this.cleanForm();
		});

		return menubtn;
	}
}