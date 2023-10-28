const { app, BrowserWindow, screen } = require('electron');
const steamService = require('./src/services/steamService');
const hardwareService = require('./src/services/hardwareService');
const hassService = require('./src/services/hassService');

const { settings } = require('./settings-profiler.js');

const path = require('path');

let devToolsEnabled = false;

try {
  require('electron-reloader')(module)
  devToolsEnabled = true;
} catch (_) { }

async function processUpdates(window) {
  hardwareService.updateHardwareInfo(hardwareInfo => window.webContents.send('update-hardware', hardwareInfo));
  steamService.getProfiles(res => window.webContents.send('update-profiles', JSON.stringify(res)));

  const sensors = await hassService.getSensorsAsync();
  window.webContents.send('update-sensors', sensors);
}

function createWindow() {
  const displays = screen.getAllDisplays();
  const targetDisplay = displays.filter(d =>
    d.size.width == settings.window.display_size_x &&
    d.size.height == settings.window.display_size_y)[0];

  const mainWindow = new BrowserWindow({
    x: targetDisplay.bounds.x + settings.window.x,
    y: targetDisplay.bounds.y + settings.window.y,
    width: settings.window.width,
    height: settings.window.height,
    alwaysOnTop: true,
    skipTaskbar: true,
    movable: false,
    minimizable: false,
    maximizable: false,
    frame: false,
    fullscreenable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      devTools: devToolsEnabled,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const updateInterval = 4_000;
  setInterval(async () => await processUpdates(mainWindow), updateInterval);
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('gpu-info-update', function() {
  const wind = BrowserWindow.getAllWindows()[0];
  wind.moveTop();
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})