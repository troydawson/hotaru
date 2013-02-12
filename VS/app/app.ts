/// <reference path="../def/jquery.d.ts" />
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

	deviceready() {

		var app_canvas = <HTMLCanvasElement> document.createElement('canvas');
		
		app_canvas.id = 'app_canvas';
		
		app_canvas.width = 320;  //window.innerWidth;
		app_canvas.height = 480;  //window.innerHeight;
		
		var ctx = app_canvas.getContext('2d');
		
		ctx.fillStyle = '#DEDEC0';
		
		ctx.fillRect(0, 0, app_canvas.width, app_canvas.height);
		
		document.body.appendChild(app_canvas);
		
		this.box = <HTMLDivElement> document.createElement('div');
		this.box.className = 'box';
		this.box.style.zIndex = '0';
		
		for (var i = 0; i < 8; i++)
			$('<div/>').addClass('match').css({ top: (10 + Math.floor(i / 2) * 60) + 'px', left: (3 + (i % 2) * 160) + 'px' }).appendTo('body');
		
		document.addEventListener('touchstart', (e) => this.touch(e), false);
		document.addEventListener('touchmove', (e) => this.touch(e), false);
		
		document.addEventListener('mousedown', (e) => this.down(e), false);
		document.addEventListener('mouseup', (e) => this.up(e), false);
	}
}

window.onload = () => new App().deviceready();
