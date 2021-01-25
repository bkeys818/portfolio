"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const node_html_parser_1 = require("node-html-parser");
const image_size_1 = __importDefault(require("image-size"));
const gallery_size_1 = require("./gallery-size");
const relativePath = './';
const containsGallery = [relativePath + 'root/home/_index.html'];
let currentFilePath = '';
function buildGallerys(filePath) {
    currentFilePath = filePath.slice(0, filePath.lastIndexOf('/') + 1);
    var html = fs_1.readFileSync(filePath, 'utf-8');
    const root = node_html_parser_1.parse(html, { comment: true });
    root.querySelectorAll('.project-gallery').forEach(function (gallery) {
        const galleryData = (() => {
            var results = {};
            for (const size of gallery_size_1.GallerySizes) {
                const n = gallery_size_1.responsiveGalleryData[size].columnCount;
                results[size] = {
                    heights: new Array(n).fill(0),
                    columnsContainer: node_html_parser_1.parse(`<div class="column-container ${size} flex">${'<div class="column"></div>'.repeat(n)}</div>`)
                };
            }
            return results;
        })();
        for (const size of gallery_size_1.GallerySizes) {
            const heights = galleryData[size].heights;
            gallery.querySelectorAll('.cell').forEach(function (cell) {
                var smlColumnIndex = 0;
                for (var ii = 1; ii < heights.length; ii++) {
                    if (heights[smlColumnIndex] > heights[ii]) {
                        smlColumnIndex = ii;
                    }
                }
                const imgNodes = cell.querySelectorAll('img');
                if (imgNodes.length < 1)
                    throw new Error("Cell doesn't have an image.");
                else if (imgNodes.length > 1)
                    throw new Error('Cell has more than one image.');
                const imgPath = imgNodes[0].getAttribute('src');
                const dimensions = image_size_1.default(currentFilePath + imgPath);
                if (!dimensions)
                    throw new Error('Dimensions value is undefined.');
                else if (!dimensions.height)
                    throw new Error('Height value is undefined.');
                galleryData[size].columnsContainer
                    .querySelectorAll('.column')[smlColumnIndex].appendChild(cell);
                heights[smlColumnIndex] += dimensions.height;
            });
        }
        // const html: { [size in GallerySizes]: string } = {
        //     small: galleryData['small'].columnsContainer.outerHTML,
        //     medium: galleryData['medium'].columnsContainer.outerHTML,
        //     large: galleryData['large'].columnsContainer.outerHTML
        // };
        var styleHTML = `<style>
        .project-gallery .column-container {
            display: none;
        }`;
        do {
            gallery.removeChild(gallery.firstChild);
        } while (gallery.firstChild);
        for (const size of gallery_size_1.GallerySizes) {
            gallery.appendChild(galleryData[size].columnsContainer);
            styleHTML += `
            @media screen and ${gallery_size_1.responsiveGalleryData[size].size} {
                .project-gallery .column-container.${size} {
                    display: flex;
                }
            }`;
        }
        styleHTML += '\n</style>';
        gallery.insertAdjacentHTML('afterend', styleHTML);
        fs_1.writeFile(currentFilePath + 'index.html', 
        // currentFilePath + `gallery${gallery.id ?? ''}.json`,
        root.toString(), (err) => {
            if (err)
                throw err;
        });
    });
}
try {
    let a = buildGallerys(containsGallery[0]);
}
catch (err) {
    if (err instanceof Error) {
        console.error(`[${err.name}]: ${err.message}`);
    }
    else if (err) {
        console.error(`[Unknown Error]: ${err}`);
    }
    else {
        console.error(new TypeError('Caught unknown Type!'), err);
    }
}
//# sourceMappingURL=index.js.map