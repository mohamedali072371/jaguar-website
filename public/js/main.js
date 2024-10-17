// import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

var swiper = new Swiper( '.swiper-container.two', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    effect: 'coverflow',
    loop: false,
    centeredSlides: true,
    slidesPerView: 'auto',
    // slidesPerView: 2,
    initialSlide: 2,
    coverflow: {
        rotate: 0,
        stretch: 100,
        depth: 150,
        modifier: 1.5,
        slideShadows : false,
    },
    breakpoints: {
        // when window width is <= 640px
        640: {
            slidesPerView: 1, // Show 1 slide on mobile
            // coverflow: {
            //     stretch: 100, // Adjust stretch for mobile
            // },
        },
        // when window width is <= 768px
        768: {
            slidesPerView: 2, // Show 2 slides on tablets
            // coverflow: {
            //     stretch: 100,
            // },
        },
        // when window width is > 768px
        769: {
            slidesPerView: 'auto', // Show auto slides for larger screens
            // coverflow: {
            //     stretch: 100,
            // },
        },
    },
    onInit: function (swiper) {
        console.log(2);
        var activeIndex = swiper.activeIndex;
        var bodyElement = document.querySelector('.masthead');
        var backgroundColors = ['#ff9999', '#99ccff', '#99ff99', '#ffff99'];
        bodyElement.style.backgroundColor = backgroundColors[activeIndex] || '#ffffff';

        //  var backgroundImages = [
        //         'assets/images/shoe-Background.jpg',
        //     ];
        // console.log("1"+bodyElement)
        // bodyElement.style.backgroundImage = `url(${backgroundImages[activeIndex]})` || 'url("assets/images/image-3.jpg")';
        // bodyElement.style.backgroundSize = 'cover';  // Ensure the image covers the entire background
        // bodyElement.style.backgroundPosition = 'center'; 
    },
    onTransitionEnd: function (swiper) {
        console.log(swiper)
        var activeIndex = swiper.activeIndex;
        console.log(activeIndex)
        var bodyElement = document.querySelector('.masthead');
        var backgroundColors = ['#ff9999', '#99ccff', '#99ff99', '#ffff99', '#99ccff'];
        bodyElement.style.backgroundColor = backgroundColors[activeIndex] || '#ffffff';
      
        var backgroundVideo = ['assets/img/bag.mp4', 'assets/img/water-bottle.mp4', 'assets/img/watch.mp4', 'assets/img/sofa.mp4'];
        var source = document.getElementById('videoSource');
        console.log(source)
        source.src = backgroundVideo[activeIndex]

    }
} );




// var backgroundImages = [
//     'assets/images/image-3.jpg',
//     'assets/images/image-1.jpg',
//     'assets/images/image-5.jpg',
//     'assets/images/image-4.jpg',
//     'assets/images/image-2.jpg'
// ];

// // Set the background image
// bodyElement.style.backgroundImage = `url(${backgroundImages[activeIndex]})` || 'url("assets/images/image-3.jpg")';
// bodyElement.style.backgroundSize = 'cover';  // Ensure the image covers the entire background
// bodyElement.style.backgroundPosition = 'center'; 