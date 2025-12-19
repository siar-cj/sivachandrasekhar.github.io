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
        { selector: "#education", img: "assets/images/chess/queen.png" },
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

    // --------------------------
    // Back to Top button
    // --------------------------
    (function initBackToTop() {
        const btn = document.getElementById("back-to-top");
        if (!btn) return;

        const SHOW_AT = 300;
        const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function update() {
            if (window.scrollY > SHOW_AT) {
                btn.classList.add("show");
                btn.setAttribute("aria-hidden", "false");
            } else {
                btn.classList.remove("show");
                btn.setAttribute("aria-hidden", "true");
            }
        }

        // initial state
        update();

        // listeners
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (prefersReduced) {
                window.scrollTo(0, 0);
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
            btn.blur();
        });

        // keyboard activation (Enter/Space)
        btn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                btn.click();
            }
        });

        // make button focusable for keyboard users
        btn.tabIndex = 0;
    })();

    // --------------------------
    // Chessboard animation (SVG + GSAP)
    // --------------------------
    const board = document.getElementById("chessboard");
    const piecesLayer = document.getElementById("chess-pieces");
    const paths = document.querySelectorAll(".path");
    const pathMeta = Array.from(paths).map((p) => ({
        el: p,
        length: p.getTotalLength()
    }));

    // hide all pieces initially
    gsap.set(".piece", { opacity: 0 });

    // reveal the board and paths with a simple wipe animation
    gsap.fromTo(board, { autoAlpha: 0 }, { duration: 1, autoAlpha: 1 });
    gsap.fromTo(paths, { strokeDashoffset: 100 }, { duration: 1, strokeDashoffset: 0, stagger: 0.1 });

    // --------------------------
    // Piece animations
    // --------------------------
    // create an SVG use element referencing the pawn symbol
    function makePieceElement(color = "#ffd78a") {
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#piece-pawn");
        use.setAttribute("class", "piece-breath");
        use.setAttribute("width", "28");
        use.setAttribute("height", "28");
        use.setAttribute("x", "0");
        use.setAttribute("y", "0");
        use.style.fill = color;
        use.style.stroke = "rgba(0,0,0,0.06)";
        // quicker visual feedback if supported
        use.style.opacity = "0.98";
        return use;
    }

    // piece factory (tweaked for snappier motion & smaller visuals)
    function createPieceOnPath(pathIndex, startT = 0, speed = 0.02, tint = "#ffd78a") {
        const pathEl = pathMeta[pathIndex].el;
        const pieceEl = makePieceElement(tint);
        piecesLayer.appendChild(pieceEl);

        const piece = {
            el: pieceEl,
            pathEl,
            pathIndex,
            // cluster initial positions a bit so they appear together
            t: startT + (Math.random() - 0.5) * 0.02,
            // increase base speed so motion feels snappier
            speed: speed * (1.8 + Math.random() * 0.6),
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            rotation: 0,
            vr: 0,
            // stiffer springs -> faster settle; slightly higher damping to avoid overshoot
            stiffness: (260 + Math.random() * 120) * 1.6,
            damping: (18 + Math.random() * 8) * 1.05,
            // make pieces smaller so more appear on screen simultaneously
            size: (0.9 + Math.random() * 0.25) * 0.76,
            targetScale: 1.0,
            alive: true
        };

        // initial placement
        const pt = pathPoint(pathEl, piece.t);
        piece.x = pt.x; piece.y = pt.y; piece.rotation = pt.angle;
        piece.el.setAttribute("transform", `translate(${piece.x - 14}, ${piece.y - 14}) rotate(${(piece.rotation * 180/Math.PI).toFixed(2)},14,14) scale(${piece.size})`);

        // click to pause/resume
        piece.el.addEventListener("click", (e) => {
            piece.paused = !piece.paused;
            piece.el.style.opacity = piece.paused ? 0.5 : 0.98;
        });

        return piece;
    }

    // pieces array
    const pieces = [];
    // spawn a few pieces across the three paths with varied timings (smaller + faster)
    pieces.push(createPieceOnPath(0, 0.02, 0.06, "#ffd78a")); // commit
    pieces.push(createPieceOnPath(0, 0.35, 0.05, "#ffd78a"));
    pieces.push(createPieceOnPath(1, 0.05, 0.045, "#ffcc66")); // build
    pieces.push(createPieceOnPath(2, 0.12, 0.055, "#ffc77d")); // test
    pieces.push(createPieceOnPath(1, 0.7, 0.04, "#ffd78a"));

    // quick "fast-launch" burst so pieces move into place immediately (user won't wait)
    (function fastLaunchBurst() {
        const saved = pieces.map(p => p.speed);
        // briefly accelerate all pieces
        pieces.forEach(p => p.speed = Math.max(0.08, p.speed * 3.0));
        // after short burst, restore more moderate speeds
        setTimeout(() => {
            pieces.forEach((p, i) => p.speed = saved[i] * 1.25); // slightly faster than original
        }, 360); // 300-420ms feels snappy
    })();
});