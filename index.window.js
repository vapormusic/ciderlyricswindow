Vue.component('lyrics-view', {
    template: '#lyrics-view',
    props: ["time", "lyrics", "richlyrics", "translation", "onindex", "yoffset"],
    data: function () {
        return {
            app: this.$root,
            airplayOn : false
        }
    },
    watch: {
        time: function () {
            if (this.$refs.lyricsview) {
                let currentLine = this.$refs.lyricsview.querySelector(`.lyric-line.active`)
                if (currentLine && currentLine.getElementsByClassName('lyricWaiting').length > 0) {
                    let duration = currentLine.getAttribute("end") - currentLine.getAttribute("start");
                    let u = (this.time - currentLine.getAttribute("start")) / duration;
                    if (u < 0.25 && !currentLine.classList.contains('mode1')) {
                        try {
                            currentLine.classList.add('mode1');
                            currentLine.classList.remove('mode3');
                            currentLine.classList.remove('mode2');
                        } catch (e) {
                        }
                        currentLine.getElementsByClassName('WaitingDot1')[0].style.animation = `dotOpacity ${0.25 * duration}s cubic-bezier(0.42, 0, 0.58, 1) forwards`;
                        currentLine.getElementsByClassName('WaitingDot2')[0].style.animation = ``;
                        currentLine.getElementsByClassName('WaitingDot3')[0].style.animation = ``;
                        currentLine.getElementsByClassName('WaitingDot2')[0].style.opacity = 0.25;
                        currentLine.getElementsByClassName('WaitingDot3')[0].style.opacity = 0.25;

                    } else if (u >= 0.25 && u < 0.5 && !currentLine.classList.contains('mode2')) {
                        try {
                            currentLine.classList.add('mode2');
                            currentLine.classList.remove('mode1');
                            currentLine.classList.remove('mode3');
                        } catch (e) {
                        }
                        currentLine.getElementsByClassName('WaitingDot2')[0].style.animation = `dotOpacity ${0.25 * duration}s cubic-bezier(0.42, 0, 0.58, 1) forwards`;
                        currentLine.getElementsByClassName('WaitingDot1')[0].style.animation = ``;
                        currentLine.getElementsByClassName('WaitingDot3')[0].style.animation = ``;
                        currentLine.getElementsByClassName('WaitingDot1')[0].style.opacity = 1;
                        currentLine.getElementsByClassName('WaitingDot3')[0].style.opacity = 0.25;
                    } else if (u >= 0.5 && u < 0.75 && !currentLine.classList.contains('mode3')) {
                        try {
                            currentLine.classList.add('mode3');
                            currentLine.classList.remove('mode1');
                            currentLine.classList.remove('mode2');
                        } catch (e) {
                        }
                        currentLine.getElementsByClassName('WaitingDot3')[0].style.animation = `dotOpacity ${0.25 * duration}s cubic-bezier(0.42, 0, 0.58, 1) forwards`;
                        currentLine.getElementsByClassName('WaitingDot1')[0].style.animation = ``;
                        currentLine.getElementsByClassName('WaitingDot2')[0].style.animation = ``;
                        currentLine.getElementsByClassName('WaitingDot1')[0].style.opacity = 1;
                        currentLine.getElementsByClassName('WaitingDot2')[0].style.opacity = 1;
                    } else if (u >= 0.75 && currentLine.classList.contains('mode3')) {
                        try {
                            currentLine.classList.remove('mode1');
                            currentLine.classList.remove('mode2');
                            currentLine.classList.remove('mode3');
                        } catch (e) {
                        }
                        currentLine.getElementsByClassName('WaitingDot1')[0].style.animation = ``;
                        currentLine.getElementsByClassName('WaitingDot2')[0].style.animation = ``;
                        currentLine.getElementsByClassName('WaitingDot1')[0].style.opacity = 1;
                        currentLine.getElementsByClassName('WaitingDot2')[0].style.opacity = 1;

                    }

                }

            }
            this.getActiveLyric();
        }

    },
    methods: {
        seekTo(startTime) {
            if (startTime != 9999999) this.app.seekTo(startTime);
        },
        getActiveLyric() {
            const delayfix = this.airplayOn ? -2.5 : 0.1
            const prevLine = app.currentLyricsLine;
            for (var i = 0; i < this.lyrics.length; i++) {
                if (this.time + delayfix >= this.lyrics[i].startTime && this.time + delayfix <= this.lyrics[i].endTime) {
                    if (app.currentLyricsLine != i) {
                        app.currentLyricsLine = i;
                        if (this.$refs.lyricsview.querySelector(`.lyric-line[line-index="${i}"]`)) {
                            if (this.$refs.lyricsview.querySelector(`.lyric-line[line-index="${prevLine}"]`)) { this.$refs.lyricsview.querySelector(`.lyric-line[line-index="${prevLine}"]`).classList.remove("active"); }
                            this.$refs.lyricsview.querySelector(`.lyric-line[line-index="${i}"]`).classList.add("active")
                            if (this.checkIfScrollIsStatic) {
                                let lyricElement = this.$refs.lyricsview.querySelector(`.lyric-line[line-index="${i}"]`)
                                this.$refs.lyricsview.querySelector(`.lyric-line[line-index="${i}"]`).scrollIntoView({
                                    behavior: "smooth",
                                    block: 'center',inline: 'center'
                                })
                                // let parent = lyricElement.parentElement
                                // let parentRect = parent.getBoundingClientRect()
                                // let lyricElementRect = lyricElement.getBoundingClientRect()
                                // let parentScrollTop = parent.scrollTop
                                // let parentScrollLeft = parent.scrollLeft
                                // let parentScrollTopDiff = parentScrollTop - parentRect.top
                                // let parentScrollLeftDiff = parentScrollLeft - parentRect.left
                                // let lyricElementScrollTop = lyricElementRect.top + parentScrollTopDiff
                                // let lyricElementScrollLeft = lyricElementRect.left + parentScrollLeftDiff
                                // let scrollTopDiff = lyricElementScrollTop - parentScrollTop
                                // let scrollLeftDiff = lyricElementScrollLeft - parentScrollLeft
                                // let scrollTop = parent.scrollTop + scrollTopDiff
                                // let scrollLeft = parent.scrollLeft + scrollLeftDiff
                                // parent.scrollTo({
                                //     top: scrollTop - (this.yoffset ?? 128),
                                //     left: scrollLeft,
                                //     behavior: 'smooth'
                                // })

                            }
                        }
                    } else if (app.currentLyricsLine == 0) {
                        if (this.$refs.lyricsview.querySelector(`.lyric-line[line-index="0"]`) && !this.$refs.lyricsview.querySelector(`.lyric-line[line-index="0"]`).classList.contains("active"))
                            this.$refs.lyricsview.querySelector(`.lyric-line[line-index="0"]`).classList.add("active");
                    }
                    break;
                }
            }
            try {
                try { this.$refs.lyricsview.querySelector(`.lyric-line[line-index="${prevLine}"]`).childNodes.classList.remove("verse-active"); } catch (e) { }
                for (child of this.$refs.lyricsview.querySelector(`.lyric-line[line-index="${app.currentLyricsLine}"]`).querySelectorAll(".verse")) {
                    if (this.time + 0.1 >= child.getAttribute("lyricstart") * 1 + child.getAttribute("versestart") * 1) {
                        child.classList.add("verse-active");
                    } else { child.classList.remove("verse-active"); }
                }

            } catch (e) { }

        },
        getActiveVerse(timeStart, timeEnd, verseTime) {
            let relativeTime = this.time - timeStart
            console.log(this.time, timeEnd, timeStart, relativeTime >= verseTime && relativeTime <= timeEnd - timeStart)
            return relativeTime >= verseTime && relativeTime <= timeEnd - timeStart
        },
        getVerseLine(index) {
            if (this.richlyrics[index] != null && this.richlyrics[index].l != null) {
                return this.richlyrics[index].l
            }
            else return []
        },
        checkIfScrollIsStatic: setInterval(() => {
            try {
                if (position === this.$refs.lyricsview.scrollTop) {
                    clearInterval(checkIfScrollIsStatic)
                    // do something
                }
                position = this.$refs.lyricsview.scrollTop
            } catch (e) {
            }
        }, 50)
        ,
    }
});
const { ipcRenderer } = require('electron');

