const request = require("request");
const fs = require("fs-extra");
let ghToken = process.env.GITHUB_TOKEN;

function getRequest(url, opts) {
    return new Promise((resolve, reject) => {
        request(url, opts, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body));
            }
        })
    });
}

function doFetch(gql){
  const headers = {
    'Content-type': 'application/json',
    'Authorization': 'token ' + ghToken,
    "User-Agent": "node.js"
  }

  return getRequest("https://api.github.com/graphql", {
    method: "POST",
    headers: headers,
    body:  JSON.stringify(gql)
  });
}


async function getContributions(login) {
  const gql = {query: `
  {
    user(login: "${login}") {
      repositoriesContributedTo(includeUserRepositories: false, first: 10, privacy: PUBLIC) {
        edges {
          node {
            id
            nameWithOwner
            shortDescriptionHTML(limit: 120)
            stargazers {
              totalCount
            }
            url
            openGraphImageUrl
          }
        }
      }
    }
  }
  `}

  contib = await doFetch(gql)

  return contib.data.user.repositoriesContributedTo.edges
}

async function getContributionDetails(login, repo) {
  const gql = {query:`
    {
      search(query: "author:${login} repo:${repo}", first: 100, type: ISSUE) {
        edges {
          node {
            ... on PullRequest {
              id
              title
              url
              state
            }
            ... on Issue {
              id
              title
              url
              state
            }
          }
        }
      }
    }
  `}

  detail = await doFetch(gql)

  return detail.data.search.edges
}

async function getAllContributions() {
  let contib;

    try {
      contib = await getContributions("gabbersepp")
    } catch (e) {
      throw e;
    }

    const details = [];

      if (contib.length > 0) {
        for(let i = 0, len = contib.length; i < len; i++) {
            const repoDetails = await getContributionDetails("gabbersepp", contib[i].node.nameWithOwner);
            details.push({ details: repoDetails, repo: contib[i].node });
        }
      }

      fs.writeFileSync("./assets/contrib.json", JSON.stringify(details));
}

getAllContributions();