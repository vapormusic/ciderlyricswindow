const path = require("path")
const { ipcMain, BrowserWindow } = require("electron")


module.exports = class LyricsWindowPlugin {
    win;
    constructor(env) {
        // Define plugin enviornment within the class
        this.env = env
    }

    // Called when the backend is ready
    onReady(win) {
        // console.log("=== Backend Plugin Loaded ===")

        // // Setting up an ipcMain channel for front end to communicate with
        // ipcMain.handle("plugin.frontendComm", (event, message) => {
        //     // Print out what the front end says
        //     console.debug(`Frontend says: ${message}`)
        //     // Get the main window and send a messsage to it
        //     this.env.utils.getWindow().webContents.send("plugin.backendComm", "Hello from the backend!")
        // })
    }

    // Called when the renderer is ready (app.init())
    onRendererReady(win) {
        console.debug("Renderer Ready Called")
        // Load the frontend plugin
        this.env.utils.loadJSFrontend(path.join(this.env.dir, "index.frontend.js"))

        // Add listener to initialize lyrics window
        ipcMain.on("LyricsWindowOpen", (event, args) => {
            // Create a new lyrics window
            console.log('Lyrics Window Opening')
            if (this.win == null) {
                this.win = new BrowserWindow({
                    width: 400, height: 300, show: false,
                    frame: false,
                    minWidth: 350,
                    minHeight: 230,
                    x: 0,
                    y: 0,
                    alwaysOnTop : true, // change it to false to make it normal
                    webPreferences: {
                        nodeIntegration: true, contextIsolation: false
                    }
                });
                this.win.loadFile(path.join(this.env.dir, "index.html"));
                this.win.show();
                this.win.on('closed', () => {
                    this.win = null
                });
                this.win.webContents.on('did-finish-load', () => {
                    if (this.win) {
                        this.win.webContents.send('truelyrics', data);
                    }

                })

            }
        })

        ipcMain.on('wsapi-updatePlaybackState', (_event, arg) => {
            if (this.win) {
                this.win.webContents.send('playbackInfoLW', arg);
            }
        })

        ipcMain.on('LWLyricsUpdate', (_event, arg) => {
            if (this.win) {
                this.win.webContents.send('LyricsUpdate', arg);
            }
        })

        ipcMain.on('LWRichLyricsUpdate', (_event, arg) => {
            if (this.win) {
                this.win.webContents.send('RichLyricsUpdate', arg);
            }
        })
        ipcMain.on('LWBGUpdate', (_event, arg) => {
            if (this.win) {
                this.win.webContents.send('LWBGUpdate', arg);
            }
        })
        ipcMain.handle('LW_GetLyrics', async (_event, arg) => {
            if (this.win) {
                return await this.env.utils.getWindow().webContents.executeJavaScript(`app?.lyrics ?? []`)

            }
        })

        ipcMain.handle('LW_GetBG', async (_event, arg) => {
            if (this.win) {
                return await this.env.utils.getWindow().webContents.executeJavaScript(`app?.currentArtUrl ?? ""`)

            }
        })
        
        ipcMain.handle('LW_SeekTo', async (_event, arg) => {
            if (this.win) {
                return await this.env.utils.getWindow().webContents.executeJavaScript(`app.seekTo(${arg})`)

            }
        })
        ipcMain.handle('LW_Maximize', async (_event, arg) => {
            if (this.win) {
                if (this.win.isMaximized()) {
                    this.win.unmaximize();
                } else {
                    this.win.maximize();
                }

            }
        })
        ipcMain.handle('LW_Minimize', async (_event, arg) => {
            if (this.win) {
                this.win.minimize();

            }
        })

        ipcMain.handle('LW_SetTop', (_event, arg) => {
            if (this.win) {
                if (arg === ""){
                    if(this.win.isAlwaysOnTop()){
                    this.win.setAlwaysOnTop(false);
                        return false;
                    } else {
                        this.win.setAlwaysOnTop(true);
                        return true;
                    }
                } else {
                    console.log('onTop',arg)
                    this.win.setAlwaysOnTop(arg === 'true');
                    return (arg === 'true');
                }

            } else {return false}
        })

        ipcMain.handle('LW_OnTop', async (_event, arg) => {
            if (this.win) {
                return this.win.isAlwaysOnTop();

            } else {return false}
        })

        ipcMain.handle('LW_SongControl', async (_event, arg) => {
            if (this.win) {
                switch (arg){
                    case 'prev':
                        this.env.utils.playback.previous();
                        break;
                    case 'next':
                        this.env.utils.playback.next();
                        break; 
                    case 'pause':    
                    case 'play':
                        this.env.utils.playback.playPause();
                        break;         
                }

            }
        })
    }

    // onNowPlayingItemDidChange(attributes){
    //    if (this.win) {
    //        this.win.webContents.send('LyricsUpdate', attributes);
    //    }
    // }
    

}
