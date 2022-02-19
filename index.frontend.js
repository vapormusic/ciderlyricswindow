class LyricsWindowFrontend {
    constructor() {
        // Setting up a ipcRenderer channel for back end to communicate with
        // ipcRenderer.on("plugin.backendComm", (event, message) => {
        //     // Alert popup
        //     bootbox.alert(`Backend says: ${message}`)
        // })
        app.$watch('lyrics', function (newVal, oldVal) {
            LyricsWindowPlugin.updateLyrics(newVal)
        }, {
            deep: true
          })

        app.$watch('richlyrics', function (newVal, oldVal) {
            LyricsWindowPlugin.updateRichLyrics(newVal)
        })

        app.$watch('currentArtUrl', function (newVal, oldVal) {
            LyricsWindowPlugin.updateBGArtwork(newVal)
        })

        const menuEntry = new CiderFrontAPI.Objects.MenuEntry()
        menuEntry.name = "Toggle Lyrics Window"
        menuEntry.onClick = ()=>{
            this.openLyricsWindow()
        }
        CiderFrontAPI.AddMenuEntry(menuEntry)
        
    }

    openLyricsWindow() {
        ipcRenderer.send("LyricsWindowOpen", "")
    }

    updateLyrics(val) {
        ipcRenderer.send("LWLyricsUpdate", val)
    }

    updateRichLyrics(val) {
        ipcRenderer.send("LWRichLyricsUpdate", val)
    }

    updateBGArtwork(val) {
        ipcRenderer.send("LWBGUpdate", val)
    }
}


const LyricsWindowPlugin = new LyricsWindowFrontend()
