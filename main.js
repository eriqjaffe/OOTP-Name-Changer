const { app, BrowserWindow, dialog, Menu, shell, ipcMain  } = require('electron')
const fs = require('fs')
const path = require('path')
const XMLWriter = require('xml-writer');
const XMLFormatter = require('xml-formatter')
const { translate } = require('bing-translate-api')

let mainWindow;

const isMac = process.platform === 'darwin'

const options = {
    properties: ['openFile'],
    filters: [
        { name: 'Name Files', extensions: ['txt', 'csv'] }
    ]
}

ipcMain.on('dropped-file', (event, arg) => {
    console.log('Dropped File(s):', arg);
    //event.returnValue = `Received ${arg.length} paths.`; // Synchronous reply
})

ipcMain.on('name-button-click', (event,arg) => {
    dialog.showOpenDialog(null, options).then(result => {
        const reply = {}
        if (!result.canceled) {
            try {
                fs.readFile(result.filePaths[0], 'utf8', function(err, data) {
                    //console.log(path.basename(result.filePaths[0]))
                    reply.status = "success"
                    reply.path = result.filePaths[0]
                    reply.fileName = path.basename(result.filePaths[0])
                    reply.element = arg[0]
                    reply.targetInput = arg[1]
                    event.sender.send('file-opened', JSON.stringify(reply))
                })
            } catch (err) {
                reply.status = "error"
                reply.message = err
                event.sender.send('file-opened', JSON.stringify(reply))
            }
        } else {
            reply.status = "cancelled"
            reply.message = "User cancelled"
            event.sender.send('file-opened', JSON.stringify(reply))
        }
    })
})

ipcMain.on('convert-files', (event, arg) => {
    let json = JSON.parse(arg)
    let count = 1;
    let data, en, kr, jp, cn = null;
    let repl_string = Math.random().toString(36).slice(2)
    try {

        prepareXML()

        async function prepareXML() {
            let fnArray = fs.readFileSync(json.firstNames).toString().split("\n");
            let lnArray = fs.readFileSync(json.lastNames).toString().split("\n");
            let nnArray = fs.readFileSync(json.nickNames).toString().split("\n");
                
            let total = fnArray.length + lnArray.length + nnArray.length

            let xw = new XMLWriter()
            xw.startDocument('1.0', 'UTF-8')
            xw.startElement("NAME_FILE")
              .writeAttribute("fileversion","OOTP Developments 2023-05-05 13:12:37")
    
                // PROCESS FIRST NAMES       
                if (fnArray.length > 0) {
                    xw.startElement("FIRST_NAMES")
                    for (let [i, fn] of fnArray.entries()) {
                        data = fn.split(",")
                        event.sender.send('update-progress', { "index": count, "total": total, "name": "First Name: \""+data[0]+"\""})
                        kr = data[0]
                        jp = data[0]
                        cn = data[0]
                        if (json.translate == true) {
                            en = await translate(data[0], null, 'ko')
                            kr = en.translation

                            en = await translate(data[0], null, 'ja')
                            jp = en.translation

                            en = await translate(data[0], null, 'zh-Hans')
                            cn = en.translation
                        } 
                        xw.startElement("N").writeAttribute("nid",count).text(repl_string)
                            xw.startElement("EN")
                            .text(data[0].replace(/[\n\r]+/g, ''))
                            .endElement()
                            xw.startElement("ES")
                            .text(data[0])
                            .endElement()
                            xw.startElement("KR")
                            .text(kr)
                            .endElement()
                            xw.startElement("JP")
                            .text(jp)
                            .endElement()
                            xw.startElement("CN")
                            .text(cn)
                            .endElement()
                            xw.startElement("NL")
                                xw.startElement("L")
                                .writeAttribute("lid",data[1].replace(/[\n\r]+/g, ''))
                                .writeAttribute("dist",data[2].replace(/[\n\r]+/g, ''))
                                .endElement()
                            xw.endElement()
                        xw.endElement()
                        count++            
                    }
                    xw.endElement()
                }
    
                // PROCESS LAST NAMES
                if (lnArray.length > 0) {
                    xw.startElement("LAST_NAMES")
                    for (let [i, ln] of lnArray.entries()) {
                        data = ln.split(",")
                        event.sender.send('update-progress', { "index": count, "total": total, "name": "Last Name: \""+data[0]+"\""})
                        kr = data[0]
                        jp = data[0]
                        cn = data[0]
                        if (json.translate == true) {
                            en = await translate(data[0], null, 'ko')
                            kr = en.translation

                            en = await translate(data[0], null, 'ja')
                            jp = en.translation

                            en = await translate(data[0], null, 'zh-Hans')
                            cn = en.translation
                        } 
                        xw.startElement("N").writeAttribute("nid",count).text(repl_string)
                            xw.startElement("EN")
                            .text(data[0].replace(/[\n\r]+/g, ''))
                            .endElement()
                            xw.startElement("ES")
                            .text(data[0])
                            .endElement()
                            xw.startElement("KR")
                            .text(kr)
                            .endElement()
                            xw.startElement("JP")
                            .text(jp)
                            .endElement()
                            xw.startElement("CN")
                            .text(cn)
                            .endElement()
                            xw.startElement("NL")
                                xw.startElement("L")
                                .writeAttribute("lid",data[1].replace(/[\n\r]+/g, ''))
                                .writeAttribute("dist",data[2].replace(/[\n\r]+/g, ''))
                                .endElement()
                            xw.endElement()
                        xw.endElement()
                        count++
                    }
                    xw.endElement()
                }
    
                // PROCESS NICK NAMES
                if (nnArray.length > 0) {
                    xw.startElement("NICK_NAMES")
                    for (let [i, nn] of nnArray.entries()) {
                        data = nn.split(",")
                        event.sender.send('update-progress', { "index": count, "total": total, "name": "Nick Name: \""+data[0]+"\""})
                        kr = data[0]
                        jp = data[0]
                        cn = data[0]
                        if (json.translate == true) {
                            en = await translate(data[0], null, 'ko')
                            kr = en.translation

                            en = await translate(data[0], null, 'ja')
                            jp = en.translation

                            en = await translate(data[0], null, 'zh-Hans')
                            cn = en.translation
                        } 
                        xw.startElement("N").writeAttribute("nid",count).text(repl_string)
                            xw.startElement("EN")
                            .text(data[0].replace(/[\n\r]+/g, ''))
                            .endElement()
                            xw.startElement("ES")
                            .text(data[0])
                            .endElement()
                            xw.startElement("KR")
                            .text(kr)
                            .endElement()
                            xw.startElement("JP")
                            .text(jp)
                            .endElement()
                            xw.startElement("CN")
                            .text(cn)
                            .endElement()
                            if (data[1] != undefined) {
                                xw.startElement("NL")
                                    xw.startElement("L")
                                    .writeAttribute("lid",data[1].replace(/[\n\r]+/g, ''))
                                    .writeAttribute("dist",data[2].replace(/[\n\r]+/g, ''))
                                    .endElement()
                                xw.endElement()
                            }
                            
                        xw.endElement()
                        count++
                    }
                    xw.endElement()
                }
    
            xw.endElement()
    
            let formattedXML = XMLFormatter(xw.toString(), { collapseContent: true }).replaceAll(repl_string,"")
    
            console.log(formattedXML)
        }
        
    } catch (err) {

    }
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