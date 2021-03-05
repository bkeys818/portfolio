"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIconGallery = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const fs_1 = require("fs");
function buildIconGallery() {
    const filePaths = ['root/home/index.html'];
    for (const filePath of filePaths) {
        const $ = cheerio_1.default.load(fs_1.readFileSync(filePath, 'utf-8'));
        const iconCardTemplate = fs_1.readFileSync('compile/icon-card-template.html', 'utf-8');
        function iconCard(id, title) {
            var html = iconCardTemplate;
            return html.replace('{id}', id).replace('{title}', title);
        }
        $('svg#icon-gallery-content').each(function (i, elem) {
            const $svg = $(elem).after('\n<section id="icon-gallery"></section>');
            $(elem)
                .children('symbol')
                .each(function (i, elem) {
                try {
                    if (!('id' in elem.attribs))
                        throw new Error("SVG element doesn't has no id.");
                    var id = elem.attribs['id'];
                    var title = $(elem).find('title').text();
                    if (!title)
                        throw new Error("SVG element doesn't has no title.");
                    $svg.next().append(iconCard(id, title));
                }
                catch (err) {
                    console.error(`Error! ${err.message}`, elem);
                }
            });
            $svg.next().append('\n');
        });
        fs_1.writeFileSync(filePath, $.html());
    }
}
exports.buildIconGallery = buildIconGallery;
