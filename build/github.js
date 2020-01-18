const request = require("request");

function readRepositories() {
    return new Promise(resolve => {
        request({ 
            url: "https://api.github.com/users/gabbersepp/repos",
            headers: {
                "Authorization": "token " + process.env.GITHUB_TOKEN,
                "User-Agent": "node.js"
            }
        }, (err, resp, body) => {
            var repos = JSON.parse(body);
            repos = repos.filter(x => !x.fork && !x.archived && !x.private).map(x => ({
                forksCount: x.forks_count,
                watchersCount: x.watchers_count,
                url: `${x.html_url}/blob/master/README.md`,
                updatedAt: new Date(x.updated_at),
                description: x.description,
                language: x.language,
                name: x.name,
                openIssuesCount: x.open_issues_count,
                id: x.id
            })).sort((a,b) => a.updatedAt > b.updatedAt ? -1 : 1);
            resolve(repos);
        });        
    });
}

//readRepositories()
module.exports = readRepositories;


