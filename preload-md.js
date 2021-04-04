window.addEventListener("DOMContentLoaded", () => {
    // Open links in the OS's default external browser.
    document.querySelectorAll("#preview a").forEach(node => {
        node.addEventListener("click", event => {
            if (event.target) {
                event.preventDefault();
                if (node != event.target) {
                    // Then it isn't the <a> tag it is it's childNode.
                    let nodeList = event.path;
                    for (let i = 0; i <= nodeList.length; i++) {
                        // Search the path up the tree till you find the first <a> tag.
                        if (nodeList[i].tagName === "A") {
                            // use that <a> tag to get link.
                            let link = nodeList[i].href;
                            require("electron").shell.openExternal(link);
                            return;
                        }
                    }
                } else {
                    let link = event.target.href;
                    require("electron").shell.openExternal(link);
                }
            }
        });
    });
});