"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var image_size_1 = __importDefault(require("image-size"));
var relativePath = '../';
var containsGallery = [relativePath + 'root/home/index.html'];
var ColumnData = /** @class */ (function () {
    function ColumnData() {
        this.small = [];
        this.medium = [];
        this.large = [];
    }
    return ColumnData;
}());
var htmlRegExp = {
    attr: function (name, value) {
        if (value === void 0) { value = '.*?'; }
        if (value instanceof RegExp)
            value = value.source;
        return new RegExp(name + "=\"" + value + "\"", 'g');
    },
    elem: function (tag, empty, attrs) {
        if (tag === void 0) { tag = '([a-zA-Z]+)'; }
        if (empty === void 0) { empty = true; }
        var anyAttr = '[a-zA-Z]+=".*?"';
        var regExp = "<" + tag;
        if (attrs) {
            regExp += "\\s+(" + anyAttr + "\\s+)*";
            for (var i = 0; i < attrs.length - 1; i++) {
                regExp += attrs[i].source + "\\s+";
            }
            regExp += attrs[attrs.length - 1].source;
        }
        regExp += "(\\s+" + anyAttr + ")*\\s*";
        if (empty) {
            regExp += "/>";
        }
        else {
            regExp += ">(.|\\s)*?<\\/";
            if (tag === '([a-zA-Z]+)') {
                regExp += "\\1\\s*>";
            }
            else {
                regExp += tag + "\\s*>";
            }
        }
        return new RegExp(regExp, 'g');
    }
};
function buildColumnData(filePath) {
    var gallery, cell, imgTag, imgSrc;
    var regExp = {
        gallery: htmlRegExp.elem(undefined, false, [
            htmlRegExp.attr('class', 'project-gallery')
        ]),
        cell: htmlRegExp.elem(undefined, false, [htmlRegExp.attr('class', 'cell')]),
        img: htmlRegExp.elem('img'),
        src: htmlRegExp.attr('src')
    };
    var folderPath = filePath.slice(0, filePath.lastIndexOf('/') + 1);
    try {
        var columnData = new ColumnData();
        var html = fs.readFileSync(filePath, 'utf-8');
        var gallerys = html.replace(/<!--[^]*?-->/g, '').match(regExp.gallery);
        if (!gallerys) {
            throw new Error('No galleries were found.');
        }
        for (var _i = 0, gallerys_1 = gallerys; _i < gallerys_1.length; _i++) {
            gallery = gallerys_1[_i];
            var cells = gallery.match(regExp.cell);
            if (!cells) {
                throw new Error('Gallery has no cells.');
            }
            var imgs = [];
            for (var _a = 0, cells_1 = cells; _a < cells_1.length; _a++) {
                cell = cells_1[_a];
                var imgTags = cell.match(regExp.img);
                if (imgTags && imgTags.length == 1) {
                    imgTag = imgTags[0];
                    var imgSrcs = imgTag.match(regExp.src);
                    if (imgSrcs && imgSrcs.length == 1) {
                        imgSrc = imgSrcs[0];
                        var dimensions = image_size_1.default(folderPath + imgSrc.slice(5, -1));
                        if (!dimensions) {
                            throw new Error('Dimensions value is undefined.');
                        }
                        else if (!dimensions.height) {
                            throw new Error('Height value is undefined.');
                        }
                        else {
                            imgs.push({ path: imgSrc, height: dimensions.height });
                        }
                    }
                    else {
                        throw new Error("Couldn't get src of img.");
                    }
                }
                else {
                    if (imgTags && imgTags.length == 0)
                        throw new Error("Couldn't find a img in cell");
                    if (imgTags && imgTags.length > 1)
                        throw new Error("Cell had more than one img.");
                    throw "Failed when searching for img";
                }
            }
            columnData.small = fillColumns(2, imgs);
            columnData.medium = fillColumns(3, imgs);
            columnData.large = fillColumns(4, imgs);
            console.log('done');
        }
        return columnData;
    }
    catch (err) {
        var data = {
            file: filePath,
            gallery: gallery,
            cell: cell,
            imgTag: imgTag,
            imgSrc: imgSrc
        };
        if (err instanceof Error) {
            console.error("[" + err.name + "] " + err.message, data);
        }
        else if (err) {
            console.error("[Unknown Error] " + err, data);
        }
        else {
            console.error(new TypeError('Caught unknown Type!'), err);
        }
    }
    function fillColumns(n, imgs) {
        var heights = []; //new Array<number>(n).fill(0);
        var columns = []; //new Array<string[]>(n).fill([]);
        for (i = 0; i < n; i++) {
            heights.push(0);
            columns.push([]);
        }
        for (var _i = 0, imgs_1 = imgs; _i < imgs_1.length; _i++) {
            var img = imgs_1[_i];
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
var a = buildColumnData(containsGallery[0]);
console.log(a);
