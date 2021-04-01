const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

const url = require("url");
const temp = require("temp");
temp.track();

async function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720
    })
    location = await createFile();
    win.loadURL(`file://${location}`);
}

app.whenReady().then(() => {
    createWindow();

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

async function createFile() {
    let templatePath = path.join(__dirname, "md2html-template.html");
    let outputPath = temp.openSync({ suffix: ".html" })["path"];
    // outputPath = path.join(__dirname, "index.html");

    markPath = "/home/salman/Desktop/Stuff-Folder/CTF-Writeups/2020/VulconCTF/misc/All I know was zip/The Solution/journey.md";
    // markPath = "/home/salman/Desktop/Stuff-Folder/TryHackMe Stuff/intro-to-linux.md";
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