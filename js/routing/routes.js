'use strict';
import {component_view_communication} from '../components/component_view_communication.js';
import {component_view_administration} from '../components/component_view_administration.js';
import {component_view_login} from '../components/component_view_login.js';
import {Guard_login} from '../guards/guard_login.js';
import {Guard_isUserLoggedIn} from '../guards/guard_isUserLoggedIn.js';
import {Guard_isUserLoggedInAsAdmin} from '../guards/guard_isUserLoggedInAsAdmin.js';

export const routes=[
	{
		path:'',
		redirectTo:'/comunications',
	},
	{
		path:'comunications',
		component:component_view_communication,
		canActivate:[Guard_isUserLoggedIn]
	},
	{
		path:'administration',
		component:component_view_administration,
		canActivate:[Guard_isUserLoggedIn, Guard_isUserLoggedInAsAdmin]
	},
	{
		path:'login',
		component:component_view_login,
		canActivate:[Guard_login]
	}
];