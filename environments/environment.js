'use strict';

let environment_prod={
	api_uri:'http://localhost:4000/api',
	secretkey:"]2ck'j878&re34_4wrdvmn ,m@8}6",
	pptusb_ip:'localhost',
	pttusb_port:3000,
	pttusb_protocol:'pttusb-protocol',
	freepbx_ip:'192.168.107.200',
	freepbx_port:8089,
	freepbx_sippassword:'12345'
};

let environment_dev={
	api_uri:'http://localhost:4000/api',
	secretkey:"]2ck'j878&re34_4wrdvmn ,m@8}6",
	pptusb_ip:'localhost',
	pttusb_port:3000,
	pttusb_protocol:'pttusb-protocol',
	freepbx_ip:'192.168.107.23',
	freepbx_port:8089,
	freepbx_sippassword:'12345'
};


export const environment=environment_prod;