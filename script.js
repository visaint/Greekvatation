$(window).on("load", () => {
  gsap.registerPlugin(ScrollTrigger);

  // --- CONFIG ---
  const isMobile = window.innerWidth <= 768;
  const AUTO_EXPAND_DELAY = 1.5; // Seconds to wait before auto-expanding

  // Lettering for text animations
  $(".text-wrapper h1 span, .bottom_text h5, .transition-text h2").lettering();

  // =========================================================
  // BALLOONS AND SPARKLES SETUP
  // =========================================================

  // Create balloon container
  const balloonContainer = $('<div class="balloon-container"></div>');
  $("body").append(balloonContainer);

  // Create sparkle container
  const sparkleContainer = $('<div class="sparkle-container"></div>');
  $("body").append(sparkleContainer);

  // Function to create floating balloons
  function createBalloon() {
    const balloon = $('<div class="balloon"></div>');
    const balloonType = Math.floor(Math.random() * 3) + 1;
    balloon.addClass(`balloon-${balloonType}`);

    // Random horizontal position
    const startX = Math.random() * window.innerWidth;
    balloon.css({
      left: startX + "px",
      bottom: "-60px",
    });

    // Random drift and rotation for variety
    const drift = (Math.random() - 0.5) * 200;
    const rotation = (Math.random() - 0.5) * 90;
    balloon.css({
      "--drift": drift + "px",
      "--rotation": rotation + "deg",
    });

    balloonContainer.append(balloon);

    // Animate
    gsap.to(balloon[0], {
      duration: 8 + Math.random() * 4,
      ease: "none",
      opacity: 0.9,
      onComplete: () => balloon.remove(),
    });

    balloon.css(
      "animation",
      `float-up ${8 + Math.random() * 4}s linear forwards`,
    );
  }

  // Function to create sparkles
  function createSparkle(x, y) {
    const sparkle = $('<div class="sparkle"></div>');
    sparkle.css({
      left: x + "px",
      top: y + "px",
    });

    sparkleContainer.append(sparkle);

    // Animate sparkle
    gsap.to(sparkle[0], {
      duration: 1.5,
      ease: "power2.out",
      onComplete: () => sparkle.remove(),
    });

    sparkle.css("animation", "sparkle-twinkle 1.5s ease-out forwards");
  }

  // Function to create confetti burst
  function createConfettiBurst(x, y, count = 15) {
    const colors = ["#0047ab", "#00a3e0", "#3e4db3", "#ffd700", "#ffffff"];

    for (let i = 0; i < count; i++) {
      const confetti = $('<div class="confetti"></div>');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 50 + Math.random() * 100;
      const duration = 1 + Math.random() * 1;

      confetti.css({
        left: x + "px",
        top: y + "px",
        background: color,
      });

      sparkleContainer.append(confetti);

      gsap.to(confetti[0], {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity + 300,
        rotation: 720,
        opacity: 0,
        duration: duration,
        ease: "power2.out",
        onComplete: () => confetti.remove(),
      });
    }
  }

  // Generate balloons periodically
  function startBalloonAnimation() {
    createBalloon();
    const nextBalloon = 2000 + Math.random() * 3000; // Every 2-5 seconds
    setTimeout(startBalloonAnimation, nextBalloon);
  }

  // Generate sparkles randomly
  function createRandomSparkles() {
    if (Math.random() > 0.7) {
      // 30% chance
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      createSparkle(x, y);
    }
    setTimeout(createRandomSparkles, 1000 + Math.random() * 2000);
  }

  // Start animations after a short delay
  setTimeout(() => {
    startBalloonAnimation();
    createRandomSparkles();
  }, 1000);

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
        rotation: (i) => (i - 1.5) * 5,
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
    )
    .add(() => {
      // Confetti burst on first load
      createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 20);
      // Auto-expand first section images after animation completes
      autoExpandImages(".sec1-images");
    }, `+=${AUTO_EXPAND_DELAY}`);

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
        onEnter: () => {
          // Mini confetti burst when transition appears
          createConfettiBurst(
            window.innerWidth / 2,
            window.innerHeight / 3,
            10,
          );
        },
      },
      x: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.03,
    },
  );

  // Second Section Text and Images
  let sl = gsap.timeline({
    scrollTrigger: {
      trigger: ".second-section",
      start: "top 60%",
      onEnter: () => {
        // Sparkles when section enters
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight * 0.4 + Math.random() * 200;
            createSparkle(x, y);
          }, i * 100);
        }
        // Auto-expand after animation completes
        setTimeout(
          () => autoExpandImages(".sec2-images"),
          (1 + AUTO_EXPAND_DELAY) * 1000,
        );
      },
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

  // Third Section Text and Images
  let tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".third-section",
      start: "top 60%",
      onEnter: () => {
        // Sparkles when section enters
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight * 0.5 + Math.random() * 200;
            createSparkle(x, y);
          }, i * 100);
        }
        // Auto-expand after animation completes
        setTimeout(
          () => autoExpandImages(".sec3-images"),
          (1 + AUTO_EXPAND_DELAY) * 1000,
        );
      },
    },
  });

  tl3
    .fromTo(
      ".third-section h1 span",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, stagger: 0.05 },
    )
    .fromTo(
      ".sec3-images img",
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

  // Fourth Section (8 images) - Color Palette
  let tl4 = gsap.timeline({
    scrollTrigger: {
      trigger: ".fourth-section",
      start: "top 60%",
      onEnter: () => {
        // Sparkles when section enters
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight * 0.5 + Math.random() * 200;
            createSparkle(x, y);
          }, i * 100);
        }
        // Auto-expand after animation completes
        setTimeout(
          () => autoExpandImages8(".sec4-images"),
          (1 + AUTO_EXPAND_DELAY) * 1000,
        );
      },
    },
  });

  tl4
    .fromTo(
      ".fourth-section h1 span",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, stagger: 0.05 },
    )
    .fromTo(
      ".sec4-images img",
      { y: 100, opacity: 0, rotation: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: (i) => (i - 3.5) * 3,
        duration: 1.2,
        stagger: 0.08,
        ease: "back.out(1.7)",
      },
      "-=0.5",
    );

  // =========================================================
  // 3. AUTO-EXPAND FUNCTION (4 images)
  // =========================================================
  function autoExpandImages(containerClass) {
    const container = $(containerClass);
    const images = container.find("img");

    // Check if already expanded
    if (container.data("expanded")) return;

    // Mark as expanded
    container.data("expanded", true);

    // EXPAND TO GRID - Each image is 280px wide
    gsap.to(images, {
      rotation: (i) => (i % 2 === 0 ? -2 : 2),
      x: (i) => {
        if (isMobile) {
          // Mobile: 2x2 grid, images are 220px wide
          return i % 2 === 0 ? -120 : 120;
        } else {
          // Desktop: horizontal line, 4 images
          // Spacing: 300px apart to prevent overlap (280px width + 20px gap)
          return (i - 1.5) * 300;
        }
      },
      y: (i) => {
        if (isMobile) {
          // Mobile: 2x2 grid, images are 280px tall
          return i < 2 ? -150 : 150;
        }
        return 0;
      },
      scale: 1.1,
      zIndex: (i) => 10 + i,
      duration: 0.6,
      ease: "power2.out",
    });
  }

  // =========================================================
  // AUTO-EXPAND FUNCTION FOR 8 IMAGES (Fourth Section)
  // =========================================================
  function autoExpandImages8(containerClass) {
    const container = $(containerClass);
    const images = container.find("img");

    // Check if already expanded
    if (container.data("expanded")) return;

    // Mark as expanded
    container.data("expanded", true);

    // EXPAND TO 4x2 GRID (8 images) - no rotation, more spacing
    gsap.to(images, {
      rotation: 0, // No rotation for cleaner view
      x: (i) => {
        if (isMobile) {
          // Mobile: 2x4 grid, images are 160px wide
          const col = i % 2;
          return col === 0 ? -105 : 105; // 210px apart (160px + 50px gap)
        } else {
          // Desktop: 4x2 grid, images are 240px wide
          // Spacing: 270px apart (240px width + 30px gap)
          const col = i % 4;
          return (col - 1.5) * 270;
        }
      },
      y: (i) => {
        if (isMobile) {
          // Mobile: 2x4 grid (4 rows), images are 200px tall
          const row = Math.floor(i / 2);
          return (row - 1.5) * 230; // 230px apart (200px + 30px gap)
        } else {
          // Desktop: 4x2 grid (2 rows), images are 300px tall
          const row = Math.floor(i / 4);
          return row === 0 ? -170 : 170; // 340px apart (300px + 40px gap)
        }
      },
      scale: 1,
      zIndex: (i) => 10 + i,
      duration: 0.6,
      ease: "power2.out",
    });
  }

  // =========================================================
  // 4. INTERACTION: CLICK TO TOGGLE (Grid View)
  // =========================================================

  function setupGalleryInteraction(containerClass) {
    const container = $(containerClass);
    const stack = container.find(".img_stack");
    const images = container.find("img");

    // Click handler for the whole stack area
    stack.on("click", () => {
      const isExpanded = container.data("expanded");

      if (!isExpanded) {
        // EXPAND TO GRID
        container.data("expanded", true);
        gsap.to(images, {
          rotation: (i) => (i % 2 === 0 ? -2 : 2),
          x: (i) => {
            if (isMobile) {
              return i % 2 === 0 ? -120 : 120;
            } else {
              return (i - 1.5) * 300;
            }
          },
          y: (i) => {
            if (isMobile) {
              return i < 2 ? -150 : 150;
            }
            return 0;
          },
          scale: 1.1,
          zIndex: (i) => 10 + i,
          duration: 0.6,
          ease: "power2.out",
        });
      } else {
        // COLLAPSE BACK TO STACK
        container.data("expanded", false);
        gsap.to(images, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: (i) => (i - 1.5) * 5,
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    });

    // Hover effect (Desktop only)
    if (!isMobile) {
      stack.on("mouseenter", () => {
        if (!container.data("expanded")) {
          gsap.to(images, {
            rotation: (i) => (i - 1.5) * 12,
            duration: 0.3,
          });
        }
      });
      stack.on("mouseleave", () => {
        if (!container.data("expanded")) {
          gsap.to(images, {
            rotation: (i) => (i - 1.5) * 5,
            duration: 0.3,
          });
        }
      });
    }
  }

  // Apply to all sections
  setupGalleryInteraction(".sec1-images");
  setupGalleryInteraction(".sec2-images");
  setupGalleryInteraction(".sec3-images");
  setupGalleryInteraction8(".sec4-images");
});

