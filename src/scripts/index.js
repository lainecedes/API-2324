console.log(recommendedData);

const toggleButton = document.getElementById('toggleButton');

function toggleSwitch() {
    var button = document.getElementById('toggleButton');
    button.classList.toggle('active');

    const playlistSection = document.querySelector('section:nth-of-type(3)');
    playlistSection.classList.toggle('showSection');

}

// Select all the image covers
const covers = document.querySelectorAll('.recommendedCover');

// Create an audio element
const audio = new Audio();

// Function to play or pause the audio preview
function toggleAudioPreview(previewUrl) {
    if (audio.paused || audio.src !== previewUrl) {
        // If audio is paused or the preview URL has changed, play the audio
        audio.src = previewUrl;
        audio.play();
    } else {
        // If audio is playing and the preview URL matches, pause the audio
        audio.pause();
    }
}

// Add click event listeners to the image covers
covers.forEach(cover => {
    cover.addEventListener('click', () => {
        // preview URL from data-preview-url 
        const previewUrl = cover.getAttribute('data-preview-url');
        // toggle play/pause audio
        toggleAudioPreview(previewUrl);
    });
});

// pause audio
audio.addEventListener('ended', () => {
    audio.pause();
});


// Add event listener for the click event
toggleButton.addEventListener('click', function () {
    toggleSwitch();
});


document.addEventListener("DOMContentLoaded", function () {
    // Get the playlist button element
    const playlistButton = document.getElementById('playlistButton');

    // Add click event listener to the playlist button
    playlistButton.addEventListener('click', function(event) {
        // Prevent the default behavior of the button (e.g., form submission)
        event.preventDefault();

        // Send a POST request to the /profile endpoint
        fetch('/profile', {
            method: 'POST',
            credentials: 'same-origin', // Include cookies in the request
            headers: {
                'Content-Type': 'application/json' // Specify the content type of the request body
            }
        })
        .then(response => {
            // Check if the response status is in the success range
            if (response.ok) {
                // Parse the response JSON data
                return response.json();
            } else {
                // Log the error if the response status is not in the success range
                console.error('Error:', response.statusText);
            }
        })
        .then(data => {
            // Log the data received from the server for debugging
            console.log('Server Response:', data);
            
            // Use the Web Share API to share the generated playlist link
            if (navigator.share) {
                // Share the playlist link using the Web Share API
                navigator.share({
                    title: 'Check out my recommended playlist!',
                    url: data.playlistLink
                })
                .then(() => console.log('Shared successfully'))
                .catch(error => console.error('Error sharing:', error));
            } else {
                // Web Share API is not supported, handle accordingly
                console.error('Web Share API is not supported');
            }
        })
        .catch(error => {
            // Log any network errors
            console.error('Error:', error);
        });
    });
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

const gridCovers = document.querySelectorAll('.grid li');
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