const app = new Vue({
    el: "#window",
    data: {
        lyrics: [],
        currentLyricsLine: 0,
        lyriccurrenttime: 0,
        richlyrics: [],
        maximized: false,
        background : '',
        playing: false,
        hideControls: true,
        lyricduration: 0,
        onTop: false,
    },
    watch: {
        background: function(){
            if (this.background != null && this.background != "") {

                this.$refs.controls.setAttribute('style', `background:url('${app.background}')` + " !important; background-repeat: no-repeat !important; background-size: cover !important;")
                this.$refs.main.setAttribute('style', `background:url('${app.background}')` + " !important; background-repeat: no-repeat !important; background-size: cover !important;")
            }
            else { this.$refs.main.setAttribute('style', ''); this.$refs.controls.setAttribute('style', '') }
        }
    },
    methods: {
        seekTo(startTime, isSeek) {
            ipcRenderer.invoke("LW_SeekTo", startTime, isSeek)
        },
        mode(val){
            switch(val){
                case "minimize":
                    ipcRenderer.invoke("LW_Minimize", "")
                    break;
                case "maximize":
                    ipcRenderer.invoke("LW_Maximize", "")
                    break;
                case "close":
                    window.close();
                    break;
            }

        },
        songNavigate(val){
            ipcRenderer.invoke("LW_SongControl", val)
        },
        timeFormat(s){
            return(s-(s%=60))/60+(9<s?':':':0')+s 
        },
        async setOnTop(val){
            this.onTop = await ipcRenderer.invoke("LW_SetTop", (val ?? ""))
            console.log('onTop', this.onTop)
            window.localStorage.setItem('onTop', this.onTop);
        }


    },
    async mounted() {
        ipcRenderer.on("playbackInfoLW", (event, message) => {
            this.lyriccurrenttime = (message.durationInMillis - message.remainingTime) / 1000;
            this.lyricduration = Math.round(message.durationInMillis / 1000);
            this.playing = message.status ?? false;
        })
        ipcRenderer.on("LyricsUpdate", (event, message) => {
            this.lyrics = message
        })
        ipcRenderer.on("RichLyricsUpdate", (event, message) => {
            this.richlyrics = message
        })
        ipcRenderer.on("LWBGUpdate", (event, message) => {
            if (message && message.length > 0) {
            this.background = message}
        })
        
        ipcRenderer.on("AirPlayStatus", (event, message) => {
            this.airplayOn = message
        })  
        
        this.lyrics = await ipcRenderer.invoke("LW_GetLyrics",'')
        this.background = await ipcRenderer.invoke("LW_GetBG",'')
        this.onTop = window.localStorage.getItem('onTop') ?? true
        console.log(this.onTop)
        this.setOnTop(this.onTop)
    }
})
