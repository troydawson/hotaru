/// <reference path="../def/underscore.d.ts" />
/// <reference path="../def/state-machine.d.ts" />
/// <reference path="../def/jquery.d.ts" />
/// <reference path="../def/mousetrap.d.ts" />
/// <reference path="../def/toastr.d.ts" />

//? var app;

class App {

	constructor() {
//?		app = this;
	}

	command(action: Object) {
//		cordova.exec(null, function (e) { alert(e.toString) }, 'App Command', 'command', [action]);
	}

	touch(e: any) {

	}

	down(e: any) {

	}

	up(e:any) {

	}

	InitCanvas() {

		$(document.createElement('div')).attr('id', 'app_container').appendTo('body');

		var app_canvas = <HTMLCanvasElement> document.createElement('canvas');

		app_canvas.id = 'app_canvas';

		app_canvas.width = 320;  //window.innerWidth;
		app_canvas.height = 480;  //window.innerHeight;

		var ctx = app_canvas.getContext('2d');

		ctx.fillStyle = '#DEDEC0';

		ctx.fillRect(0, 0, app_canvas.width, app_canvas.height);

		$(app_canvas).appendTo('#app_container');
	}

	AddSwiper() {

		$(document.createElement('div')).attr('id', 'swiper').appendTo('#app_container');

		$('#swiper').on({
						'swiperight': function (ev) {
							console.log('right swipe');
						},
						'swipeleft': function (ev) {
							console.log('left swipe');
						},
						'swipeup': function (ev) {
							console.log('up swipe');
						},
						'swipedown': function (ev) {
							console.log('down swipe');
						}
					});
	}

	KanjibotInit() {

		this.InitCanvas();

		this.AddSwiper();

	}

	WindowsInit() {
		Mousetrap.bind('4', () => { console.log('4') });

		this.KanjibotInit();

		toastr.success('Windows init OK');
	}
}

declare var cordova;

if (typeof cordova != 'undefined')
	document.addEventListener('deviceready', () => new App().KanjibotInit(), false);
else
	window.onload = () => new App().WindowsInit();

