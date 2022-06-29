'use strict';
import {routes} from './routes.js';

class Router{
	constructor(routes){
		this.routes=routes;
		this.root="/";
		this.initRouter();
	}
	initRouter(){
		let { location: {pathname = "" } } = window,
		URL = pathname.replace(this.root,"");
		this.load(URL);
	}
	load(path){
		$('body').html("");
		let route=this.findRoute(path);
		if(route.component!=null || route.component!=undefined){
			route.component.load();
		}else if(route.redirectTo!=null || route.redirectTo!=undefined){
			this.load(route.redirectTo.replace("/",""));
		}
	}
	findRoute(path){
		let route=null;
		for(let i=0;i<this.routes.length;i++){
			if(this.routes[i].path === path){
				route=this.routes[i];
				i=this.routes.length+1;
			}
		}
		return route;
	}
}

export const router = new Router(routes);