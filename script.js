// ============================
//       Navigation bar
// ============================
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  menuToggle.classList.toggle("rotated");

  // Toggle icon between bars and close
  const icon = menuToggle.querySelector("i");
  if (navMenu.classList.contains("open")) {
    icon.classList.replace("fa-bars", "fa-times");
  } else {
    icon.classList.replace("fa-times", "fa-bars");
  }
});


// ============================
// Smooth scroll for anchor links
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// ============================
// Smooth scroll for About section
// ============================
const aboutElements = document.querySelectorAll(".about p, .about h2");

function revealAbout() {
  const windowHeight = window.innerHeight;
  aboutElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 100) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealAbout);
revealAbout();

// ============================
// Fade-in on scroll for sections and project cards
// ============================
const revealElements = document.querySelectorAll("section, .project-card");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 100) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // run on load

// ============================
// Hero Canvas - AWS Cloud Nodes
// ============================
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

    // Draw nodes
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,153,0,0.6)"; // AWS glow
      ctx.fill();
    });

    // Draw connecting lines
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

// Chess piece / logo cursor
const cursorPiece = document.createElement("img");
cursorPiece.classList.add("cursor-piece");
cursorPiece.style.opacity = 0;  // hide initially
document.body.appendChild(cursorPiece);

// Map sections to cursor images (paths relative to /js folder)
const sectionPieces = [
  { selector: ".hero", img: "assets/images/chess/king.png" },
  { selector: "#about", img: "assets/images/chess/queen.png" },
  { selector: "#vision", img: "assets/images/chess/knight.png" },
  { selector: "#experience", img: "assets/images/chess/bishop.png" },
  { selector: "#skills", img: "assets/images/chess/rook.png" },
  { selector: "#projects", img: "assets/images/chess/rook.png" },
  { selector: "#contact", img: "assets/images/chess/pawn.png" }
];

let mouseX = 0, mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Position the chess/logo piece
  cursorPiece.style.left = `${mouseX}px`;
  cursorPiece.style.top = `${mouseY}px`;

  // Determine current section
  let pieceVisible = false;
  for (let sp of sectionPieces) {
    const sec = document.querySelector(sp.selector);
    if (sec) {
      const rect = sec.getBoundingClientRect();
      if (mouseY >= rect.top && mouseY <= rect.bottom) {
        if (cursorPiece.src !== sp.img) {
          cursorPiece.src = sp.img;
          cursorPiece.style.opacity = 0.8; // show when active
        }
        pieceVisible = true;
        break;
      }
    }
  }

  if (!pieceVisible) {
    cursorPiece.style.opacity = 0; // hide outside sections
  }
});

// Disable default pointer
document.body.style.cursor = "none";

// Rotate chess piece on click
document.addEventListener("click", () => {
  if (cursorPiece) {
    cursorPiece.classList.remove("rotate"); // reset if already rotating
    void cursorPiece.offsetWidth; // force reflow to restart animation
    cursorPiece.classList.add("rotate");
  }
});

// Completely hide default pointer
document.body.style.cursor = "none";
document.querySelectorAll("*").forEach(el => (el.style.cursor = "none"));

let lastScroll = window.scrollY;
let scrollDirection = "down"; // default

// Detect scroll direction
window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  scrollDirection = currentScroll > lastScroll ? "down" : "up";
  lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

// Rotate chess piece on click depending on scroll direction
document.addEventListener("click", () => {
  if (cursorPiece) {
    cursorPiece.classList.remove("rotateClockwise", "rotateCounter");
    void cursorPiece.offsetWidth; // reflow trick to restart animation

    if (scrollDirection === "down") {
      cursorPiece.classList.add("rotateClockwise");
    } else {
      cursorPiece.classList.add("rotateCounter");
    }
  }
});

// Scroll reveal animation for project cards
const projectCards = document.querySelectorAll(".project-card");

function revealProjects() {
  const windowHeight = window.innerHeight;
  projectCards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if (top < windowHeight - 100) {
      card.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealProjects);
revealProjects(); // initial trigger

// Contact section reveal animation
const contactCards = document.querySelectorAll(".contact-card");

function revealContacts() {
  const windowHeight = window.innerHeight;
  contactCards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if (top < windowHeight - 100) {
      card.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealContacts);
revealContacts(); // trigger once on load