var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var on_device = typeof cordova != 'undefined';
//? var app;
var CGPoint = (function (_super) {
    __extends(CGPoint, _super);
    function CGPoint(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        _super.call(this, x, y);
    }
    return CGPoint;
})(THREE.Vector2);
var CGPointZero = new CGPoint();
var CGSize = (function () {
    function CGSize(width, height) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        this.width = width;
        this.height = height;
    }
    return CGSize;
})();
var CGRect = (function () {
    function CGRect(origin, size) {
        if (typeof origin === "undefined") { origin = CGPointZero; }
        if (typeof size === "undefined") { size = new CGSize(); }
        this.origin = origin;
        this.size = size;
    }
    return CGRect;
})();
var BlockBoardElement = (function () {
    function BlockBoardElement(i, id) {
        this.id = id;
        this.alpha = 0.55;
        var row = Math.floor(i / 5);
        var col = i % 5;
        this.src_frame = new CGRect(new CGPoint(4 + i * (96 + 8), 4), new CGSize(96, 96));
        this.dst_frame = new CGRect(new CGPoint(24 + col * (48 + 8), 460 - (2 - row) * (48 + 8)), new CGSize(48, 48));
    }
    BlockBoardElement.prototype.render = function (ctx, src_image) {
        var previous_alpha = ctx.globalAlpha;
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(src_image, this.src_frame.origin.x, this.src_frame.origin.y, this.src_frame.size.width, this.src_frame.size.height, this.dst_frame.origin.x, this.dst_frame.origin.y, this.dst_frame.size.width, this.dst_frame.size.height);
        ctx.globalAlpha = previous_alpha;
    };
    return BlockBoardElement;
})();
var BlockBoard = (function () {
    function BlockBoard(ctx, ui_image) {
        this.ctx = ctx;
        this.ui_image = ui_image;
        this.blocks = [];
        var block_ids = "0123456789";
        for(var i = 0; i < 10; i++) {
            this.blocks.push(new BlockBoardElement(i, block_ids.charAt(i)));
        }
    }
    BlockBoard.prototype.render = function () {
        for(var i = 0; i < 10; i++) {
            this.blocks[i].render(this.ctx, this.ui_image);
        }
    };
    return BlockBoard;
})();
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
        app_canvas.width = on_device ? window.innerWidth : 320;
        app_canvas.height = on_device ? window.innerHeight : 460;
        this.ctx = app_canvas.getContext('2d');
        this.ctx.fillStyle = '#DEDEC0';
        this.ctx.fillRect(0, 0, app_canvas.width, app_canvas.height);
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
    App.prototype.CreateUI = function (ui_image) {
        this.blockboard = new BlockBoard(this.ctx, ui_image);
        this.blockboard.render();
    };
    App.prototype.KanjibotInit = function () {
        var _this = this;
        this.InitCanvas();
        this.AddSwiper();
        var ui_image = new Image();
        this.ctx.globalAlpha = 0.6;
        ui_image.onload = function () {
            return _this.CreateUI(ui_image);
        };
        ui_image.onerror = function () {
            return toastr.error('not loaded!');
        };
        ui_image.src = 'img/ui_elements@2x.png';
    };
    App.prototype.WindowsInit = function () {
        Mousetrap.bind('4', function () {
            return console.log('4');
        });
        this.KanjibotInit();
    };
    return App;
})();
if(on_device) {
    document.addEventListener('deviceready', function () {
        return new App().KanjibotInit();
    }, false);
} else {
    window.onload = function () {
        return new App().WindowsInit();
    };
}
//@ sourceMappingURL=app.js.map
