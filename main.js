const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const MusicDateStore = require('./MusicDateStore')

const musicDateStore = new MusicDateStore({'name': 'Music Date'})

class AppWindow extends BrowserWindow {
  constructor(customConfig, fileLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    }
    const config = {...basicConfig, ...customConfig}
    super(config);
    this.loadFile(fileLocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}


app.on('ready', () => {
  const mainWindow = new AppWindow({}, './renderer/index.html')
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.send('getTracks',  musicDateStore.getTracks())
  })
  ipcMain.on('add-music-window', () => {
    const addWindow = new AppWindow({width: 500, height: 400, parent: mainWindow}, './renderer/add.html')
  })

  ipcMain.on('select-music-window', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{name: 'Music', extensions: ['mp3']}]
    }).then(res => {
      event.sender.send('selected-file', res.filePaths)
    })
  })

  ipcMain.on('add-tracks', (event, args) => {
    const tracks = musicDateStore.addTracks(args).getTracks()
    mainWindow.send('getTracks', tracks)
  })

  ipcMain.on('delete-track', ((event, args) => {
    const tracks = musicDateStore.deleteTrack(args).getTracks()
    mainWindow.send('getTracks', tracks)
  }))
})

