const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

const url = require("url");
const temp = require("temp");
const { electron } = require("process");
temp.track();

// Set ENV var.
// process.env.NODE_ENV = "production";

async function createWindow(type, markPath) {
    const win = new BrowserWindow(windowType(type));
    Menu.setApplicationMenu(null);

    markPath = markPath || path.join(__dirname, "app", "md-chooser", "index.md");
    const location = await createFile(markPath);
    win.loadURL(`file://${location}`);

    // sets each BrowserWindow it's open filePath.
    win["currentFile"] = markPath;
    win.on("ready-to-show", () => win.show());

    // Every time the text file changes refresh the page.
    if (type == "markdown") {
        fs.watchFile(markPath, { persistent: true, interval: 100 }, async () => {
            // Get current window and Recreate the File.
            const currentWin = BrowserWindow.getAllWindows().find(win => win["currentFile"] == markPath);
            let filePath = currentWin["currentFile"];
            temp.cleanupSync();
            const location = await createFile(filePath);
            currentWin.loadURL(`file://${location}`);
        });
    }
}

function windowType(type) {
    if (type == "markdown") {
        return {
            width: 1280,
            height: 720,
            webPreferences: {
                preload: path.join(__dirname, "app", "md-renderer", "preload-md.js")
            },
            icon: path.join(__dirname, "app", "assets", "icon.png"),
            show: false
        }
    }
    return {
        width: 600,
        height: 450,
        webPreferences: {
            preload: path.join(__dirname, "app", "md-chooser", "preload-ind.js")
        },
        icon: path.join(__dirname, "app", "assets", "icon.png"),
        resizable: false,
        show: false
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
});

async function createFile(markPath) {
    const templatePath = path.join(__dirname, "template.html");
    const outputPath = temp.openSync({ suffix: ".html" })["path"];

    try {
        const htmlFile = fs.readFileSync(templatePath, "utf-8");
        let markFile = fs.readFileSync(markPath, "utf-8");
        markFile = replaceImages(markPath, markFile);

        const indexFile = htmlFile.split("{{content}}").join(markFile);
        fs.writeFileSync(outputPath, indexFile);

        return url.format(outputPath);
    } catch (err) {
        console.error(err)
    }
}

// replaces relative paths to images with absoulte path to them.
function replaceImages(markPath, markFile) {
    let images;
    images = markFile.match(/!\[.*\]\(\..*\)/g);
    images = (images) ? images : [];
    images.forEach(img => {
        let imgPath = img.match(/\(.*\)/g)[0].slice(1, -1);
        if (imgPath) {
            let newPath = path.join(path.dirname(markPath), imgPath);
            let newImg = img.split(imgPath).join(newPath);
            markFile = markFile.split(img).join(newImg);
        }
    });

    images = markFile.match(/<img( alt=".*")? src="\..+">/g);
    images = (images) ? images : [];
    images.forEach(img => {
        let imgPath = img.match(/src="\..+"/g)[0].slice(5, -1);
        if (imgPath) {
            let newPath = path.join(path.dirname(markPath), imgPath);
            let newImg = img.split(imgPath).join(newPath);
            markFile = markFile.split(img).join(newImg);
        }
    });
    return markFile;
}