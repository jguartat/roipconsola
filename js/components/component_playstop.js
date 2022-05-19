"use strict";
export class Component_PlayStop{
	constructor(){
		this.btn_play=$(document.createElement('input'))
			.attr('type','radio')
			.addClass('btn-check')
			.attr('name','playstop')
			.attr('autocomplete','off')
			.attr('id','btnplay');
		this.label_play=$(document.createElement('label'))
			.addClass('btn btn-outline-primary')
			.attr('for','btnplay');
		this.ico_play=$(document.createElement('i'))
			.addClass('bi bi-play-fill');
		this.label_play.append(this.ico_play);
		this.btn_stop=$(document.createElement('input'))
			.attr('type','radio')
			.addClass('btn-check')
			.attr('name','playstop')
			.attr('autocomplete','off')
			.attr('id','btnstop');
		this.label_stop=$(document.createElement('label'))
			.addClass('btn btn-outline-primary')
			.attr('for','btnstop');
		this.ico_stop=$(document.createElement('i'))
			.addClass('bi bi-stop-fill');
		this.label_stop.append(this.ico_stop);

		this.playEvent=()=>{};
		this.stopEvent=()=>{};
	}
	get get_component(){
		let component=$(document.createElement('div'))
			.attr('role','group')
			.attr('aria-label','Basic radio toggle button group')
			.addClass('btn-group');
		component.append(this.btn_play);
		component.append(this.label_play);
		component.append(this.btn_stop);
		component.append(this.label_stop);
		this.btn_play.click(e=>{
			console.log("Component_PlayStop: play");
			this.playEvent();
		});
		this.btn_stop.click(e=>{
			console.log("Component_PlayStop: stop");
			this.stopEvent();
		});
		return component;
	}
}