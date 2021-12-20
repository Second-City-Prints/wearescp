//nav toggle
document.querySelectorAll('#navtrigger, nav a').forEach(e=>{
    e.addEventListener('click', function(){
        document.querySelector('body').classList.toggle('nav-active')
    })
})

//nav links sliding in/out
document.querySelectorAll('nav > *').forEach((e, i)=>{
    e.style.transitionDelay = `calc(${i} * 0.05s)`
})

//if scrolling, hide the nav
window.addEventListener("scroll", function() {
    document.body.classList.remove('nav-active')
})