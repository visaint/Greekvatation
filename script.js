$(window).on("load", () => {
  gsap.registerPlugin(ScrollTrigger);

  // --- CONFIG ---
  const isMobile = window.innerWidth <= 768;

  // Lettering for text animations
  $(".text-wrapper h1 span, .bottom_text h5, .transition-text h2").lettering();

  // =========================================================
  // 1. INTRO ANIMATION (First Section ONLY)
  // =========================================================
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.fromTo(
    ".first-section h1 span",
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, stagger: 0.05 },
  )
    .fromTo(
      ".sec1-images img",
      { y: 100, opacity: 0, rotation: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: (i) => (i - 1.5) * 5, // Slight fan rotation: -7.5, -2.5, 2.5, 7.5
        duration: 1.2,
        stagger: 0.1,
        ease: "back.out(1.7)",
      },
      "-=0.5",
    )
    .fromTo(
      ".bottom_text h5 span",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.03 },
      "-=0.8",
    );

  // =========================================================
  // 2. SCROLL ANIMATION (Transition & Second Section)
  // =========================================================

  // Transition Text
  gsap.fromTo(
    ".transition-text h2 span",
    { x: -30, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".transition-section",
        start: "top 75%",
      },
      x: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.03,
    },
  );

  // Second Section Text
  let sl = gsap.timeline({
    scrollTrigger: {
      trigger: ".second-section",
      start: "top 60%", // Starts when section is 60% into view
    },
  });

  sl.fromTo(
    ".second-section h1 span",
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, stagger: 0.05 },
  ).fromTo(
    ".sec2-images img",
    { y: 100, opacity: 0, rotation: 0, scale: 0.8 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: (i) => (i - 1.5) * 5,
      duration: 1.2,
      stagger: 0.1,
      ease: "back.out(1.7)",
    },
    "-=0.5",
  );

  // =========================================================
  // 3. INTERACTION: CLICK TO POP UP (Grid View)
  // =========================================================

  function setupGalleryInteraction(containerClass) {
    const container = $(containerClass);
    const stack = container.find(".img_stack");
    const images = container.find("img");
    let isExpanded = false;

    // Click handler for the whole stack area
    stack.on("click", () => {
      if (!isExpanded) {
        // EXPAND TO GRID
        gsap.to(images, {
          rotation: (i) => (i % 2 === 0 ? -2 : 2), // Straighten up slightly
          x: (i) => {
            // Create a horizontal spread or 2x2 grid based on screen size
            if (isMobile) return i % 2 === 0 ? -60 : 60; // 2 columns tight
            return (i - 1.5) * 160; // Spread horizontally on desktop
          },
          y: (i) => {
            if (isMobile) return i < 2 ? -80 : 80; // 2 rows
            return 0;
          },
          scale: 1.1,
          zIndex: (i) => 10 + i, // Ensure layering is correct
          duration: 0.6,
          ease: "power2.out",
        });
        isExpanded = true;
      } else {
        // COLLAPSE BACK TO STACK
        gsap.to(images, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: (i) => (i - 1.5) * 5, // Return to fan
          duration: 0.5,
          ease: "power2.inOut",
        });
        isExpanded = false;
      }
    });

    // Hover effect (Desktop only)
    if (!isMobile) {
      stack.on("mouseenter", () => {
        if (!isExpanded) {
          gsap.to(images, {
            rotation: (i) => (i - 1.5) * 12, // Fan out wider on hover
            duration: 0.3,
          });
        }
      });
      stack.on("mouseleave", () => {
        if (!isExpanded) {
          gsap.to(images, {
            rotation: (i) => (i - 1.5) * 5, // Reset fan
            duration: 0.3,
          });
        }
      });
    }
  }

  // Apply to both sections
  setupGalleryInteraction(".sec1-images");
  setupGalleryInteraction(".sec2-images");
});