// =========================================================
// INTERACTION FOR 8-IMAGE GALLERY (Fourth Section)
// =========================================================
function setupGalleryInteraction8(containerClass) {
  const container = $(containerClass);
  const stack = container.find(".img_stack");
  const images = container.find("img");
  const isMobile = window.innerWidth <= 768;

  // Click handler for the whole stack area
  stack.on("click", () => {
    const isExpanded = container.data("expanded");

    if (!isExpanded) {
      // EXPAND TO 4x2 GRID (or 2x4 on mobile) - no rotation
      container.data("expanded", true);
      gsap.to(images, {
        rotation: 0, // No rotation for cleaner view
        x: (i) => {
          if (isMobile) {
            const col = i % 2;
            return col === 0 ? -105 : 105; // 210px apart
          } else {
            const col = i % 4;
            return (col - 1.5) * 270; // 270px apart
          }
        },
        y: (i) => {
          if (isMobile) {
            const row = Math.floor(i / 2);
            return (row - 1.5) * 230; // 230px apart
          } else {
            const row = Math.floor(i / 4);
            return row === 0 ? -170 : 170; // 340px apart
          }
        },
        scale: 1,
        zIndex: (i) => 10 + i,
        duration: 0.6,
        ease: "power2.out",
      });
    } else {
      // COLLAPSE BACK TO STACK
      container.data("expanded", false);
      gsap.to(images, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: (i) => (i - 3.5) * 3,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  });

  // Hover effect (Desktop only)
  if (!isMobile) {
    stack.on("mouseenter", () => {
      if (!container.data("expanded")) {
        gsap.to(images, {
          rotation: (i) => (i - 3.5) * 8,
          duration: 0.3,
        });
      }
    });
    stack.on("mouseleave", () => {
      if (!container.data("expanded")) {
        gsap.to(images, {
          rotation: (i) => (i - 3.5) * 3,
          duration: 0.3,
        });
      }
    });
  }
}
