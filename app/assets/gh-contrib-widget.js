
async function renderDetails(data, holder) {
    for (i = 0, len = data.length; i < len; i++){
        holder.innerHTML += `
          <div class="pr">
            <span class="state ${data[i].node.state.toLowerCase()}">
              <i class="fas fa-code-branch"></i>
              ${data[i].node.state}
            </span>
            <a href="${data[i].node.url}">${data[i].node.title}</a>
          </div>
        `
      }
}

 function renderContributionRow(data, holder) {
    let row = document.createElement('div')
        row.setAttribute('id', `row-${data.repo.id}`)
        row.setAttribute('class', 'row')
        row.innerHTML += `
            <div class="head">
              <img class="pic" src="${data.repo.openGraphImageUrl}" />
              <a href="${data.repo.url}">${data.repo.nameWithOwner}</a>
              <span class="stars">
                <i class="far fa-star"></i>${data.repo.stargazers.totalCount}
              </span>
              <div class="short">${data.repo.shortDescriptionHTML}</div>
            </div>
        `
    holder.appendChild(row)
    let detail = document.createElement('div')
        detail.setAttribute('class', `detail`)

    row.appendChild(detail)

    renderDetails(
      data.details,
      detail
    )
}


window.drawContributions = async function (id) {

    let details = await fetch("/assets/contrib.json");
    details = await details.json();
    details.reverse();

      let wrapper = document.getElementById(id);
          while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.firstChild);
          }
          wrapper.setAttribute('class', 'gh-contrib-widget')

      let contib = details

      if (contib.length > 0) {
        for(let i = 0, len = contib.length; i < len; i++) {
          renderContributionRow(contib[i], wrapper);
        }
      }
      copy = document.createElement('a')
      copy.setAttribute('href', "http://alexandergor.com/gh-contrib-widget")
      copy.setAttribute('style', "width: inherit; position: absolute; font-size:10px; margin:2px -5px; color:black; text-align:right;")
      copy.text = "widget by Alexander Gor"

      wrapper.appendChild(copy)
  }
