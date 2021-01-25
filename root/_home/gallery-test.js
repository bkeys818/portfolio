let visibleSize = 'medium';
/*----- gallerySizes -----*/
const sizes = ['small', 'medium', 'large'];

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
        const vw = Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
        );
        /*----- ifSizeStatment -----*/
        if (vw < 719) visibleSize = 'small';
        else if (vw < 1425) visibleSize = 'medium';
        else visibleSize = 'large';

        $('.project-gallery')
            .html(data[visibleSize])
        console.log(visibleSize)
        $(() => {
            for (const size of sizes) {
                if (size == visibleSize) continue;
                $('.project-gallery').append($(data[size]));
            }
        });
    }
});
