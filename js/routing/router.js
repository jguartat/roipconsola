'use strict';
import {routes} from './routes.js';

export class Router{
	constructor(){
		this.routes=routes;
		this.root="/";
	}
	init(){
		let { location: {pathname = "" } } = window,
		URL = pathname.replace(this.root,"");
		this.load(URL);
	}
	isAuthorized(route){
		let authorized=false;
		if(route.canActivate!=null && route.canActivate!=undefined){
			for(let i=0;i<route.canActivate.length;i++){
				let guard=new route.canActivate[i]();
				authorized=guard.canActivate();
				if(!authorized){
					i=i+route.canActivate.length;
				}
			}
		}
		return authorized;
	}
	load(path){
		$('body').html("");
		let route=this.findRoute(path);
		if(route!=null){
			if(route.component!=null && route.component!=undefined){
				if(this.isAuthorized(route)){
					history.pushState({ubicacion:"RoipConsola"},"RoipConsola",path);
					let view=new route.component();
					view.load();
				}
			}else if(route.redirectTo!=null && route.redirectTo!=undefined){
				this.load(route.redirectTo.replace("/",""));
			}
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

export const router = new Router();

