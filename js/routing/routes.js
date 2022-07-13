'use strict';
import {Component_View_Communication} from '../components/component_view_communication.js';
import {Component_View_Users} from '../components/component_view_users.js';
import {Component_View_Groups} from '../components/component_view_groups.js';
import {Component_View_Login} from '../components/component_view_login.js';
import {Component_View_ChangePassword} from '../components/component_view_changepassword.js';
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
		path:'users',
		component:Component_View_Users,
		canActivate:[Guard_isUserLoggedIn, Guard_isUserLoggedInAsAdmin]
	},
	{
		path:'groups',
		component:Component_View_Groups,
		canActivate:[Guard_isUserLoggedIn, Guard_isUserLoggedInAsAdmin]
	},
	{
		path:'login',
		component:Component_View_Login,
		canActivate:[Guard_login]
	},
	{
		path:'changepassword',
		component:Component_View_ChangePassword,
		canActivate:[Guard_isUserLoggedIn]
	}
];