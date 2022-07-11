'use strict';
export class Component_Toast{
	constructor(message,type,textTime){//type: info,success,warning,danger. Default: info
		this.title="Info";
		this.message=message;
		this.textTime=textTime;
		this.ico=this.createIco(type);
		this.toast=$(document.createElement('div'))
			.addClass('toast hide')
			.attr({
				'role':'alert',
				'aria-live':'assertive',
				'aria-atomic':'true',
				'data-bs-delay':5000,
				//'data-bs-autohide':false
			});
	}
	set_component(jsonattr){
		this.title=jsonattr.title;
		this.message=jsonattr.message;
		this.textTime=jsonattr.textTime;
		this.setIco(jsonattr.type);

		this.toast.find('strong').text(this.title);
		this.toast.find('small').text(this.textTime);
		this.toast.find('.toast-body').text(this.message);
	}
	setIco(type){
		let class_='bi bi-info-circle-fill',
			css_={};
		$(this.ico)
			.removeClass('bi-info-circle-fill')
			.removeClass('bi-exclamation-circle-fill');
		switch(type){
			case 'info':
				class_='bi-info-circle-fill';
				css_={'color': '#0dcaf0'};
				break;
			case 'success':
				class_='bi-info-circle-fill';
				css_={'color': '#198754'};
				break;
			case 'warning':
				class_='bi-exclamation-circle-fill';
				css_={'color': '#ffc107'};
				break;
			case 'danger':
				class_='bi-exclamation-circle-fill';
				css_={'color': '#dc3545'};
				break;
			default:
				class_='bi-info-circle-fill';
				css_={'color': '#0dcaf0'};
				break;
		}
		$(this.ico)
			.addClass(class_)
			.css(css_);

	}
	createIco(type){
		let class_='bi bi-info-circle-fill',
			css_={};
		switch(type){
			case 'info':
				class_='bi bi-info-circle-fill';
				css_={'color': '#0dcaf0'};
				break;
			case 'success':
				class_='bi bi-info-circle-fill';
				css_={'color': '#198754'};
				break;
			case 'warning':
				class_='bi bi-exclamation-circle-fill';
				css_={'color': '#ffc107'};
				break;
			case 'danger':
				class_='bi bi-exclamation-circle-fill';
				css_={'color': '#dc3545'};
				break;
			default:
				class_='bi bi-info-circle-fill';
				css_={'color': '#0dcaf0'};
				break;
		}
		let ico=$(document.createElement('i'))
			.addClass(class_)
			.css(css_);
		return ico;
	}
	createHeader(){
		let header=$(document.createElement('div'))
				.addClass('toast-header'),
			strong=$(document.createElement('strong'))
				.addClass('me-auto')
				.css({'margin-left': '5px'})
				.text(this.title),
			small=$(document.createElement('small'))
				.text(this.textTime),
			button=$(document.createElement('button'))
				.addClass('btn-close')
				.attr({
					'type':'button',
					'data-bs-dismiss':'toast',
					'aria-label':'Close'
				});
		header.append(this.ico);
		header.append(strong);
		header.append(small);
		header.append(button);

		return header;
	}
	createBody(){
		let body=$(document.createElement('div'))
			.addClass('toast-body')
			.text(this.message);
		return body;
	}
	set set_hiddenEvent(callback){
		this.toast.get(0).addEventListener('hidden.bs.toast',callback);
	}
	get get_component(){
		let position=$(document.createElement('div'))
			.addClass('position-fixed bottom-0 end-0 p-3')
			.css('z-index',11);

		let header= this.createHeader(),
			body= this.createBody();

		this.toast.append(header);
		this.toast.append(body);

		position.append(this.toast);
		return position;
	}
	show(){
		this.toast.toast('show');
	}
}