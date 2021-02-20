const request = require("request");
const fs = require("fs");

async function getAll() {
    let articles = [];
    let currentResult = { more: true };
    let page = 0;

    while(currentResult.more) {
        currentResult = await getPage(page++);
        articles = [...articles, ...currentResult.data]; 
    }

    fs.writeFileSync("app/data/devto.csv", JSON.stringify(articles));
    return articles;
}

async function getPage(page) {
    const articles = await getRequest(`https://dev.to/api/articles/me/published?page=${page}`);
    
    return {
        data: articles,
        more: page.length === 30
    }
}


function getRequest(url) {
    return new Promise((resolve, reject) => {
        request(url, {headers: {"api-key": process.env.DEVTO_TOKEN}}, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body));
            }
        })
    });
}

getAll();