const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720
    })
    createFile();
    win.loadFile("index.html");
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
        app.quit();
    }
})

function createFile() {
    templatePath = path.join(__dirname, "md2html.html");
    outputPath = path.join(__dirname, "index.html");

    markPath = "/home/salman/Desktop/Stuff-Folder/CTF-Writeups/2020/VulconCTF/misc/All I know was zip/The Solution/journey.md";
    // markPath = "/home/salman/Desktop/Stuff-Folder/TryHackMe Stuff/intro-to-linux.md";
    try {
        const htmlFile = fs.readFileSync(templatePath, "utf-8");
        const markFile = fs.readFileSync(markPath, "utf-8");

        const indexFile = htmlFile.split("{{content}}").join(markFile);
        fs.writeFileSync(outputPath, indexFile);
    } catch (err) {
        console.error(err)
    }
}