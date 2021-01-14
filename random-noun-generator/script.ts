var nounList: Array<string> = [];
const nouns: Array<Noun> = [];
const imgSearchURL = new URL(
	"https://pixabay.com/api/?\
key=19185430-0ca8ecbb0c60d76842e868b06\
&safesearch=true\
&per_page=3"
);

class Noun {
	private readonly word: string;
	private img?: URL;
	private element: HTMLElement;

	constructor() {
		let i = Math.floor(Math.random() * nounList.length);
		this.word = nounList[i];
		nounList.splice(i, 1);

		this.element = $("<tr>")
			.append([
				$("<td>").addClass("noun").text(this.word),
				$("<td>").addClass("img")
			])
			.appendTo($("#noun-table"))[0];
	}

	async fetchImage() {
		imgSearchURL.searchParams.set("q", this.word);
		fetch(imgSearchURL.href)
			.then((wrappedResp) => {
				if (!wrappedResp.ok)
					throw new Error(`Fetch request failed!
                    URL:${wrappedResp.url}
                    Status: ${wrappedResp.statusText}
                    Response: ${wrappedResp.text()}`);

				const contentType = wrappedResp.headers.get("content-type");
				if (contentType == "application/json") {
					return wrappedResp.json();
				} else {
					throw new Error(`Fetch request failed! Unknown type of response content.
                    URL:${wrappedResp.url}
                    Status: ${wrappedResp.statusText}
                    Content Type: ${contentType}`);
				}
			})
			.then((json) => {
				if (json.hits.length == 0) return;
				this.img = new URL(json.hits[0].webformatURL);
				$(this.element)
					.children(".img")
					.append(
						$("<img>")
							.attr("src", this.img.toString())
							.attr("alt", `Image of ${this.word}`)
					);
			});
	}
}

(async () => {
	let res = await fetch("./noun-list.txt");
	let text = await res.text();
	nounList = text.split("\n");
})();

$(function () {
	$("#submit-btn").on("click", function () {
		$("#noun-table").empty();
		var i = parseInt($("#noun-count").val() as string);
		for (i; i > 0; i--) {
			let noun = new Noun();
			nouns.push(noun);
			noun.fetchImage();
		}
	});
});
