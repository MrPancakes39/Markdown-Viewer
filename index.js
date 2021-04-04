const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

const url = require("url");
const temp = require("temp");
temp.track();

// Set ENV var.
process.env.NODE_ENV = "production";

async function createWindow(type, markPath) {
    const win = new BrowserWindow(windowType(type));
    Menu.setApplicationMenu(null);
    location = await createFile(markPath);
    win.loadURL(`file://${location}`);
}

function windowType(type) {
    if (type == "markdown") {
        return {
            width: 1280,
            height: 720,
            webPreferences: {
                preload: path.join(__dirname, "preload-md.js")
            },
            icon: path.join(__dirname, "assets", "icon.png")
        }
    }
    return {
        width: 600,
        height: 450,
        webPreferences: {
            preload: path.join(__dirname, "preload-ind.js")
        },
        icon: path.join(__dirname, "assets", "icon.png"),
        resizable: false
    }
}

app.whenReady().then(() => {
    // If passed on a markdown file then open it, else open the default window
    if (process.argv.length >= 2 && process.argv[1] !== ".") {
        let filePath = process.argv[1];
        createWindow("markdown", filePath);
    } else {
        createWindow("default");
    }

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow("default");
        }
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        temp.cleanupSync();
        app.quit();
    }
})

ipcMain.on("open-file", (event) => {
    // Choose file.
    let filePath = dialog.showOpenDialogSync({
        properties: ["openFile"],
        filters: [{ name: "Markdown Files", extensions: ["md"] }]
    });
    filePath = (filePath) ? filePath[0] : null;

    if (filePath) {
        createWindow("markdown", filePath);
    }
})

async function createFile(markPath) {
    // let templatePath = path.join(__dirname, "md2html-template.html");
    // let outputPath = temp.openSync({ suffix: ".html" })["path"];
    let templatePath = path.join(__dirname, "md2html.html");
    let outputPath = path.join(__dirname, "index.html");

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