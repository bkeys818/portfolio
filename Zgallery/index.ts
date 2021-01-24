import * as fs from 'fs';
import sizeOf from 'image-size';

const relativePath = '../';
const containsGallery = [relativePath + 'root/home/index.html'];

class ColumnData {
    small: string[][] = [];
    medium: string[][] = [];
    large: string[][] = [];
}
interface ImgInfo {
    path: string;
    height: number;
}
const htmlRegExp = {
    attr(name: string, value: string | RegExp = '.*?'): RegExp {
        if (value instanceof RegExp) value = value.source;
        return new RegExp(`${name}="${value}"`, 'g');
    },
    elem(tag: string = '([a-zA-Z]+)', empty: Boolean = true, attrs?: RegExp[]): RegExp {
        const anyAttr = '[a-zA-Z]+=".*?"';
        var regExp = `<${tag}`;
        if (attrs) {
            regExp += `\\s+(${anyAttr}\\s+)*`;
            for (var i = 0; i < attrs.length - 1; i++) {
                regExp += `${attrs[i].source}\\s+`;
            }
            regExp += attrs[attrs.length - 1].source;
        }
        regExp += `(\\s+${anyAttr})*\\s*`;
        if (empty) {
            regExp += `\/>`;
        } else {
            regExp += `>(.|\\s)*?<\\/`;
            if (tag === '([a-zA-Z]+)') {
                regExp += `\\1\\s*>`;
            } else {
                regExp += `${tag}\\s*>`;
            }
        }
        return new RegExp(regExp, 'g');
    }
};

function buildColumnData(filePath: string) {
    let gallery: string | undefined,
        cell: string | undefined,
        imgTag: string | undefined,
        imgSrc: string | undefined;

    const regExp = {
        gallery: htmlRegExp.elem(undefined, false, [
            htmlRegExp.attr('class', 'project-gallery')
        ]),
        cell: htmlRegExp.elem(undefined, false, [htmlRegExp.attr('class', 'cell')]),
        img: htmlRegExp.elem('img'),
        src: htmlRegExp.attr('src')
    };

    const folderPath = filePath.slice(0, filePath.lastIndexOf('/') + 1);

    try {
        const columnData = new ColumnData();

        let html = fs.readFileSync(filePath, 'utf-8');
        const gallerys = html.replace(/<!--[^]*?-->/g, '').match(regExp.gallery);
        if (!gallerys) {
            throw new Error('No galleries were found.');
        }
        for (gallery of gallerys) {
            const cells = gallery.match(regExp.cell);
            if (!cells) {
                throw new Error('Gallery has no cells.');
            }

            const imgs: ImgInfo[] = [];
            for (cell of cells) {
                const imgTags = cell.match(regExp.img);
                if (imgTags && imgTags.length == 1) {
                    imgTag = imgTags[0]
                    const imgSrcs = imgTag.match(regExp.src);
                    if (imgSrcs && imgSrcs.length == 1) {
                        imgSrc = imgSrcs[0]
                        let dimensions = sizeOf(folderPath + imgSrc.slice(5, -1));
                        if (!dimensions) {
                            throw new Error('Dimensions value is undefined.');
                        } else if (!dimensions.height) {
                            throw new Error('Height value is undefined.');
                        } else {
                            imgs.push({ path: imgSrc, height: dimensions.height });
                        }
                    } else {
                        throw new Error("Couldn't get src of img.");
                    }
                } else {
                    if (imgTags && imgTags.length == 0) throw new Error("Couldn't find a img in cell");
                    if (imgTags && imgTags.length > 1) throw new Error("Cell had more than one img.");
                    throw "Failed when searching for img"
                }
            }

            columnData.small = fillColumns(2, imgs);
            columnData.medium = fillColumns(3, imgs);
            columnData.large = fillColumns(4, imgs);
            console.log('done');
        }
        return columnData;
    } catch (err) {
        const data = {
            file: filePath,
            gallery: gallery,
            cell: cell,
            imgTag: imgTag,
            imgSrc: imgSrc
        };
        if (err instanceof Error) {
            console.error(`[${err.name}] ${err.message}`, data);
        } else if (err as string) {
            console.error(`[Unknown Error] ${err}`, data);
        } else {
            console.error(new TypeError('Caught unknown Type!'), err);
        }
    }

    function fillColumns(n: number, imgs: ImgInfo[]): Array<string[]> {
        const heights: Array<number> = []; //new Array<number>(n).fill(0);
        const columns: Array<string[]> = []; //new Array<string[]>(n).fill([]);
        for (i = 0; i < n; i++) {
            heights.push(0);
            columns.push([]);
        }

        for (const img of imgs) {
            var smlColumnIndex = 0;
            for (var i = 1; i < heights.length; i++) {
                if (heights[smlColumnIndex] > heights[i]) {
                    smlColumnIndex = i;
                }
            }
            columns[smlColumnIndex].push(img.path);
            heights[smlColumnIndex] += img.height;
        }
        return columns;
    }
}

let a = buildColumnData(containsGallery[0]);
console.log(a);
