$(function () {
    $('#icon-gallery-content symbol').each(function () {
        this.setAttribute('stoke-width', '2');
    });
    $('#icon-stroke-width-slider').on('input', function () {
        let newWidth = this.value.toString()
        $('#icon-gallery-content symbol').each(function () {
            this.setAttribute('stoke-width', newWidth);
        });
    });
});
