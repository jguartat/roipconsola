'use strict';
import {Observable} from '../../libs/observerPattern/class/class_observable.js';
import {Observer} from '../../libs/observerPattern/class/class_observer.js';
export class Service_Observers{
	constructor(){
		this.connectAllGroupsObservable=new Observable(null);
		this.disconnectAllGroupsObservable=new Observable(null);
		
		let statePTT={
			"connected":false,
			"pushbutton":"off"
		};
		this.connectToPTTusbObservable=new Observable(statePTT);
		this.changeUsersListObservable=new Observable(false);
		this.changeGroupsListObservable=new Observable(false);
	}
}
export var service_Observer=new Service_Observers();