// Get all the items
const colorItems = document.querySelectorAll(".loginGrid li div");

colorItems.forEach((block, index) => {
    // Define the animation
    const scaleAnimation = () => {
      gsap.to(block, {
        y: "25%",
        scale: 1.2,
        duration: 1, 
        ease: "power1.inOut",
        yoyo: true, 
        repeat: -1,
        delay: index * 0.5
      });
    };
  
    // Call the animation function
    scaleAnimation();
  });
