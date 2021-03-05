import cheerio from 'cheerio';
import { readFileSync, writeFileSync } from 'fs';

const filePaths = ['root/home/index.html'];

export function buildIconGallery(filePath: string) {
    const $ = cheerio.load(readFileSync(filePath, 'utf-8'));
    const iconCardTemplate = readFileSync(
        'compile/icon-card-template.html',
        'utf-8'
    );

    function iconCard(id: string, title: string) {
        var html = iconCardTemplate;
        return html.replace('{id}', id).replace('{title}', title);
    }

    $('svg#icon-gallery-content').each(function (i, elem) {
        const $svg = $(elem).after(
            '\n<section id="icon-gallery"></section>'
        );

        $(elem)
            .children('symbol')
            .each(function (i, elem) {
                try {
                    if (!('id' in elem.attribs))
                        throw new Error("SVG element doesn't has no id.");
                    var id = elem.attribs['id'];
                    var title = $(elem).find('title').text();
                    if (!title)
                        throw new Error(
                            "SVG element doesn't has no title."
                        );

                    $svg.next().append(iconCard(id, title));
                } catch (err) {
                    console.error(`Error! ${err.message}`, elem);
                }
            });
        $svg.next().append('\n');
    });

    writeFileSync(filePath, $.html());
}
