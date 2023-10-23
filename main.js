const { app, BrowserWindow, dialog, Menu, shell, ipcMain  } = require('electron')
const fs = require('fs')
const path = require('path')
const XMLWriter = require('xml-writer');
const XMLFormatter = require('xml-formatter')
const { translate } = require('bing-translate-api')
const xml2js = require('xml2js');
const archiver = require('archiver');
const os = require('os')
const increment = require('add-filename-increment');

let mainWindow;

const isMac = process.platform === 'darwin'

const options = {
    properties: ['openFile'],
    filters: [
        { name: 'Name Files', extensions: ['txt', 'csv'] }
    ]
}

const xmlOptions = {
    properties: ['openFile'],
    filters: [
        { name: 'XML Files', extensions: ['xml'] }
    ]
}

const saveOptions = {
    defaultPath: ('names.xml'),
    filters: [
        { name: 'XML Files', extensions: ['xml'] }
    ]
}

const saveZipOptions = {
    defaultPath: ('names.zip'),
    filters: [
        { name: 'ZIP Files', extensions: ['zip']}
    ]
}

const tempDir = os.tmpdir()

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

ipcMain.on('xml-button-click', (event,arg) => {
    dialog.showOpenDialog(null, xmlOptions).then(result => {
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
    let fnArray = []
    let lnArray = []
    let nnArray = []
    const result = {}

    try {

        prepareXML()

        async function prepareXML() {

            try {
                fnArray = fs.readFileSync(json.firstNames).toString().split("\n");
            } catch (err) { 
                fnArray = [] 
            }

            try {
                lnArray = fs.readFileSync(json.lastNames).toString().split("\n");
            } catch (err) { 
                lnArray = [] 
            }

            try {
                nnArray = fs.readFileSync(json.nickNames).toString().split("\n");
            } catch (err) { 
                nnArray = []
            }
                
            let total = fnArray.length + lnArray.length + nnArray.length

            if (total > 0) {
                let xw = new XMLWriter()
                xw.startDocument('1.0', 'UTF-8')
                xw.startElement("NAME_FILE")
                .writeAttribute("fileversion","OOTP Developments 2023-05-05 13:12:37")
        
                    // PROCESS FIRST NAMES       
                    if (fnArray.length > 0) {
                        xw.startElement("FIRST_NAMES")
                        for (let [i, fn] of fnArray.entries()) {
                            data = fn.split(",")
                            event.sender.send('update-progress', { "index": count, "total": total, "name": "Importing First Name: \""+data[0]+"\""})
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
                            event.sender.send('update-progress', { "index": count, "total": total, "name": "Importing Last Name: \""+data[0]+"\""})
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
                            event.sender.send('update-progress', { "index": count, "total": total, "name": "Importing Nick Name: \""+data[0]+"\""})
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
        
                dialog.showSaveDialog(null, saveOptions).then((result) => { 
                    if (!result.canceled) {
                        fs.writeFile(result.filePath, formattedXML, (err) => {
                            if (err) {
                                result.status = "error"
                                result.message = err
                                try {
                                    event.sender.send('save_xml_result', result)
                                } catch (err) {
                                    console.log(err)
                                }
                                
                            } else {
                                result.status = "success"
                                result.message = null
                                try {
                                    event.sender.send('save_xml_result', result)
                                } catch (err) {
                                    console.log(err)
                                }
                            }
                        });
                    } else {
                        result.status = "success"
                        result.message = null
                        try {
                            event.sender.send('save_xml_result', result)
                        } catch (err) {
                            console.log(err)
                        }
                        
                    }
                })
            } else {
                result.status = "error"
                result.message = "There were no names found"
                event.sender.send('save_xml_result', result)
            }

            
        }
        
    } catch (err) {
        result.status = "error"
        result.message = err.message
        event.sender.send('save_xml_result', result)
    }
})

ipcMain.on('revert-files', (event, arg) => {
    let fnArray = []
    let lnArray = []
    let nnArray = []
    let json = {}

    try {
        const output = fs.createWriteStream(tempDir + '/names_temp.zip');

        const archive = archiver('zip', {
            lib: { level: 9 } // Sets the compression level.
        });
            
        archive.on('error', function(err) {
            throw err;
        });

        archive.pipe(output)

        output.on('close', function() {
            var data = fs.readFileSync(tempDir + '/names_temp.zip');
            dialog.showSaveDialog(null, saveZipOptions).then((result) => { 
            if (!result.canceled) {
                //store.set("downloadPath", path.dirname(result.filePath))
                fs.writeFile(result.filePath, data, function(err) {
                if (err) {
                    fs.unlink(tempDir + '/names_temp.zip', (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    })
                    console.log(err)
                    json.result = "error"
                    json.errno = err.errno
                    event.sender.send('save-zip-response', arg)
                    //res.json({result: "error", errno: err.errno})
                } else {
                    fs.unlink(tempDir + '/names_temp.zip', (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    })
                    json.result = "success"
                    event.sender.send('revert_xml_result', json)
                };
                })
            } else {
                fs.unlink(tempDir + '/names_temp.zip', (err) => {
                if (err) {
                    console.log(err)
                    return
                }
                })
                json.result = "success"
                event.sender.send('revert_xml_result', json)
            }
            })
        });

        let parser = new xml2js.Parser();
        let data = fs.readFileSync(arg)
        parser.parseString(data, function(err, result) {
            if (result.NAME_FILE.FIRST_NAMES != undefined) {
                for (item of result.NAME_FILE.FIRST_NAMES[0].N) {
                    let fName = item.EN[0]
                    let lid = (item.NL != undefined) ? item.NL[0].L[0].$.lid : null
                    let dist = (item.NL != undefined) ? item.NL[0].L[0].$.dist : null
                    if (lid == null) {
                        fnArray.push(fName)
                    } else {
                        fnArray.push(fName+","+lid+","+dist)
                    }
                }
            }
            if (fnArray.length > 0) {
                archive.append(fnArray.join('\n'), {name: "first_names.txt"})
            }
            if (result.NAME_FILE.LAST_NAMES != undefined) {
                for (item of result.NAME_FILE.LAST_NAMES[0].N) {
                    let fName = item.EN[0]
                    let lid = (item.NL != undefined) ? item.NL[0].L[0].$.lid : null
                    let dist = (item.NL != undefined) ? item.NL[0].L[0].$.dist : null
                    if (lid == null) {
                        lnArray.push(fName)
                    } else {
                        lnArray.push(fName+","+lid+","+dist)
                    }
                }
            }
            if (lnArray.length > 0) {
                archive.append(lnArray.join('\n'), {name: "last_names.txt"})
            }
            if (result.NAME_FILE.NICK_NAMES != undefined) {
                for (item of result.NAME_FILE.NICK_NAMES[0].N) {
                    let fName = item.EN[0]
                    let lid = (item.NL != undefined) ? item.NL[0].L[0].$.lid : null
                    let dist = (item.NL != undefined) ? item.NL[0].L[0].$.dist : null
                    if (lid == null) {
                        nnArray.push(fName)
                    } else {
                        nnArray.push(fName+","+lid+","+dist)
                    }
                }
            }
            if (nnArray.length > 0) {
                archive.append(nnArray.join('\n'), {name: "nick_names.txt"})
            }
            archive.finalize()
        })
    } catch (err) {
        json.status = "error"
        json.message = err.message
        event.sender.send('revert_xml_result', json)
        return false;
    }
})

ipcMain.on('merge-files', (event, arg) => {
    let json = JSON.parse(arg)
    let fnArray = []
    let lnArray = []
    let nnArray = []
    const result = {}
    let fileCount = 1
    let count = 1
    let repl_string = Math.random().toString(36).slice(2)

    for (file of json) {
        try {
            event.sender.send('update-progress', { "index": fileCount, "total": json.length, "name": "Reading \""+path.basename(file)+"\""})
            let parser = new xml2js.Parser();
            let data = fs.readFileSync(file)
            parser.parseString(data, function(err, result) {
                for (item of result.NAME_FILE.FIRST_NAMES[0].N) {
                    fnArray.push(item)
                }
                for (item of result.NAME_FILE.LAST_NAMES[0].N) {
                    lnArray.push(item)
                }
                for (item of result.NAME_FILE.NICK_NAMES[0].N) {
                    nnArray.push(item)
                }
            })
            fileCount++
        } catch (err) {
            result.status = "error"
            result.message = err.message
            event.sender.send('save_xml_result', result)
            return false;
        }
    }

    let total = fnArray.length + lnArray.length + nnArray.length

    if (total > 0) {
        let xw = new XMLWriter()
            xw.startDocument('1.0', 'UTF-8')
            xw.startElement("NAME_FILE")
            .writeAttribute("fileversion","OOTP Developments 2023-05-05 13:12:37")
    
            // PROCESS FIRST NAMES       
            if (fnArray.length > 0) {
                xw.startElement("FIRST_NAMES")
                for (n of fnArray) {
                    event.sender.send('update-progress', { "index": count, "total": total, "name": "Merging First Name \""+n.EN[0]+"\""})
                    xw.startElement("N").writeAttribute("nid",count).text(repl_string)
                        xw.startElement("EN")
                        .text(n.EN[0])
                        .endElement()
                        xw.startElement("ES")
                        .text(n.ES[0])
                        .endElement()
                        xw.startElement("KR")
                        .text(n.KR[0])
                        .endElement()
                        xw.startElement("JP")
                        .text(n.JP[0])
                        .endElement()
                        xw.startElement("CN")
                        .text(n.CN[0])
                        .endElement()
                        if (n.NL != undefined) {
                            xw.startElement("NL")
                            for (l of n.NL) {
                                for (obj of l.L) {
                                    xw.startElement("L")
                                    .writeAttribute("lid",obj.$.lid)
                                    .writeAttribute("dist",obj.$.dist)
                                    .endElement() 
                                }
                            }
                            xw.endElement()
                        }
                    xw.endElement()
                    count++
                }
                xw.endElement()
            }

            // PROCESS LAST NAMES
            if (lnArray.length > 0) {
                xw.startElement("LAST_NAMES")
                for (n of lnArray) {
                    event.sender.send('update-progress', { "index": count, "total": total, "name": "Merging Last Name \""+n.EN[0]+"\""})
                    xw.startElement("N").writeAttribute("nid",count).text(repl_string)
                        xw.startElement("EN")
                        .text(n.EN[0])
                        .endElement()
                        xw.startElement("ES")
                        .text(n.ES[0])
                        .endElement()
                        xw.startElement("KR")
                        .text(n.KR[0])
                        .endElement()
                        xw.startElement("JP")
                        .text(n.JP[0])
                        .endElement()
                        xw.startElement("CN")
                        .text(n.CN[0])
                        .endElement()
                        if (n.NL != undefined) {
                            xw.startElement("NL")
                            for (l of n.NL) {
                                for (obj of l.L) {
                                    xw.startElement("L")
                                    .writeAttribute("lid",obj.$.lid)
                                    .writeAttribute("dist",obj.$.dist)
                                    .endElement() 
                                }
                            }
                            xw.endElement()
                        }
                    xw.endElement()
                    count++
                }
                xw.endElement()
            }

            // PROCESS NICK NAMES
            if (nnArray.length > 0) {
                xw.startElement("NICK_NAMES")
                for (n of nnArray) {
                    event.sender.send('update-progress', { "index": count, "total": total, "name": "Merging Nick Name \""+n.EN[0]+"\""})
                    xw.startElement("N").writeAttribute("nid",count).text(repl_string)
                        xw.startElement("EN")
                        .text(n.EN[0])
                        .endElement()
                        xw.startElement("ES")
                        .text(n.ES[0])
                        .endElement()
                        xw.startElement("KR")
                        .text(n.KR[0])
                        .endElement()
                        xw.startElement("JP")
                        .text(n.JP[0])
                        .endElement()
                        xw.startElement("CN")
                        .text(n.CN[0])
                        .endElement()
                        if (n.NL != undefined) {
                            xw.startElement("NL")
                            for (l of n.NL) {
                                for (obj of l.L) {
                                    xw.startElement("L")
                                    .writeAttribute("lid",obj.$.lid)
                                    .writeAttribute("dist",obj.$.dist)
                                    .endElement() 
                                }
                            }
                            xw.endElement()
                        }
                    xw.endElement()
                    count++
                }
                xw.endElement()
            }

        xw.endElement()

        let formattedXML = XMLFormatter(xw.toString(), { collapseContent: true }).replaceAll(repl_string,"")

        dialog.showSaveDialog(null, saveOptions).then((result) => { 
            if (!result.canceled) {
                fs.writeFile(result.filePath, formattedXML, (err) => {
                    if (err) {
                        result.status = "error"
                        result.message = err
                        try {
                            event.sender.send('save_xml_result', result)
                        } catch (err) {
                            console.log(err)
                        }
                        
                    } else {
                        result.status = "success"
                        result.message = null
                        try {
                            event.sender.send('save_xml_result', result)
                        } catch (err) {
                            console.log(err)
                        }
                    }
                });
            } else {
                result.status = "success"
                result.message = null
                try {
                    event.sender.send('save_xml_result', result)
                } catch (err) {
                    console.log(err)
                }
                
            }
        })
    } else {
        result.status = "error"
        result.message = "There were no names found"
        event.sender.send('save_xml_result', result)
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
        /* {
            click: () => mainWindow.webContents.send('open-first-names','click'),
            accelerator: isMac ? 'Cmd+Shift+F' : 'Control+Shift+F',
            label: 'Add First Names',
        },
        {
            click: () => mainWindow.webContents.send('open-last-names','click'),
            accelerator: isMac ? 'Cmd+Shift+L' : 'Control+Shift+L',
            label: 'Add Last Names',
        },
        {
            click: () => mainWindow.webContents.send('open-nick-names','click'),
            accelerator: isMac ? 'Cmd+Shift+N' : 'Control+Shift+N',
            label: 'Add Nick Names',
        },
        { type: 'separator' },
        {
            id: 'saveMenu',
            click: () => mainWindow.webContents.send('convert-files','click'),
            accelerator: isMac ? 'Cmd+Shift+C' : 'Control+Shift+C',
            label: 'Convert Files',
            enabled: true
        },
        { type: 'separator' }, */
        isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    {
        label: 'Action',
        submenu: [
        {
            click: () => mainWindow.webContents.send('convert-view','click'),
            accelerator: isMac ? 'Cmd+Shift+1' : 'Control+Shift+1',
            label: 'Convert Legacy Files To XML',
        },
        {
            click: () => mainWindow.webContents.send('backwards-view','click'),
            accelerator: isMac ? 'Cmd+Shift+2' : 'Control+Shift+2',
            label: 'Convert XML to Legacy Format',
        },
        {
            click: () => mainWindow.webContents.send('merge-view','click'),
            accelerator: isMac ? 'Cmd+Shift+3' : 'Control+Shift+3',
            label: 'Merge XML Files',
        }
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
        /* {
            click: () => mainWindow.webContents.send('about','click'),
                label: 'About the OOTP World Editor',
        }, */
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
        height: 380,
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