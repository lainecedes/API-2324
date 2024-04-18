const toggleButton = document.getElementById('toggleButton');

function toggleSwitch () {
    var button = document.getElementById('toggleButton');
    button.classList.toggle('active');
}

// Add event listener for the click event
toggleButton.addEventListener('click', function () {
    toggleSwitch();
});


// Lenis setup on github https://github.com/studio-freight/lenis
const lenis = new Lenis();
lenis.on('scroll', (e) => {
  console.log(e);
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


// gsap styling for the image covers

const gridCovers = document.querySelectorAll('li');
if (gridCovers) {


const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {

    // SCROLLTRIGGER
    gridCovers.forEach(item => {
        const cover = item.querySelector('.covers');
        const xPercentRandomVal = gsap.utils.random(-100,100);

        gsap.timeline()
		.addLabel('start', 0)
        .set(cover, {
			transformOrigin: `${xPercentRandomVal < 0 ? 0 : 100}% 100%`
		}, 'start')
		.to(cover, {
            ease: 'none',
            scale: 0,
			scrollTrigger: {
                trigger: item,
                start: 'top top',
                end: 'bottom top',
                marker: true,
                scrub: true
            }
        }, 'start')
		.to(item, {
            ease: 'none',
            xPercent: xPercentRandomVal,
			scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'top top',
                marker: true,
                scrub: true
            }
        }, 'start');
    });
});

// gsap.to(gridCovers, {
//     scrollTrigger: {
//         trigger: 'pictures',
//         start: 'top 20%',
//         end: 'bottom 50%',
//         marker: true,
//         scrub: true 
//     },
//         y: 500,
//         scale: 1.2,
//         rotate: 360,
//        });
//    });
    // gsap.to(pictures, {
    //     scale: 1.5,
    //     duration: 0.5,
    // });

    // gsap.from(pictures), {
    //     scale: 2,
    //     duration: 0.5
    // };

    // gsap.fromTo(pictures, {
    //     scale: 4,
    //     delay: 3,
    //     duration: 2
    // }, {
    //     scale: 1
    // });

    // TIMELINE:

    // const tl = gsap.timeline({
    //     duration: 0.4
    // });

    // tl.to(pictures, {
    //     x: 100,
    //     ease: 'bounce.out'
    // });

    // tl.to(pictures, {
    //     y: 100,
    //     ease: 'bounce.out'
    // });

    // tl.to(pictures, {
    //     skew: '10deg'
    // });

    // tl.to(pictures, {
    //     rotate: '-10deg',
    //     onComplete: () => {
    //         tl.reverse();
    //     }
    // });

}


