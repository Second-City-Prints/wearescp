///////// GALLERY FUNCTIONS
var swiper
function initGallery(artistName = "livelarge") {
    //get the artist
    let artist = artists[artistName]

    //get and clear out the gallery
    let gallery = document.querySelector('.gallery')
    gallery.innerHTML = ""

    //adds the images from the artist
    var newImages = ""
    artist.images.forEach(image => {
        var alt = image.alt
        if(alt == "" || typeof alt == "undefined") {
            alt = artist.name
        }

        if(image.url) 
            newImages += `<div class="swiper-slide"><a href="${image.url}" target="_blank"><img src="${image.img}" alt="${alt}"></a></div>"`
        else 
            newImages += `<div class="swiper-slide"><img src="${image.img}" alt="${alt}"></div>`
    });

    gallery.innerHTML = `
        <div class="swiper">
            <div class="swiper-wrapper">
                ${newImages}
            </div>
        </div>
    `

    //update the scrolling artist names
    document.querySelectorAll('#gallery .artistname').forEach(e=>{
        e.innerHTML = artist.name
    })

    //init slider
    swiper = new Swiper('.swiper', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 1,
        spaceBetween: 10,
        breakpoints: {
            // when window width is >= 640px
            640: {
                slidesPerView: 2,
                spaceBetween: 40
            }
        }
    })
}
function destroyGallery() {swiper.destroy()}
function toggleGallery() {document.querySelector('body').classList.toggle('gal-active')}
//////////

//if scrolled past the black splash page, invert the header
window.addEventListener("scroll", function() {
    var splash = document.getElementById("splash")
    if (window.scrollY > (splash.offsetTop + splash.offsetHeight - 50)) {
        document.querySelector('header').classList.add('scrolled')
    } else {
        document.querySelector('header').classList.remove('scrolled')
    }
})

//bg image duplication for seamless animation
document.querySelectorAll('.bg-images').forEach(e=>{
    e.after(e.cloneNode(true))
})

//splash image hover pauses the animation, click scrolls you down to gallery and shows that artist's gallery
document.querySelectorAll('#splash .bg-images img').forEach(e=>{
    e.addEventListener('mouseenter', ()=> document.querySelector('#splash .background').style.animationPlayState = "paused")
    e.addEventListener('mouseleave', ()=> document.querySelector('#splash .background').style.animationPlayState = "")
})

//gallery artist title duplication
document.querySelectorAll('.artistname').forEach(e=>{
    e.innerHTML = "Live Large"
    for (let i = 0; i < 9; i++) {
        e.after(e.cloneNode(true))   
    }
})

//gal toggles
//OPEN
document.querySelectorAll('.artist, #splash .bg-images img').forEach(e=>{
    e.addEventListener('click', function(){
        document.getElementById('gallery').scrollIntoView()
        initGallery(e.dataset.artist)
        toggleGallery()
    })
})

//CLOSE
document.querySelectorAll('.galclose').forEach(e=>{
    e.addEventListener('click', function(){
        toggleGallery()
        destroyGallery()
    })
})