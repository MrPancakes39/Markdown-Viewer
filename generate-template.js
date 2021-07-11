const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "app", "md-renderer", "md2html.html");
const outputPath = path.join(__dirname, "template.html");

let outputFile = fs.readFileSync(templatePath, "utf-8");

const styles = outputFile.match(/<link rel="stylesheet" href="\..+">/g);
const scripts = outputFile.match(/<script( id=".+")? src="\..+"><\/script>/g);

String.prototype.replaceText = function(orgText, repText) {
    return this.toString().split(orgText).join(repText);
}

styles.forEach(css => {
    let href = css.match(/href=".+"/g)[0].slice(6, -1);
    let cssPath = path.join(path.dirname(templatePath), href);
    let cssFile = fs.readFileSync(cssPath, "utf-8");
    let cssScript = "<style>\n" + cssFile + "\n</style>";
    outputFile = outputFile.replaceText(css, cssScript);
});

scripts.forEach(js => {
    let src = js.match(/src=".+"/g)[0].slice(5, -1);
    let jsPath = path.join(path.dirname(templatePath), src);
    let jsFile = fs.readFileSync(jsPath, "utf-8");
    let attr = ""
    if (js.includes("id")) {
        let id = js.match(/id=".+" src/g)[0].slice(4, -5);
        attr = ` id="${id}"`;
    }
    let jsScript = `<script${attr}>\n` + jsFile + "\n</script>";
    outputFile = outputFile.replaceText(js, jsScript);
});

fs.writeFileSync(outputPath, outputFile);