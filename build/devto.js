const request = require("request");

async function getAll() {
    let articles = [];
    let currentResult = { more: true };
    let page = 0;

    while(currentResult.more) {
        currentResult = await getPage(page++);
        articles = [...articles, ...currentResult.data]; 
    }

    return articles;
}

async function getPage(page) {
    const articles = await getRequest(`https://dev.to/api/articles?username=gabbersepp&page=${page}`);
    
    return {
        data: articles,
        more: page.length === 30
    }
}


function getRequest(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body));
            }
        })
    });
}

//getAll();

module.exports = {
    getAll
}