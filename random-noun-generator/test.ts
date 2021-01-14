import fetch from "node-fetch";

fetch('https://pixabay.com/api/?key=19185430-0ca8ecbb0c60d76842e868b06&safesearch=true&per_page=3q=crazy%20clown')
    .then(res => { return res.json() })
    .then(res => { console.log(res as string) })
