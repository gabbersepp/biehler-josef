const gcc = require("github-code-cloud");
const fs = require("fs-extra");
const path = require("path");

var a = path.resolve(path.resolve("temp/cloud"));

async function run() {
    gcc.generateCloud("gabbersepp", 
        process.env.GITHUB_TOKEN, 
        ["js", "asm", "cs", "ts", "java", "cpp"], 
        path.resolve("./temp/cloud"), 0.8, 
        { maxRetry: 10000, backgroundColor: "white", height: 800 }, 
        { headless: true, args: ['--no-sandbox'] })
        .then(() => fs.copyFileSync("temp/cloud/export/img.png", "app/assets/codecloud.png"))
        .catch(e => {
            console.error(e);
            process.exit(-1);
        })
    ;
}

run();