const makeUrl = filename => `https://isolatedsigns.s3.amazonaws.com/${encodeURI(filename)}`;
const getUrlFromNode = node => node.url.split("/")[3];
const buildUrl = node => makeUrl(getUrlFromNode(node));
const buildVideosSearchUrl = query => `https://cklvhhyl66.execute-api.us-east-1.amazonaws.com/?word=${query}`
const getVideosFromServer = query => fetch(buildVideosSearchUrl(query)).then(response => response.json())

const getQueryString = () => document.getElementById("inputSearch").value;
const mapValues = nodes => nodes.map(node => ({label: node.text, imageUrl: buildUrl(node)}));
const getListElement = () => document.getElementById("products-list");
const buildVideoNode = ({ label, imageUrl}) =>
`
    <div class="product-item" category="adjectives">
        <video height="205px" width="205px" controls>
            <source src="${imageUrl}" type="video/mp4">
        </video>
        <a href="#">${label}</a>
    </div>
`
const appendVideo = node => {
    getListElement().insertAdjacentHTML('beforeend', buildVideoNode(node))
}

document.getElementById("SentencesSearchButton").addEventListener("click", () => {
    const queryString = getQueryString();
    getListElement().innerHTML = "";
    getVideosFromServer(queryString).then(mapValues).then(nodes => nodes.map(appendVideo))
})
