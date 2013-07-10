// Update every X secs
//var FPSMode = 'interval'
//var FPSFreq = 1;

// Update every X frames
var FPSMode = 'frame'
var FPSFreq = -1;

/*
* Frames Per Second Functions
*/
Crafty.extend({
    display: null,
    fps: {
        interval: 1000,
        fps: 0,
        frame: 0,
        time: 0,
        // Calculate every frame
        enterFrame: function () {
            var frame = Crafty.frame()
            if (frame % this.interval === 0) {
                curTime = new Date().getTime() / 1000
                this.fps = ((frame - this.frame)/(curTime - this.time)).toFixed(2)
                this.frame     = frame
                this.time     = curTime
                this.display.text(this.fps);
            }
        },
        // Calculate at set interval
        start: function () {
            this.frame     = Crafty.frame()
            this.time     = new Date().getTime() / 1000
            this.display.text(this.fps);
            setTimeout('Crafty.fps.end();', this.interval);
        },
        end: function() {
            curTime = new Date().getTime() / 1000
            this.fps = ((Crafty.frame() - this.frame)/(curTime - this.time)).toFixed(2)
            console.log(this.fps);
            this.start()
        }
        ,setDisplay: function(){
            console.log("dsf");
            this.display = Crafty.e('2D,DOM,Text').attr({x: 0, y: 0}).css({'color': 'blue'}).text("init");
            console.log(this.display);
        }
    }
})
/*
* Frames Per Second Component
*/
Crafty.c('FPS', {
    init: function () {
        Crafty.fps.setDisplay();
        this.requires('2D, DOM, Text').bind('EnterFrame', function() {
            this.text(Crafty.fps.fps);
        });
    },
    FPS: function (mode, secs) {
        if (mode == 'interval') {
            Crafty.fps.interval = typeof secs == 'undefined' ? 1000 : secs * 1000;
            Crafty.fps.start()
        } else {
            Crafty.fps.interval = (typeof secs == 'undefined' || secs < 1) ? 10 : secs;
            Crafty.bind('EnterFrame', function () { Crafty.fps.enterFrame() })
        }
        return this;
    }
})