/// <reference path="../def/underscore.d.ts" />
/// <reference path="../def/state-machine.d.ts" />
/// <reference path="../def/jquery.d.ts" />
/// <reference path="../def/mousetrap.d.ts" />
/// <reference path="../def/toastr.d.ts" />
//? var app;
var App = (function () {
    function App() {
        //?		app = this;
            }
    App.prototype.command = function (action) {
        //		cordova.exec(null, function (e) { alert(e.toString) }, 'App Command', 'command', [action]);
            };
    App.prototype.touch = function (e) {
    };
    App.prototype.down = function (e) {
    };
    App.prototype.up = function (e) {
    };
    App.prototype.InitCanvas = function () {
        $(document.createElement('div')).attr('id', 'app_container').appendTo('body');
        var app_canvas = document.createElement('canvas');
        app_canvas.id = 'app_canvas';
        app_canvas.width = 320//window.innerWidth;
        ;
        app_canvas.height = 480//window.innerHeight;
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
    App.prototype.KanjibotInit = function () {
        this.InitCanvas();
        this.AddSwiper();
    };
    App.prototype.WindowsInit = function () {
        Mousetrap.bind('4', function () {
            console.log('4');
        });
        this.KanjibotInit();
        toastr.success('Windows init OK');
    };
    return App;
})();
if(typeof cordova != 'undefined') {
    document.addEventListener('deviceready', function () {
        return new App().KanjibotInit();
    }, false);
} else {
    window.onload = function () {
        return new App().WindowsInit();
    };
}
//@ sourceMappingURL=app.js.map
