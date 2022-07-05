'use strict';
export class Service_Groups{
	constructor(){
		this.groups_={
			'idabc1001':{'name':'WellscomUIO','ext':101,'description':'Quito','authorization_user':105,'sippassword':'12345','ipserver':'192.168.107.23','portserver':8089},
			'idabc1003':{'name':'WellscomGYE','ext':103,'description':'Guayaquil','authorization_user':106,'sippassword':'12345','ipserver':'192.168.107.23','portserver':8089},
			'idabc1008':{'name':'Josué','ext':108,'description':'Prueba softphone','authorization_user':115,'sippassword':'12345','ipserver':'192.168.107.23','portserver':8089},
		}
		this.groups={
			'idabc1001':{'name':'Marfrisco','ext':101,'description':'Camaronera','authorization_user':1101,'sippassword':'12345','ipserver':'192.168.107.200','portserver':8089},
			'idabc1003':{'name':'WellscomGYE','ext':102,'description':'Oficina','authorization_user':1102,'sippassword':'12345','ipserver':'192.168.107.200','portserver':8089}
		}
	}
	get get_groups(){
		return this.groups;
	}
}