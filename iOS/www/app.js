var app = {

	deviceready: function() {

		console.log('hello');

		var app_canvas = document.createElement('canvas');
		
		app_canvas.id = 'app_canvas';
		
		app_canvas.width = window.innerWidth;
		app_canvas.height = window.innerHeight;
		
		var ctx = app_canvas.getContext('2d');
		
		ctx.fillStyle = '#FF0000';

		ctx.fillRect(0,0,app_canvas.width, app_canvas.height);

		document.body.appendChild(app_canvas);
	}
};




