/// <reference path="../def/state-machine.d.ts" />
/// <reference path="../def/three.d.ts" />
/// <reference path="../def/jquery.d.ts" />
/// <reference path="../def/underscore.d.ts" />
/// <reference path="../def/mousetrap.d.ts" />
/// <reference path="../def/toastr.d.ts" />

declare var cordova;
var on_device = typeof cordova != 'undefined';
declare var devicePixelRatio;

//? var app;

class CGPoint extends THREE.Vector2{
	constructor(x?: number = 0, y?: number = 0) { super(x, y) }
}

var CGPointZero = new CGPoint();

class CGSize {
	constructor(public width?: number = 0, public height?: number = 0) { }
}

class CGRect {
	constructor(public origin?: CGPoint = CGPointZero, public size?: CGSize = new CGSize()) { }
}

class BlockBoardElement {

	src_frame: CGRect;
	dst_frame: CGRect;
	alpha: number = 0.55;

	constructor(i: number, public id: string) {

		var row = Math.floor(i / 5);
		var col = i % 5;

		this.src_frame = new CGRect(new CGPoint(4 + i * (96 + 8), 4), new CGSize(96, 96));

		this.dst_frame = new CGRect(new CGPoint(24 + col * (48 + 8), 460 - (2 - row) * (48 + 8)), new CGSize(48, 48));
	}

	render(ctx: CanvasRenderingContext2D, src_image: HTMLImageElement) {
		
		var previous_alpha = ctx.globalAlpha;

		ctx.globalAlpha = this.alpha;

		ctx.drawImage(src_image, this.src_frame.origin.x, this.src_frame.origin.y, this.src_frame.size.width, this.src_frame.size.height,
			this.dst_frame.origin.x, this.dst_frame.origin.y, this.dst_frame.size.width, this.dst_frame.size.height);

		ctx.globalAlpha = previous_alpha;
	}
}

class BlockBoard {

	blocks: BlockBoardElement[] = [];

	constructor(public ctx: CanvasRenderingContext2D, public ui_image: HTMLImageElement) {

	var block_ids = "0123456789";

	for (var i = 0; i < 10; i++)
		this.blocks.push(new BlockBoardElement(i, block_ids.charAt(i)));

	}

	render() {

		for (var i = 0; i < 10; i++) {
			this.blocks[i].render(this.ctx, this.ui_image);
		}
	}
}


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

	ctx: CanvasRenderingContext2D;

	InitCanvas() {

		$(document.createElement('div')).attr('id', 'app_container').appendTo('body');

		var app_canvas = <HTMLCanvasElement> document.createElement('canvas');

		app_canvas.id = 'app_canvas';
		app_canvas.width = on_device ? (window.innerWidth * devicePixelRatio) : 320;
		app_canvas.height = on_device ? (window.innerHeight * devicePixelRatio) : 460;

		this.ctx = app_canvas.getContext('2d');

		this.ctx.fillStyle = '#DEDEC0';

		this.ctx.fillRect(0, 0, app_canvas.width, app_canvas.height);

		$(app_canvas).appendTo('#app_container');

		if (typeof devicePixelRatio != 'undefined')
			this.ctx.scale(devicePixelRatio, devicePixelRatio);

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

	blockboard: BlockBoard;

	CreateUI(ui_image: HTMLImageElement) {
		this.blockboard = new BlockBoard(this.ctx, ui_image);
		this.blockboard.render();
	}

	KanjibotInit() {

		this.InitCanvas();

		this.AddSwiper();

		var ui_image = new Image();

		this.ctx.globalAlpha = 0.6;

		ui_image.onload = () => this.CreateUI(ui_image);
		ui_image.onerror = () => toastr.error('not loaded!');

		ui_image.src = 'img/ui_elements@2x.png';
	}


	WindowsInit() {

		Mousetrap.bind('4', () => console.log('4'));

		this.KanjibotInit();
	}
}

if (on_device)
	document.addEventListener('deviceready', () => new App().KanjibotInit(), false);
else
	window.onload = () => new App().WindowsInit();

