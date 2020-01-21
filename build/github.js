const request = require("request");

function readRepositories() {
    return new Promise(resolve => {
        request({ 
            url: "https://api.github.com/users/gabbersepp/repos?per_page=100",
            headers: {
                "Authorization": "token " + process.env.GITHUB_TOKEN,
                "User-Agent": "node.js"
            }
        }, async (err, resp, body) => {
            var repos = JSON.parse(body);
            repos = repos.filter(x => !x.fork && !x.archived && !x.private).map(x => ({
                forksCount: x.forks_count,
                watchersCount: x.watchers_count,
                url: x.html_url,
                projectDescriptionUrl: `https://raw.githubusercontent.com/gabbersepp/${x.name}/master/PROJECT.md`,
                updatedAt: new Date(x.updated_at),
                description: x.description,
                language: x.language,
                name: x.name,
                openIssuesCount: x.open_issues_count,
                id: x.id
            })).sort((a,b) => a.updatedAt > b.updatedAt ? -1 : 1);

            for(let i = 0; i < repos.length; i++) {
                const repo = repos[i];
                const projectMd = await getRequest(repo.projectDescriptionUrl);

                if (!projectMd) {
                    repos.splice(i, 1);
                    i--;
                    continue;
                }
                
                console.log(`found PROJECT.md for: '${repo.name}'`)
                repo.description = projectMd;
            }
            resolve(repos);
        });        
    });
}

function getRequest(url) {
    return new Promise(resolve => {
        request(url, function(err, resp, body) {
            if (resp.statusCode === 200) {
                resolve(body);
            } else {
                resolve(null)
            }
        })
    })
}
//readRepositories()
module.exports = readRepositories;


