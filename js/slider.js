document.addEventListener('DOMContentLoaded', function () {
    new Glide('.glide', {                   // Create new slider (Glide object)
        type: 'carousel',                   // Type of the movement: changes slides without starting over when it reaches first or last slide.
        autoplay: 10000,                    // Change slides after a specified interval
        hoverpause: true,                   // Stop autoplay on mouseover event.
        gap: 10,                            // A size of the gap added between slides.
        animationDuration: 500,             // Duration of the animation in milliseconds.
        animationTimingFunc: 'ease-in-out'  // Easing function for the animation.
    }).mount();                             // Mounts and initializes a component
});