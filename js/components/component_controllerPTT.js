'use strict';
import {Component_PlayStop} from './component_playstop.js';
import {Cl_JsSip} from '../class/class_jssip.js';
export class Component_ControllerPTT{
	constructor(objGroup){
		this.objGroup=objGroup;
		this.objJsSip=new Cl_JsSip(this.objGroup.ipserver,this.objGroup.portserver,this.objGroup.authorization_user,this.objGroup.sippassword);
		this.card=$(document.createElement('div'))
				.addClass('card border-light mb-4');
		this.icoClose=$(document.createElement('i'))
			.addClass('bi bi-x-lg');
		this.header=this.createHeader(this.objGroup.ext);
		this.title=this.createTitle(this.objGroup.name);
		this.btnPTT=this.createBtnPTT();
		this.btnPlayStop=new Component_PlayStop();
		this.btnControllers=this.createBtnsControllers();

		this.closeEvent=()=>{};
	}
	connect(){
		this.objJsSip.connect();
		this.objJsSip.dtmfEvent=(edtmf)=>{
			if(edtmf.dtmf.tone==='1'){
				this.card.removeClass("border-light");
				this.card.css({'box-shadow':'rgba(220, 53, 69, 0.8) 0px 0px 0px 4px','border-color':'rgba(220, 53, 69, 0.8) 0px 0px 0px 4px'});
			}
			if(edtmf.dtmf.tone==='0'){
				this.card.addClass("border-light");
				this.card.css({'box-shadow':'rgba(220, 53, 69, 0.8) 0px 0px 0px 0px','border-color':'rgba(220, 53, 69, 0.8) 0px 0px 0px 0px'});
			}
		};
		this.objJsSip.peerconnectionEvent=()=>{
			this.card.children('.card-body').css({
				'background': 'url("./img/logoi+d-active.png")',
				'text-align':'-webkit-right',
				'background-repeat':'no-repeat'
			});
			this.btnPTT
				.removeClass('btn-secondary disabled')
				.addClass('btn-success');
		};
		this.objJsSip.incomingCallEvent();
	}
	disconnect(){
		this.objJsSip.disconnect();
	}
	createHeader(text){
		let randomColorHeader=()=>{
			let listColor=["#26ABE2","#594bac","#7E4BAC"],
				min=0,max=listColor.length-1,
				index=Math.floor(Math.random() * (max - min + 1) + min);
			return listColor[index];
		}
		let header=$(document.createElement('div'))
				.addClass('card-header d-flex w-100 justify-content-between text-white')
				.css({'background-color':randomColorHeader()})
				.text('Ext: '+text);
			header.append(this.icoClose);
		this.icoClose
		.mouseover(e=>{this.icoClose.css({'color': 'cornflowerblue','cursor':'pointer'});})
		.mouseleave(e=>{this.icoClose.css({'color': 'white'});});
		return header;
	}
	createTitle(text){
		let title=$(document.createElement('h5'))
			.addClass('card-title d-flex w-50 justify-content-between')
			.css({'color':"#594bac"})
			.text(text);
		title.append(this.objJsSip.icoLed);
		return title
	}
	createBtnPTT(){
		let btnptt=$(document.createElement('button'))
			.addClass('btn btn-secondary btn-lg disabled')
			.css({'opacity':0.8})
			.attr('type','button')
			.text('PTT');

		btnptt
		.mousedown(e=>{ 
			console.log("presionar");
			this.objJsSip.sendDTMF('1',160);
		})
		.mouseup(e=>{
			console.log("soltar");
			this.objJsSip.sendDTMF('0',160);
		});

		return btnptt;
	}
	createBtnsControllers(){
		let controllers=$(document.createElement('div'))
				.addClass(''),
			ctrlPTT=$(document.createElement('div'))
				.addClass('row justify-content-center'),
			ctrlAudio=$(document.createElement('div'))
				.addClass('row justify-content-end'),
			columnPTT=$(document.createElement('div'))
				.addClass('col-auto  mt-2'),
			columnAudio=$(document.createElement('div'))
				.addClass('col-auto mt-4');
		columnPTT.append(this.btnPTT);
		columnAudio.append(this.objJsSip.audio);
		
		ctrlPTT.append(columnPTT);
		ctrlAudio.append(columnAudio);

		controllers.append(ctrlPTT);
		controllers.append(ctrlAudio);

		return controllers;
	}
	get get_component(){
		let card=this.card,
			bodyCard=$(document.createElement('div'))
				.addClass('card-body text-dark')
				.css({
					'background': 'url("./img/logoi+d-deactive.png")',
					'text-align':'-webkit-right',
					'background-repeat':'no-repeat'
				});
		bodyCard.append(this.title);
		bodyCard.append(this.btnControllers);
		card.append(this.header);
		card.append(bodyCard);

		this.icoClose.click(e=>{
			card.css({
				'animation':'zoomOut',
				'animation-duration':'0.3s'
			});
			card.on('animationend',e=>{
				$(e.target).parent().remove();
			});
			this.disconnect();
			this.closeEvent();
		});
		card.css({
			'animation':'zoomIn',
			'animation-duration':'0.3s'
		});
		return card;
	}
}