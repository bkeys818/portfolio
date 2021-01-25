import { readFileSync, writeFile } from 'fs';
import { parse, HTMLElement as htmlElement } from 'node-html-parser';
import sizeOf from 'image-size';
import { GallerySizes, responsiveGalleryData } from './gallery-size';

const relativePath = './';
const containsGallery = [relativePath + 'root/home/_index.html'];

let currentFilePath = '';

type GalleryData = {
    [size in GallerySizes]: { heights: number[]; columnsContainer: htmlElement };
};
type _GalleryData = {
    [size in GallerySizes]?: { heights: number[]; columnsContainer: htmlElement };
};

function buildGallerys(filePath: string) {
    currentFilePath = filePath.slice(0, filePath.lastIndexOf('/') + 1);

    var html = readFileSync(filePath, 'utf-8');
    const root = parse(html, { comment: true });

    root.querySelectorAll('.project-gallery').forEach(function (gallery) {
        const galleryData = (() => {
            var results: _GalleryData = {};
            for (const size of GallerySizes) {
                const n = responsiveGalleryData[size].columnCount;
                results[size] = {
                    heights: new Array(n).fill(0),
                    columnsContainer: parse(`<div class="column-container ${size} flex">${'<div class="column"></div>'.repeat(n)}</div>`)
                };
            }
            return results as GalleryData;
        })();

        for (const size of GallerySizes) {
            const heights = galleryData[size].heights;

            gallery.querySelectorAll('.cell').forEach(function (cell) {
                var smlColumnIndex = 0;
                for (var ii = 1; ii < heights.length; ii++) {
                    if (heights[smlColumnIndex] > heights[ii]) {
                        smlColumnIndex = ii;
                    }
                }
                const imgNodes = cell.querySelectorAll('img');
                if (imgNodes.length < 1) throw new Error("Cell doesn't have an image.");
                else if (imgNodes.length > 1)
                    throw new Error('Cell has more than one image.');

                const imgPath = imgNodes[0].getAttribute('src');
                const dimensions = sizeOf(currentFilePath + imgPath);
                if (!dimensions) throw new Error('Dimensions value is undefined.');
                else if (!dimensions.height)
                    throw new Error('Height value is undefined.');

                galleryData[size].columnsContainer
                    .querySelectorAll('.column')
                    [smlColumnIndex].appendChild(cell);
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
        }`

        do {
            gallery.removeChild(gallery.firstChild)
        } while (gallery.firstChild)

        for (const size of GallerySizes) {
            gallery.appendChild(galleryData[size].columnsContainer)
            styleHTML += `
            @media screen and ${responsiveGalleryData[size].size} {
                .project-gallery .column-container.${size} {
                    display: flex;
                }
            }`
        }
        styleHTML += '\n</style>'

        gallery.insertAdjacentHTML('afterend', styleHTML)

        writeFile(
            currentFilePath+'index.html',
            // currentFilePath + `gallery${gallery.id ?? ''}.json`,
            root.toString(),
            (err) => {
                if (err) throw err;
            }
        );
    });
}

try {
    let a = buildGallerys(containsGallery[0]);
} catch (err) {
    if (err instanceof Error) {
        console.error(`[${err.name}]: ${err.message}`);
    } else if (err as string) {
        console.error(`[Unknown Error]: ${err}`);
    } else {
        console.error(new TypeError('Caught unknown Type!'), err);
    }
}
