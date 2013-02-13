/// <reference path="../def/jquery.d.ts" />
/// <reference path="../def/mousetrap.d.ts" />
/// <reference path="../def/toastr.d.ts" />

class App {

	box: HTMLDivElement;

	command(action: Object) {
//		cordova.exec(null, function (e) { alert(e.toString) }, 'App Command', 'command', [action]);
	}

	touch(e: any) {

		if (this.box.style.zIndex == '0') {
			$(this.box).css({ zIndex: 1, backgroundColor: '#FF00FF' }).appendTo('body');
		}

		if (typeof e === 'undefined')
			return;

		var touch = e.touches[0];

		this.box.style.left = touch.pageX + 'px';
		this.box.style.top = touch.pageY + 'px';

		if (touch.pageY < 200) this.command({ action: 'keyboard', value: 'off' });
	}

	down(e: any) {

		$('.match').animate({ marginTop: '100px' });
	}

	up(e:any) {

		$('.match').animate({ marginTop: '0px' });
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

	deviceready() {

		this.InitCanvas();

		this.AddSwiper();

	}

	WindowsInit() {
		Mousetrap.bind('4', () => { console.log('4') });

		this.deviceready();

		toastr.success('Windows init OK');
	}
}

declare var cordova;

if (typeof cordova == 'undefined')
	window.onload = () => new App().WindowsInit();

