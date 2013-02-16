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
    CGPoint.Zero = new CGPoint(0, 0);
    CGPoint.Make = function Make(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        return new CGPoint(x, y);
    };
    return CGPoint;
})(THREE.Vector2);
var CGSize = (function () {
    function CGSize(width, height) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        this.width = width;
        this.height = height;
    }
    CGSize.Make = function Make(width, height) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        return new CGSize(width, height);
    };
    return CGSize;
})();
var CGRect = (function () {
    function CGRect(origin, size) {
        if (typeof origin === "undefined") { origin = CGPoint.Zero; }
        if (typeof size === "undefined") { size = new CGSize(); }
        this.origin = origin;
        this.size = size;
    }
    CGRect.Make = function Make(x, y, width, height) {
        return new CGRect(CGPoint.Make(x, y), CGSize.Make(width, height));
    };
    CGRect.prototype.inset = function (dx, dy) {
        return CGRect.Make(this.origin.x + dx, this.origin.y + dy, this.size.width - dx * 2, this.size.height - dy * 2);
    };
    CGRect.prototype.offset = function (dx, dy) {
        return CGRect.Make(this.origin.x + dx, this.origin.y + dy, this.size.width, this.size.height);
    };
    CGRect.prototype.fill = function (ctx) {
        ctx.fillRect(this.origin.x, this.origin.y, this.size.width, this.size.height);
    };
    CGRect.prototype.setPath = function (ctx, radius) {
        if (typeof radius === "undefined") { radius = CGSize.Make(0, 0); }
        ctx.beginPath();
        ctx.moveTo(this.origin.x + radius.width, this.origin.y);
        ctx.lineTo(this.origin.x + this.size.width - radius.width, this.origin.y);
        ctx.quadraticCurveTo(this.origin.x + this.size.width, this.origin.y, this.origin.x + this.size.width, this.origin.y + radius.height);
        ctx.lineTo(this.origin.x + this.size.width, this.origin.y + this.size.height - radius.height);
        ctx.quadraticCurveTo(this.origin.x + this.size.width, this.origin.y + this.size.height, this.origin.x + this.size.width - radius.height, this.origin.y + this.size.height);
        ctx.lineTo(this.origin.x + radius.width, this.origin.y + this.size.height);
        ctx.quadraticCurveTo(this.origin.x, this.origin.y + this.size.height, this.origin.x, this.origin.y + this.size.height - radius.height);
        ctx.lineTo(this.origin.x, this.origin.y + radius.height);
        ctx.quadraticCurveTo(this.origin.x, this.origin.y, this.origin.x + radius.width, this.origin.y);
        ctx.closePath();
    };
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
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(src_image, this.src_frame.origin.x, this.src_frame.origin.y, this.src_frame.size.width, this.src_frame.size.height, this.dst_frame.origin.x, this.dst_frame.origin.y, this.dst_frame.size.width, this.dst_frame.size.height);
    };
    return BlockBoardElement;
})();
var BlockBoard = (function () {
    function BlockBoard(ctx, ui_image) {
        this.ctx = ctx;
        this.ui_image = ui_image;
        this.blocks = [];
        var block_ids = '0123456789';
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
var ControlBar = (function () {
    function ControlBar(ctx, ui_image) {
        this.ctx = ctx;
        this.ui_image = ui_image;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.globalAlpha = 0.25;
        CGRect.Make(6, 460 - 56 * 2 - 12 - 48, 320 - 12, 48).fill(this.ctx);
    }
    return ControlBar;
})();
var MainScreen = (function () {
    function MainScreen(ctx) {
        this.ctx = ctx;
        this.ctx.save();
        this.ctx.globalAlpha = 0.05;
        this.ctx.fillStyle = 'black';
        var frame = CGRect.Make(4, 4, 320 - 8, 460 - 56 * 2 - 12 - 48 - 4 - 6);
        frame.setPath(ctx, CGSize.Make(20, 20));
        this.ctx.fill();
        this.ctx.globalAlpha = 0.1;
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = 'black';
        frame = frame.inset(2, 2);
        frame.setPath(ctx, CGSize.Make(20, 20));
        this.ctx.stroke();
        this.ctx.restore();
    }
    return MainScreen;
})();
var App = (function () {
    function App() {
        //?		app = this;
            }
    App.prototype.command = function (action) {
        		cordova.exec(null, function (e) {  }, 'App Command', 'command', [action]);
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
        app_canvas.width = on_device ? (window.innerWidth * devicePixelRatio) : 320;
        app_canvas.height = on_device ? (window.innerHeight * devicePixelRatio) : 460;
        app_canvas.style.width = on_device ? window.innerWidth + 'px' : '320px';
        app_canvas.style.height = on_device ? window.innerHeight + 'px' : '460px';
        this.ctx = app_canvas.getContext('2d');
        this.ctx.fillStyle = '#DEDEC0';
        this.ctx.fillRect(0, 0, app_canvas.width, app_canvas.height);
        if(typeof devicePixelRatio != 'undefined') {
            this.ctx.scale(devicePixelRatio, devicePixelRatio);
        }
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
        this.controlbar = new ControlBar(this.ctx, ui_image);
        this.mainscreen = new MainScreen(this.ctx);
    };
    App.prototype.KanjibotInit = function () {
        var _this = this;
        this.InitCanvas();
        this.AddSwiper();
        var ui_image = new Image();
        ui_image.onload = function () {
            return _this.CreateUI(ui_image);
        };
        ui_image.onerror = function () {
            return toastr.error('not loaded!');
        };
        ui_image.src = 'img/ui_elements@2x.png';
		   
		if (on_device)
		   app.command('jello');
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
