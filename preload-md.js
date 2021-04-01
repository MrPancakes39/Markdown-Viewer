window.addEventListener("DOMContentLoaded", () => {
    // Open links in the OS's default external browser.
    document.querySelectorAll("#preview a").forEach(node => {
        node.addEventListener("click", event => {
            if (event.target) {
                event.preventDefault();
                let link = event.target.href;
                require("electron").shell.openExternal(link);
            }
        });
    });
});