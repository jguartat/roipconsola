'use strict';
import {Component_View_Communication} from '../components/component_view_communication.js';
import {Component_View_Administration} from '../components/component_view_administration.js';
import {Component_View_Login} from '../components/component_view_login.js';
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
		component:Component_View_Communication,
		canActivate:[Guard_isUserLoggedIn]
	},
	{
		path:'administration',
		component:Component_View_Administration,
		canActivate:[Guard_isUserLoggedIn, Guard_isUserLoggedInAsAdmin]
	},
	{
		path:'login',
		component:Component_View_Login,
		canActivate:[Guard_login]
	}
];