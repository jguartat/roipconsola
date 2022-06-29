'use strict';
import {component_view_communication} from '../components/component_view_communication.js';
import {component_view_administration} from '../components/component_view_administration.js';
import {component_view_login} from '../components/component_view_login.js';

export const routes=[
	{
		path:'',
		redirectTo:'/comunications',
	},
	{
		path:'comunications',
		component:component_view_communication
	},
	{
		path:'administration',
		component:component_view_administration
	},
	{
		path:'login',
		component:component_view_login
	}
];