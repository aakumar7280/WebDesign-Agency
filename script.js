/* ============================================================
   WEBITEE — JavaScript
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
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
