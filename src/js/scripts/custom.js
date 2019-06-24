$(document).ready(function() {
    
    // Magnific Popup
    // var about_list = ['education', 'retraining', 'qual', 'conf', 'blog', 'olympiad', 'race'];
    // $.each(about_list, function(index, value){
    //     $('.popup-' + value).magnificPopup({
    //         delegate: 'a',
    //         type: 'image',
    //         gallery: {
    //             enabled: true,
    //             navigateByImgClick: true,
    //             preload: [0,1]
    //         }
    //     });
    // });

    // Bootstrap carousel
    $('.carousel').carousel({
        interval: 5000
    });    
    
    // Masonry  
    $('.grid').masonry({
        // options
        // itemSelector: '.grid-item',
        // percentPosition: true,
        // columnWidth: 20,
        // columnWidth: '.grid-sizer',
        // gutter: 10,
        // horizontalOrder: true
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
        itemSelector: '.grid-item',
        percentPosition: true
    });
});