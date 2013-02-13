/// <reference path="../def/jquery.d.ts" />
/// <reference path="../def/mousetrap.d.ts" />
/// <reference path="../def/toastr.d.ts" />
var App = (function () {
		   function App() { }
		   App.prototype.command = function (action) {
		   //		cordova.exec(null, function (e) { alert(e.toString) }, 'App Command', 'command', [action]);
		   };
		   App.prototype.touch = function (e) {
		   if(this.box.style.zIndex == '0') {
		   $(this.box).css({
						   zIndex: 1,
						   backgroundColor: '#FF00FF'
						   }).appendTo('body');
		   }
		   if(typeof e === 'undefined') {
		   return;
		   }
		   var touch = e.touches[0];
		   this.box.style.left = touch.pageX + 'px';
		   this.box.style.top = touch.pageY + 'px';
		   if(touch.pageY < 200) {
		   this.command({
						action: 'keyboard',
						value: 'off'
						});
		   }
		   };
		   App.prototype.down = function (e) {
		   $('.match').animate({
							   marginTop: '100px'
							   });
		   };
		   App.prototype.up = function (e) {
		   $('.match').animate({
							   marginTop: '0px'
							   });
		   };
		   App.prototype.InitCanvas = function () {
		   $(document.createElement('div')).attr('id', 'app_container').appendTo('body');
		   var app_canvas = document.createElement('canvas');
		   app_canvas.id = 'app_canvas';
		   app_canvas.width = window.innerWidth;
		   ;
		   app_canvas.height = window.innerHeight;
		   ;
		   var ctx = app_canvas.getContext('2d');
		   ctx.fillStyle = '#DEDEC0';
		   ctx.fillRect(0, 0, app_canvas.width, app_canvas.height);
		   $(app_canvas).appendTo('#app_container');
		   };
		   App.prototype.AddSwiper = function () {
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
		   };
		   App.prototype.deviceready = function () {
		   console.log('app device ready');
		   app.InitCanvas();
		   app.AddSwiper();
		   toastr.success('iOS init OK');
		   };
		   App.prototype.WindowsInit = function () {
		   Mousetrap.bind('4', function () {
						  console.log('4');
						  });
		   this.deviceready();
		   toastr.success('Windows init OK');
		   };
		   return App;
		   })();

var app = new App();

if (typeof cordova != 'undefined')
document.addEventListener('deviceready', app.deviceready, false);
else{
    window.onload = function () {
        return new App().WindowsInit();
    };
}
//@ sourceMappingURL=app.js.map
