export const GallerySizes = ['small', 'medium', 'large'] as const;
export type GallerySizes = typeof GallerySizes[number];

export const responsiveGalleryData: {
    [size in GallerySizes]: { columnCount: number; size: string };
} = {
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

for (const size of GallerySizes) {
    `if (gallerySize != '${size}' && vw ${responsiveGalleryData[size].size}) {
        gallerySize = '${size}'
    `
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