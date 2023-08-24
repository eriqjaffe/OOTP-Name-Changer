const { app, BrowserWindow, dialog, Menu, shell, ipcMain  } = require('electron')

let mainWindow;

const isMac = process.platform === 'darwin'

ipcMain.on('dropped-file', (event, arg) => {
    console.log('Dropped File(s):', arg);
    //event.returnValue = `Received ${arg.length} paths.`; // Synchronous reply
})

const template = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
        ]
    }] : []),
    {
        label: 'File',
        submenu: [
        {
            click: () => mainWindow.webContents.send('open-xml','click'),
            accelerator: isMac ? 'Cmd+O' : 'Control+O',
            label: 'Open...',
        },
        {
            click: () => mainWindow.webContents.send('new-xml','click'),
            accelerator: isMac ? 'Cmd+N' : 'Control+N',
            label: 'New...',
        },
        { type: 'separator' },
        {
            id: 'saveMenu',
            click: () => mainWindow.webContents.send('save-xml','click'),
            accelerator: isMac ? 'Cmd+S' : 'Control+S',
            label: 'Save',
            enabled: true
        },
        { type: 'separator' },
        {
            id: 'closeXMLMenu',
            click: () => mainWindow.webContents.send('close-xml','click'),
            accelerator: isMac ? 'Cmd+L' : 'Control+L',
            label: 'Close File',
            enabled: true
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    {
        label: 'View',
        submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomin', accelerator: 'CommandOrControl+=' },
        { role: 'zoomout', accelerator: 'CommandOrControl+-' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'About',
        submenu: [
        {
            click: () => mainWindow.webContents.send('about','click'),
                label: 'About the OOTP World Editor',
        },
        {
            label: 'About OOTP Baseball',
            click: async () => {    
            await shell.openExternal('https://www.ootpdevelopments.com/out-of-the-park-baseball-home/')
            }
        },
        { type: 'separator' },
        {
            label: 'About Node.js',
            click: async () => {    
            await shell.openExternal('https://nodejs.org/en/about/')
            }
        },
        {
            label: 'About Electron',
            click: async () => {
            await shell.openExternal('https://electronjs.org')
            }
        },
        { type: 'separator' },
        {
            label: 'View project on GitHub',
            click: async () => {
            await shell.openExternal('https://github.com/eriqjaffe/OOTP-Name-Changer')
            }
        },
        /* {
            click: () => mainWindow.webContents.send('update','click'),
            label: 'Check For Updates',
        } */
        ]
    }
]
    
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.whenReady().then(() => {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 400,
        icon: (__dirname + '/images/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
              contextIsolation: false 
        }
      })

    mainWindow.loadURL(`file://${__dirname}/index.html`);
    
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})