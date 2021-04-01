const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

const url = require("url");
const temp = require("temp");
temp.track();

async function createWindow(props, markPath) {
    const win = new BrowserWindow(props)
    Menu.setApplicationMenu(null);
    location = await createFile(markPath);
    win.loadURL(`file://${location}`);
}

app.whenReady().then(() => {
    createWindow({
        width: 600,
        height: 450,
        webPreferences: {
            preload: path.join(__dirname, "preload-ind.js")
        }
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        temp.cleanupSync();
        app.quit();
    }
})

ipcMain.on("open-file", (event, arg) => {
    // Choose file.
    let path = dialog.showOpenDialogSync({
        properties: ["openFile"],
        filters: [{ name: "Markdown Files", extensions: ["md"] }]
    })[0];
    const preloadMD = path.join(__dirname, "preload-md.js");

    createWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: preloadMD
        }
    }, path);
})

async function createFile(markPath) {
    let templatePath = path.join(__dirname, "md2html-template.html");
    let outputPath = temp.openSync({ suffix: ".html" })["path"];

    markPath = markPath || path.join(__dirname, "index.md");
    try {
        const htmlFile = fs.readFileSync(templatePath, "utf-8");
        const markFile = fs.readFileSync(markPath, "utf-8");

        const indexFile = htmlFile.split("{{content}}").join(markFile);
        fs.writeFileSync(outputPath, indexFile);

        return url.format(outputPath);
    } catch (err) {
        console.error(err)
    }
}