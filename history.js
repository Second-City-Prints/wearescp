const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
const sections = gsap.utils.toArray('section')
const footer = document.getElementById("about");
const track = document.querySelector('[data-draggable]')
const navLinks = gsap.utils.toArray('[data-link]')

const trackSnapPoints = navLinks.map(link => link.getBoundingClientRect().x);
console.log(trackSnapPoints);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const lastItemWidth = () => navLinks[navLinks.length - 1].offsetWidth

const getUseableHeight = () => document.documentElement.offsetHeight - window.innerHeight - footer.clientHeight


var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

const scrollableEnd = height - footer.offsetHeight;

const getDraggableWidth = () => {
	return ((track.offsetWidth * 0.5) - lastItemWidth())
}

const updatePosition = () => {
	const left = track.getBoundingClientRect().left * -1
	const width = getDraggableWidth()
	const useableHeight = getUseableHeight()
	const y = gsap.utils.mapRange(0, width, 0, useableHeight, left)

	st.scroll(y)
}

/* Create the timeline to move the track */
const tl = gsap.timeline()
	.to(track, {
		x: () => getDraggableWidth() * -1,
		ease: 'none' // remove easing - very important!
	})

/* Create the ScrollTrigger instance */
const st = ScrollTrigger.create({
	animation: tl,
	scrub: 0,
    end: getUseableHeight()
})

/* Create the Draggable instance */
const draggableInstance = Draggable.create(track, {
	type: 'x',
	// inertia: true,
	bounds: {
		minX: 0,
		maxX: getDraggableWidth() * -1
	},
	edgeResistance: 1,
	onDragStart: () => st.disable(),
	onDragEnd: () => st.enable(),
	onDrag: updatePosition,
	onThrowUpdate: updatePosition
})

/* Allow navigation via keyboard */
track.addEventListener('keyup', (e) => {
	const id = e.target.getAttribute('href')
	if (!id || e.key !== 'Tab') return
	
	const section = document.querySelector(id)
	const y = section.getBoundingClientRect().top + window.scrollY
	
	st.scroll(y)
})

const initSectionAnimation = () => {
	/* Do nothing if user prefers reduced motion */
	if (prefersReducedMotion.matches) return
	
	sections.forEach((section, index) => {
        const heading = section.querySelector('.history__header')
		const historyBlurb = section.querySelector('.history__blurb')
        const startingOpacity = index == 0 ? 0 : .3



            gsap.set(heading, {
                opacity: startingOpacity,
                y: -15
            })

            gsap.set(historyBlurb, {
                opacity: startingOpacity,
                y: -15
            })
        
        

		/* Create the timeline */
		const sectionTl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: () => 'top center',
				end: () => `+=${window.innerHeight}`,
				toggleActions: 'play',
				// toggleClass: 'is-active',
				// markers: true,
			}
		})
		
		/* Add tweens to the timeline */
		sectionTl.to(heading, {
			opacity: 1,
			y: 0,
			duration: 1
		},)

		.to(historyBlurb, {
			opacity: 1,
			y: 0,
			duration: 1
		}, .2)
		
		/* Create a new timeline to add an active class to the nav link for the current section */
		const sectionTl2 = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: 'top 20px',
				end: () => `bottom top`,
				toggleActions: 'play none play reverse',
				onToggle: ({ isActive }) => {
					const sectionLink = navLinks[index]
					
					if (isActive) {
						sectionLink.classList.add('is-active')
					} else {
						sectionLink.classList.remove('is-active')
					}
				}
			}
		})
	})
}

initSectionAnimation()