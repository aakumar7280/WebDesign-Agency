/* ============================================================
   WEBITEE — JavaScript
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- HERO PARTICLE NETWORK ---------- */
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };
  let animId;

  function resizeCanvas() {
    const hero = canvas.parentElement;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  canvas.parentElement.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.baseSpeedX = (Math.random() - 0.5) * 0.4;
      this.baseSpeedY = (Math.random() - 0.5) * 0.4;
      this.speedX = this.baseSpeedX;
      this.speedY = this.baseSpeedY;
      this.opacity = Math.random() * 0.5 + 0.15;
    }

    update() {
      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.speedX += (dx / dist) * force * 0.8;
          this.speedY += (dy / dist) * force * 0.8;
        }
      }

      // Dampen back to base speed
      this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
      this.speedY += (this.baseSpeedY - this.speedY) * 0.05;

      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 166, 251, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const area = canvas.width * canvas.height;
    const count = Math.min(Math.floor(area / 8000), 120);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 140;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 166, 251, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    animId = requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // Re-init particles on resize
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animId);
    initParticles();
    animateParticles();
  });

  /* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.getElementById("navbar");

  const handleScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  };

  window.addEventListener("scroll", handleScroll);

  /* ---------- MOBILE NAV TOGGLE ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });

  /* ---------- SMOOTH SCROLL (fallback for Safari) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- SCROLL ANIMATIONS ---------- */
  const animatedElements = document.querySelectorAll("[data-animate]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedElements.forEach((el) => observer.observe(el));

  /* ---------- STAT COUNTER ---------- */
  const statNumbers = document.querySelectorAll(".stat-number");

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          // Ease-out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * ease);
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => countObserver.observe(el));

  /* ---------- CONTACT FORM ---------- */
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccess");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Simple validation check (HTML5 handles most)
    if (!form.checkValidity()) return;

    // Show success message
    successMsg.classList.add("visible");
    form.reset();

    // Hide message after 4 seconds
    setTimeout(() => {
      successMsg.classList.remove("visible");
    }, 4000);
  });

  /* ---------- PROJECT BROWSER TILT EFFECT ---------- */
  const tiltEls = document.querySelectorAll("[data-tilt]");

  tiltEls.forEach((el) => {
    const maxTilt = 6; // degrees

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = -y * maxTilt;
      const rotateY = x * maxTilt;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
    });
  });

  /* ---------- ACTIVE NAV HIGHLIGHT ---------- */
  const sections = document.querySelectorAll("section[id]");

  const highlightNav = () => {
    const scrollY = window.scrollY + navbar.offsetHeight + 50;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      const link = navLinks.querySelector(`a[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add("active-link");
        } else {
          link.classList.remove("active-link");
        }
      }
    });
  };

  window.addEventListener("scroll", highlightNav);
});
