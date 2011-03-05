(function (context, name) {
    var dui = context[name] = window.dui || {};

    function Radio (node, ctrls) {
        if (!(this instanceof Radio)) {
            return new Radio(node, ctrls);
        }

        this.node = node;
        this.track = new Audio();
        this.ctrls = ctrls; 
    }

    Radio.prototype = {
        constructor: Radio,
        init: function (songslist) { 
            var self = this;

            // save songslist
            this.songslist = songslist.concat();

            this.procPlaylist(songslist);
            this.track.controls = typeof this.ctrls === 'boolean' ? this.ctrls : false;

            // show native player
            if (this.track.controls) {
                this.node.appendChild(this.track);
            }

            this.track.addEventListener('ended', function () {
                self.ended(); 
            });

            this.track.addEventListener('error', function () {
                self.playNext();
            });
        },
        event: function (args) {
            if (arguments.length === 2) {
                this.track.addEventListener(args[0], args[1]);
            } else {
                for (var i in args) {
                    if (args.hasOwnProperty(i)) {
                        this.track.addEventListener(i, args[i]);
                    }
                }
            }
        },
        initSong: function () { 
            this.track.src = this.currSong.url;
        },
        procPlaylist: function (playlist) {
            if (playlist instanceof Array) {
                this.playlist = playlist.concat();
                this.playNext();
            } else {
                this.track.src = playlist;
            }
        }, 
        fomatTime: function (t) {
            if (isNaN(t)) {
                return '00:00';
            } else {
                var min = Math.floor(t / 60),
                    sec = t % 60; 
                if (min < 10) { min = '0' + min; }
                if (sec < 10) { sec = '0' + sec; }
                return min + ':' + sec;
            }   
        },
        ended: function () {
            this.playNext();
        },
        playNext: function () {
            if (this.playlist.length) {
                this.currSong = this.playlist.shift();
                this.initSong();
                this.play();
            }
        },
        play: function () {
            this.track.play();
        },
        pause: function () {
            this.track.pause();
        }
    };

    dui.Radio = Radio;
})(this, 'dui');
