"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let visibleSize = '';
/*----- gallerySizes -----*/
const sizes = [];
$.ajax({
    type: 'GET',
    url: 'gallery.json',
    data: { get_param: 'value' },
    dataType: 'json',
    error: function (jqXHR, textStatus, errorThrown) {
        console.error(`[Error]: Failed the get gallery data from JSON.`);
        console.info('Status code: ', jqXHR.status);
        console.info('Response Text: ', jqXHR.responseText);
        console.info('Error thrown: ', errorThrown);
    },
    success: function (data) {
        /*----- ifSizeStatment -----*/
        if (vw < 719)
            visibleSize = 'small';
        else if (vw < 1440)
            visibleSize = 'medium';
        else
            visibleSize = 'large';
        $('.project-gallery')
            .html(data[visibleSize])
            .children(`.column-container.${visibleSize}`)
            .fadeIn();
        $(() => {
            for (const size of sizes) {
                if (size == visibleSize)
                    continue;
                $('.project-gallery').append($(data[size]));
            }
        });
    }
});
$(() => {
    window.addEventListener('resize', function () {
        /*----- ifSizeStatment -----*/
        if (vw < 719 && visibleSize != 'small')
            visibleSize = 'small';
        else if (vw < 1440 && visibleSize != 'medium')
            visibleSize = 'medium';
        else if (visibleSize != 'large')
            visibleSize = 'large';
        else
            return;
        $('.project-gallery').children(`column-container.${visibleSize}`).fadeIn();
        for (const size of sizes) {
            if (size == visibleSize)
                continue;
            $('.project-gallery').children(`column-container.${size}`).fadeOut();
        }
    });
});
//# sourceMappingURL=resizeGallery.js.map