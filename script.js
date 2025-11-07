"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // --------------------------
    // Elements
    // --------------------------
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const menuItems = document.querySelectorAll(".menu-items li a");
    const canvas = document.getElementById("hero-canvas");

    let lastScroll = 0;

    // --------------------------
    // Navbar: scroll behaviour
    // --------------------------
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }
        lastScroll = currentScroll;
    });

    // --------------------------
    // Menu toggle (hamburger)
    // --------------------------
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");

            const icon = menuToggle.querySelector("i");
            if (!icon) return;

            icon.classList.remove("rotateClockwise", "rotateCounter");
            void icon.offsetWidth; // force reflow for animation restart

            if (navMenu.classList.contains("open")) {
                icon.classList.add("rotateClockwise");
            } else {
                icon.classList.add("rotateCounter");
            }
        });
    }

    // Close dropdown when a menu link is clicked
    menuItems.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu?.classList.remove("open");
            const icon = menuToggle?.querySelector("i");
            if (icon) icon.className = "fas fa-bars";
        });
    });

    // --------------------------
    // Smooth scroll for anchor links
    // --------------------------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const href = this.getAttribute("href");
            if (!href || href === "#") return;
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // --------------------------
    // Section reveal helpers
    // --------------------------
    const revealIfVisible = (elements, offset = 100) => {
        const windowHeight = window.innerHeight;
        elements.forEach((el) => {
            const top = el.getBoundingClientRect().top;
            if (top < windowHeight - offset) el.classList.add("visible");
        });
    };

    // About reveal
    const aboutElements = document.querySelectorAll(".about p, .about h2");
    const revealAbout = () => revealIfVisible(aboutElements);
    window.addEventListener("scroll", revealAbout);
    revealAbout();

    // General section/project reveal
    const revealElements = document.querySelectorAll("section, .project-card");
    const revealOnScroll = () => revealIfVisible(revealElements);
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    // Reveal project & contact cards (separate selector)
    const revealCards = (selector) => {
        const cards = document.querySelectorAll(selector);
        revealIfVisible(cards);
    };
    window.addEventListener("scroll", () => {
        revealCards(".project-card");
        revealCards(".contact-card");
    });
    revealCards(".project-card");
    revealCards(".contact-card");

    // --------------------------
    // Hero Canvas animation (particle nodes + lines)
    // --------------------------
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const NODE_COUNT = 60;
        const nodes = Array.from({ length: NODE_COUNT }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 1 + Math.random() * 3,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
        }));

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            nodes.forEach((node) => {
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
    // Cursor chess-piece behavior
    // --------------------------
    const cursorPiece = document.createElement("img");
    cursorPiece.classList.add("cursor-piece");
    cursorPiece.style.opacity = "0";
    document.body.appendChild(cursorPiece);

    const sectionPieces = [
        { selector: ".hero", img: "assets/images/chess/king.png" },
        { selector: "#about", img: "assets/images/chess/queen.png" },
        { selector: "#vision", img: "assets/images/chess/knight.png" },
        { selector: "#experience", img: "assets/images/chess/bishop.png" },
        { selector: "#skills", img: "assets/images/chess/rook.png" },
        { selector: "#projects", img: "assets/images/chess/rook.png" },
        { selector: "#contact", img: "assets/images/chess/pawn.png" },
    ];

    document.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        cursorPiece.style.left = `${mouseX}px`;
        cursorPiece.style.top = `${mouseY}px`;

        let pieceVisible = false;
        for (const sp of sectionPieces) {
            const sec = document.querySelector(sp.selector);
            if (!sec) continue;
            const rect = sec.getBoundingClientRect();
            if (mouseY >= rect.top && mouseY <= rect.bottom) {
                if (cursorPiece.src !== sp.img) {
                    cursorPiece.src = sp.img;
                    cursorPiece.style.opacity = "0.8";
                }
                pieceVisible = true;
                break;
            }
        }
        if (!pieceVisible) cursorPiece.style.opacity = "0";
    });

    document.addEventListener("click", () => {
        cursorPiece.classList.remove("rotateClockwise", "rotateCounter");
        void cursorPiece.offsetWidth;
        cursorPiece.classList.add(window.scrollY > lastScroll ? "rotateClockwise" : "rotateCounter");
    });

    // --------------------------
    // Mobile skills scroll arrows
    // --------------------------
    const initSkillsArrows = () => {
        const skillsBar = document.querySelector(".skills-bar");
        if (!skillsBar || window.innerWidth > 768) return;

        const leftArrow = document.createElement("div");
        leftArrow.className = "skills-arrow left";
        leftArrow.innerHTML = "&#8592;";

        const rightArrow = document.createElement("div");
        rightArrow.className = "skills-arrow right";
        rightArrow.innerHTML = "&#8594;";

        skillsBar.parentElement?.appendChild(leftArrow);
        skillsBar.parentElement?.appendChild(rightArrow);

        const scrollAmount = 120;

        leftArrow.addEventListener("click", () => {
            skillsBar.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        });
        rightArrow.addEventListener("click", () => {
            skillsBar.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });

        function updateArrowState() {
            const maxScrollLeft = skillsBar.scrollWidth - skillsBar.clientWidth;
            if (skillsBar.scrollLeft <= 0) {
                leftArrow.style.background = "black";
                leftArrow.style.cursor = "not-allowed";
            } else {
                leftArrow.style.background = "rgba(255,153,0,0.8)";
                leftArrow.style.cursor = "pointer";
            }

            if (skillsBar.scrollLeft >= maxScrollLeft - 1) {
                rightArrow.style.background = "black";
                rightArrow.style.cursor = "not-allowed";
            } else {
                rightArrow.style.background = "rgba(255,153,0,0.8)";
                rightArrow.style.cursor = "pointer";
            }
        }

        updateArrowState();
        skillsBar.addEventListener("scroll", updateArrowState);
        window.addEventListener("resize", updateArrowState);
    };

    initSkillsArrows();
});