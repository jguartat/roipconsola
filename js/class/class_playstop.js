'use strict';
import {fn_iniciarReproducion,fn_terminarReproducion} from '../AudioBrowser/audioBrowserFragmentoAudio.js';
export class Cl_PlayStop{
	constructor(){}
	play(){
		fn_iniciarReproducion();
	}
	stop(){
		fn_terminarReproducion();
	}
}