const request = require("request");
const fs = require("fs");

function download(twitterUrl, id) {
    const ext = twitterUrl.split("\.").reverse()[0];
   
    return new Promise(resolve => {
        const path = `/data/images/${id}.${ext}`;
        const stream = fs.createWriteStream(`.${path}`);
        request(twitterUrl).pipe(stream);
        stream.on("finish", () => resolve(path));
    });
}

module.exports = download;

/*

async function downloadAll() {
    const results = JSON.parse(fs.readFileSync("./data/tweets.json").toString())

    for(var i = 0; i < results.length; i++) {
        try {
            const x = results[i];
            if (x.mediaUrl) {
                const path = await download(x.mediaUrl, x.id);
                x.twitterMediaUrl = x.mediaUrl;
                x.mediaUrl = "/data/twitter/" + path;
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    fs.writeFileSync("./data/tweets.json", JSON.stringify(results));
}

downloadAll();*/