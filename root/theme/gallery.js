// const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

// const resizeGallery = new ResizeObserver(function(galleries) {
    // for (var gallery of galleries) {
function resizeGallery() {
    for (var gallery of $('.project-gallery').toArray()) {
        if ($(gallery).width() < 515) {
            if (gallery.columns === 2) {
                return;
            }
            gallery.columns = 2;
        } else if ($(gallery).width() > 1000) {
            if (gallery.columns === 4) {
                return;
            }
            gallery.columns = 4;
        } else {
            if (gallery.columns === 3) {
                return;
            }
            gallery.columns = 3;
        }

        if (gallery.cells) {
            $(gallery).children().remove()
        } else {
            gallery.cells = $(gallery).children('.cell').toArray()
        }

        // const $columns = $('<div class="column" id="a"></div><div class="column" id="b"></div><div class="column" id="c"></div><div class="column" id="d"></div>').appendTo($(gallery))
        const columnWidth = Math.round((100/gallery.columns+Number.EPSILON)*1000)/1000
        const html = `<div class="column" style="flex: ${columnWidth}; -ms-flex: ${columnWidth}; -webkit-box-flex: ${columnWidth};"></div>`
        const $columns = $(html.repeat(gallery.columns)).prependTo($(gallery))

        // const orderRun = []

        for (var cell of gallery.cells) {
            // orderRun.push(cell.id)
            var $shortestColumn = $columns.eq(0);
            $columns.each(function(){
                if ($shortestColumn.height() > $(this).height()) {
                    $shortestColumn = $(this)
                }
            })
            $shortestColumn.append($(cell).detach())
        }

        // console.log(orderRun.toString())
    }
}

resizeGallery();

$(function () {
    window.addEventListener('resize', function() {
        // console.log("a")
        resizeGallery();
    });
});
