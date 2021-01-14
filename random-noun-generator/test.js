"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = __importDefault(require("node-fetch"));
node_fetch_1.default('https://pixabay.com/api/?key=19185430-0ca8ecbb0c60d76842e868b06&safesearch=true&per_page=3q=crazy%20clown')
    .then(function (res) { return res.json(); })
    .then(function (res) { console.log(res); });
