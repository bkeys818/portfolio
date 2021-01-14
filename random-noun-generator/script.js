"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var nounList = [];
var nouns = [];
var imgSearchURL = new URL("https://pixabay.com/api/?\
key=19185430-0ca8ecbb0c60d76842e868b06\
&safesearch=true\
&per_page=3");
var Noun = /** @class */ (function () {
    function Noun() {
        var i = Math.floor(Math.random() * nounList.length);
        this.word = nounList[i];
        nounList.splice(i, 1);
        this.element = $("<tr>")
            .append([
            $("<td>").addClass("noun").text(this.word),
            $("<td>").addClass("img")
        ])
            .appendTo($("#noun-table"))[0];
    }
    Noun.prototype.fetchImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                imgSearchURL.searchParams.set("q", this.word);
                fetch(imgSearchURL.href)
                    .then(function (wrappedResp) {
                    if (!wrappedResp.ok)
                        throw new Error("Fetch request failed!\n                    URL:" + wrappedResp.url + "\n                    Status: " + wrappedResp.statusText + "\n                    Response: " + wrappedResp.text());
                    var contentType = wrappedResp.headers.get("content-type");
                    if (contentType == "application/json") {
                        return wrappedResp.json();
                    }
                    else {
                        throw new Error("Fetch request failed! Unknown type of response content.\n                    URL:" + wrappedResp.url + "\n                    Status: " + wrappedResp.statusText + "\n                    Content Type: " + contentType);
                    }
                })
                    .then(function (json) {
                    if (json.hits.length == 0)
                        return;
                    _this.img = new URL(json.hits[0].webformatURL);
                    $(_this.element)
                        .children(".img")
                        .append($("<img>")
                        .attr("src", _this.img.toString())
                        .attr("alt", "Image of " + _this.word));
                });
                return [2 /*return*/];
            });
        });
    };
    return Noun;
}());
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("./noun-list.txt")];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, res.text()];
            case 2:
                text = _a.sent();
                nounList = text.split("\n");
                return [2 /*return*/];
        }
    });
}); })();
$(function () {
    $("#submit-btn").on("click", function () {
        $("#noun-table").empty();
        var i = parseInt($("#noun-count").val());
        for (i; i > 0; i--) {
            var noun = new Noun();
            nouns.push(noun);
            noun.fetchImage();
        }
    });
});
