import { buildIconGallery } from "./icon-gallery";


const filePaths = ['root/home/index.html'];

for (const filePath of filePaths) {
    buildIconGallery(filePath)
}