window.addEventListener("DOMContentLoaded", () => {
    let btn = document.querySelector("#open-btn");
    btn.addEventListener("click", () => {
        const { ipcRenderer } = require("electron");
        ipcRenderer.sendSync("open-file");
    });
});