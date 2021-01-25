"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responsiveGalleryData = exports.GallerySizes = void 0;
exports.GallerySizes = ['small', 'medium', 'large'];
exports.responsiveGalleryData = {
    small: {
        columnCount: 2,
        size: '(max-width: 720px)'
    },
    medium: {
        columnCount: 3,
        size: '(min-width: 719px) and (max-width: 1375px)'
    },
    large: {
        columnCount: 4,
        size: '(min-width: 1376px)'
    }
};
for (const size of exports.GallerySizes) {
    `if (gallerySize != '${size}' && vw ${exports.responsiveGalleryData[size].size}) {
        gallerySize = '${size}'
    `;
}
/*
if (vw < 719 && gallerySize != 'small') {
    gallerySize  = 'small'
} else if (vw < 1440 && gallerySize != 'medium') {
    gallerySize  = 'medium'
} else if (gallerySize != 'large') {
    gallerySize  = 'large'
}
*/ 
//# sourceMappingURL=gallery-size.js.map