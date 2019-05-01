const { app, BrowserWindow, webFrame, Menu, dialog } = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const http = require('http')

const homedir = require('os').homedir()
const patchDir = `${homedir}/harbour`

const ecstatic = require('ecstatic')({
  root: patchDir,
  showDir: true,
  autoIndex: true,
  cache: 0,
  cors: true
});
http.createServer(ecstatic).listen(51051);

console.log('Listening on :51051')
console.log('Patch Dir:', patchDir)

let isShown = true

app.on('ready', () => {
  app.win = new BrowserWindow({
    width: 405,
    height: 430,
    minWidth: 405,
    minHeight: 430,
    webPreferences: { zoomFactor: 1.0 },
    backgroundColor: '#fff',
    frame: false,
    autoHideMenuBar: true,
    icon: __dirname + '/icon.ico'
  })

  app.win.loadURL(`file://${__dirname}/sources/index.html`)
  app.inspect()

  app.win.on('closed', () => {
    win = null
    app.quit()
  })

  app.win.on('hide', function () {
    isShown = false
  })

  app.win.on('show', function () {
    isShown = true
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    if (app.win === null) {
      createWindow()
    } else {
      app.win.show()
    }
  })
})

app.inspect = function () {
  app.win.toggleDevTools()
}

app.toggleFullscreen = function () {
  app.win.setFullScreen(!app.win.isFullScreen())
}

app.toggleVisible = function () {
  if (process.platform == 'win32') {
    if (!app.win.isMinimized()) { app.win.minimize() } else { app.win.restore() }
  } else {
    if (isShown && !app.win.isFullScreen()) { app.win.hide() } else { app.win.show() }
  }
}

app.injectMenu = function (menu) {
  try {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  } catch (err) {
    console.warn('Cannot inject menu.')
  }
}
