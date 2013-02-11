var app = {

	touch: function(e) {
		
		if (app.box.style.zIndex < 1) {
			$(app.box).css({ zIndex: 1, backgroundColor: '#FF00FF' }).appendTo('body');
		}
		
		if (typeof e === 'undefined')
			return;
		
		var touch = e.touches[0];
		
		app.box.style.left = touch.pageX+'px';
		app.box.style.top = touch.pageY+'px';
	},
	
	down: function(e) {
	
		$('.match').animate({ marginTop: '100px'});
	},
	
	up: function(e) {
		
		$('.match').animate({ marginTop: '0px'});
	},
	

	deviceready: function() {

		console.log('hello');

		var app_canvas = document.createElement('canvas');
		
		app_canvas.id = 'app_canvas';
		
		app_canvas.width = window.innerWidth;
		app_canvas.height = window.innerHeight;
		
		var ctx = app_canvas.getContext('2d');
		
		ctx.fillStyle = '#DEDEC0';

		ctx.fillRect(0, 0, app_canvas.width, app_canvas.height);

		document.body.appendChild(app_canvas);

		app.box = document.createElement('div');
		app.box.className = 'box';
		app.box.style.zIndex = 0;
		
		for (var i = 0; i < 8; i++)
			$('<div/>').addClass('match').css({ top: (10+Math.floor(i/2)*60)+'px', left: (3+(i%2)*160)+'px' }).appendTo('body')

		document.addEventListener('touchstart', function(e) { app.touch(e) }, false);
		document.addEventListener('touchmove', function(e) { app.touch(e) }, false);

		document.addEventListener('touchstart', function(e) { app.down(e) }, false);
		document.addEventListener('touchend', function(e) { app.up(e) }, false);

	}
	
};




