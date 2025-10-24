document.addEventListener("DOMContentLoaded", () => {
  // --------------------------
  // Navbar toggle + scroll logic
  // --------------------------
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const menuItems = document.querySelectorAll(".menu-items li a");

  // Track scroll
  let lastScroll = 0;

  // Scroll: add/remove 'scrolled' class, horizontal menu visibility
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add("scrolled"); // show toggle, hide horizontal menu
    } else {
      navbar.classList.remove("scrolled"); // restore horizontal menu
    }
    lastScroll = currentScroll;
  });

  // Toggle hamburger menu dropdown
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open"); // toggle dropdown
    const icon = menuToggle.querySelector("i");
    if (!icon) return;

    // Reset rotation classes
    icon.classList.remove("rotateClockwise", "rotateCounter");
    void icon.offsetWidth; // force reflow

    if (navMenu.classList.contains("open")) {
      icon.classList.add("rotateClockwise"); // rotate when open
    } else {
      icon.classList.add("rotateCounter"); // rotate when closed
    }
  });

  // Close dropdown when a menu link is clicked
  menuItems.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      const icon = menuToggle.querySelector("i");
      if (icon) icon.className = "fas fa-bars"; // reset icon
    });
  });

  // --------------------------
  // Smooth scroll for anchor links
  // --------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  // --------------------------
  // About section reveal
  // --------------------------
  const aboutElements = document.querySelectorAll(".about p, .about h2");
  function revealAbout() {
    const windowHeight = window.innerHeight;
    aboutElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight - 100) el.classList.add("visible");
    });
  }
  window.addEventListener("scroll", revealAbout);
  revealAbout();

  // --------------------------
  // Fade-in for sections and project cards
  // --------------------------
  const revealElements = document.querySelectorAll("section, .project-card");
  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight - 100) el.classList.add("visible");
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // --------------------------
  // Hero Canvas - AWS Cloud Nodes
  // --------------------------
  const canvas = document.getElementById("hero-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const nodes = [];
    const NODE_COUNT = 60;
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
      });
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,153,0,0.6)";
        ctx.fill();
      });

      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,153,0,${1 - dist / 120})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  // --------------------------
  // Chess piece / cursor behavior
  // --------------------------
  const cursorPiece = document.createElement("img");
  cursorPiece.classList.add("cursor-piece");
  cursorPiece.style.opacity = 0;
  document.body.appendChild(cursorPiece);

  const sectionPieces = [
    { selector: ".hero", img: "assets/images/chess/king.png" },
    { selector: "#about", img: "assets/images/chess/queen.png" },
    { selector: "#vision", img: "assets/images/chess/knight.png" },
    { selector: "#experience", img: "assets/images/chess/bishop.png" },
    { selector: "#skills", img: "assets/images/chess/rook.png" },
    { selector: "#projects", img: "assets/images/chess/rook.png" },
    { selector: "#contact", img: "assets/images/chess/pawn.png" }
  ];

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    cursorPiece.style.left = `${mouseX}px`;
    cursorPiece.style.top = `${mouseY}px`;

    let pieceVisible = false;
    for (let sp of sectionPieces) {
      const sec = document.querySelector(sp.selector);
      if (sec) {
        const rect = sec.getBoundingClientRect();
        if (mouseY >= rect.top && mouseY <= rect.bottom) {
          if (cursorPiece.src !== sp.img) {
            cursorPiece.src = sp.img;
            cursorPiece.style.opacity = 0.8;
          }
          pieceVisible = true;
          break;
        }
      }
    }
    if (!pieceVisible) cursorPiece.style.opacity = 0;
  });

  document.addEventListener("click", () => {
    cursorPiece.classList.remove("rotateClockwise", "rotateCounter");
    void cursorPiece.offsetWidth;
    cursorPiece.classList.add(window.scrollY > lastScroll ? "rotateClockwise" : "rotateCounter");
  });

  // --------------------------
  // Reveal project & contact cards
  // --------------------------
  const revealCards = (selector) => {
    const cards = document.querySelectorAll(selector);
    const windowHeight = window.innerHeight;
    cards.forEach(card => {
      const top = card.getBoundingClientRect().top;
      if (top < windowHeight - 100) card.classList.add("visible");
    });
  };
  window.addEventListener("scroll", () => {
    revealCards(".project-card");
    revealCards(".contact-card");
  });
  revealCards(".project-card");
  revealCards(".contact-card");
});

// Mobile skills scroll arrows
const skillsBar = document.querySelector('.skills-bar');

if (window.innerWidth <= 768 && skillsBar) {
  const leftArrow = document.createElement('div');
  leftArrow.className = 'skills-arrow left';
  leftArrow.innerHTML = '&#8592;';
  const rightArrow = document.createElement('div');
  rightArrow.className = 'skills-arrow right';
  rightArrow.innerHTML = '&#8594;';

  skillsBar.parentElement.appendChild(leftArrow);
  skillsBar.parentElement.appendChild(rightArrow);

  const scrollAmount = 120; // amount to scroll per click

  // Scroll on arrow click
  leftArrow.addEventListener('click', () => {
    skillsBar.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  rightArrow.addEventListener('click', () => {
    skillsBar.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Update arrow state based on scroll
  function updateArrowState() {
    const maxScrollLeft = skillsBar.scrollWidth - skillsBar.clientWidth;
    if (skillsBar.scrollLeft <= 0) {
      leftArrow.style.background = 'black';   // at left, disable left arrow
      leftArrow.style.cursor = 'not-allowed';
    } else {
      leftArrow.style.background = 'rgba(255,153,0,0.8)';
      leftArrow.style.cursor = 'pointer';
    }

    if (skillsBar.scrollLeft >= maxScrollLeft - 1) { // -1 for rounding
      rightArrow.style.background = 'black';        // at right, disable right arrow
      rightArrow.style.cursor = 'not-allowed';
    } else {
      rightArrow.style.background = 'rgba(255,153,0,0.8)';
      rightArrow.style.cursor = 'pointer';
    }
  }

  // Initial check
  updateArrowState();

  // Update on scroll
  skillsBar.addEventListener('scroll', updateArrowState);
}
