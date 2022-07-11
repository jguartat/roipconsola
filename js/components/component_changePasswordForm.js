'use strict';
import {Cl_User} from '../class/class_user.js';
import {Service_Users} from '../services/service_users.js';
import {router} from '../routing/router.js';
import {service_Cookie} from '../services/service_cookie.js';
import {service_Encryption} from '../services/service_encryption.js';

export class Component_ChangePasswordForm{
	constructor(){
		this.head=$(document.createElement('div'))
			.addClass('d-flex w-100 justify-content-between')
		this.title=$(document.createElement('h1'))
			.addClass('fw-lighter mb-4')
			.css({'color':'#7E4BAC'})
			.text("  Edita contraseña");
		this.icoTitle=$(document.createElement('i'))
			.addClass('bi bi-key-fill')
			.css({'font-size': 'xx-large',
				'color':'#7E4BAC'});
		this.inputCurrentPassword=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'id':'idcurrentpassword',
				'type':'password',
				'placeholder':'actual contraseña'
			});
		this.inputNewPassword=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'id':'idnewpassword',
				'type':'password',
				'placeholder':'contraseña'
			});
		this.inputNewPasswordConfirm=$(document.createElement('input'))
			.addClass('form-control')
			.attr({
				'type':'password',
				'placeholder':'contraseña'
			});
		this.btnOk=$(document.createElement('button'))
			.addClass('btn btn-outline-success')
			.text('Aceptar ');
		this.btnCleanForm=$(document.createElement('button'))
			.addClass('btn btn-outline-danger')
			.text('Limpiar ');

		this.usersService=new Service_Users();
	}
	get get_component(){
		let form=$(document.createElement('div')),
			inputArray=[
				{'label':'Actual contraseña','input':this.inputCurrentPassword},
				{'label':'Nueva contraseña','input':this.inputNewPassword},
				{'label':'Confirmar nueva contraseña','input':this.inputNewPasswordConfirm}
			];
		this.title.prepend(this.icoTitle);
		this.head.append(this.title);
		form.append(this.head);
		inputArray.forEach(element=>{
			form.append(this.createFormInputsElements(element));
		});
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
	cleanForm(){
		this.inputCurrentPassword.val("");
		this.inputNewPassword.val("");
		this.inputNewPasswordConfirm.val("");
	}
	passwordIsFull(inputElement){
		let response={'value':true,'description':"Contraseña no está vacía"};
		if(inputElement.val().length==0){
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
		response=response && this.passwordIsFull(this.inputCurrentPassword).value;
		response=response && this.passwordIsFull(this.inputNewPassword).value;
		response=response && this.passwordIsFull(this.inputNewPasswordConfirm).value;
		return response
	}
	createFormButtonsElements(){
		let menubtn=$(document.createElement('div'))
				.addClass('d-grid gap-2 d-sm-flex justify-content-sm-end'),
			icoOk=$(document.createElement('i'))
				.addClass('bi bi-check-lg'),
			icoClean=$(document.createElement('i'))
				.addClass('bi bi-eraser-fill');
		this.btnOk.append(icoOk);
		this.btnCleanForm.append(icoClean);

		menubtn.append(this.btnOk);
		menubtn.append(this.btnCleanForm);

		this.btnOk.click(e=>{
			let uuidUserToEdit=JSON.parse(service_Encryption.decrypt(service_Cookie.getCookie('dataUser'))).uuid,
				jsonnewpass={
					currentpassword:this.inputCurrentPassword.val(),
					newpassword:this.inputNewPassword.val()
				};
			if(!this.isComplete()){return;}
			if(this.inputNewPassword.val()===this.inputNewPasswordConfirm.val()){
				let promise=new Promise((resolve,reject)=>{
					this.usersService.updateUserPassword(uuidUserToEdit,jsonnewpass,resolve);
				});
				
				promise.then(result=>{
					if(result.error.status==0){
						this.cleanForm();
						this.toast.set_component({
							title:'Administración',
							message:`Su nueva contraseña ha sido guardada`,
							textTime:'justo ahora',
							type:'success'
						});
						this.toast.show();
						service_Cookie.deleteAllCookies();
						this.toast.set_hiddenEvent=()=>{
							router.load('login');
						}
					}else{
						this.toast.set_component({
							title:'Administración',
							message:`No se pudo guardar su nueva contraseña`,
							textTime:'justo ahora',
							type:'danger'
						});
						this.toast.show();
					}
				});
			}else{
				this.toast.set_component({
						title:'Administración',
						message:'No coinciden las contraseñas',
						textTime:'justo ahora',
						type:'warning'
					});
				this.toast.show();
			}
		});
		this.btnCleanForm.click(e=>{
			this.cleanForm();
		});

		return menubtn;
	}
}