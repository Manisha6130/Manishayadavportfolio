"use strict";

(() => {
  const config = CONFIG;
  const fallbackOutcome = "Results available on request";

  function setLink(element, url, { newTab = false } = {}) {
    if (!url) {
      element.hidden = true;
      element.removeAttribute("href");
      return;
    }

    element.href = url;
    element.hidden = false;
    if (newTab) {
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    }
  }

  document.querySelectorAll("[data-portfolio-link]").forEach((link) => {
    setLink(link, config.portfolioDocUrl.trim(), { newTab: true });
  });
  document.querySelectorAll("[data-case-study]").forEach((link) => {
    setLink(link, config[link.dataset.caseStudy].trim(), { newTab: true });
  });

  document.querySelectorAll("[data-outcome]").forEach((element) => {
    const outcomeKey = element.dataset.outcome;
    element.textContent = config[outcomeKey]?.trim() || fallbackOutcome;
  });

  const timeframe = config.timeframe.trim() || "30 days";
  document.querySelectorAll("[data-timeframe]").forEach((element) => {
    element.textContent = timeframe;
  });

  const emailLink = document.querySelector("[data-email-link]");
  const email = config.email.trim();
  if (email) {
    emailLink.href = `mailto:${email}`;
    emailLink.textContent = email;
    emailLink.hidden = false;
  }
  document.querySelectorAll("[data-email-cta]").forEach((link) => {
    setLink(link, email
      ? `mailto:${email}?subject=${encodeURIComponent("Let's work together")}&body=${encodeURIComponent("Hi Manisha,\\n\\nI'd like to discuss a project with you.")}`
      : "");
  });

  const whatsappNumber = config.whatsappNumber.trim().replace(/\D/g, "");
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Manisha, I'd like to discuss a project with you.")}`
    : "";
  document.querySelectorAll("[data-whatsapp-cta]").forEach((link) => {
    setLink(link, whatsappUrl, { newTab: true });
  });

  document.querySelectorAll("[data-contact-email]").forEach((link) => {
    if (email) {
      link.href = `mailto:${email}`;
      link.textContent = email;
    } else {
      link.hidden = true;
    }
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: "Manisha Yadav",
        jobTitle: "Performance Marketing & Content Freelancer",
        areaServed: "Mumbai",
        email: email ? `mailto:${email}` : undefined
      },
      {
        "@type": "ProfessionalService",
        name: "Manisha Yadav — Performance Marketing & Content",
        areaServed: "Mumbai",
        email: email ? `mailto:${email}` : undefined
      }
    ]
  };
  const schemaScript = document.createElement("script");
  schemaScript.type = "application/ld+json";
  schemaScript.textContent = JSON.stringify(structuredData);
  document.head.append(schemaScript);

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const desktopQuery = window.matchMedia("(min-width: 768px)");

  function syncNavigationForViewport() {
    if (desktopQuery.matches) {
      navigation.hidden = false;
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    } else {
      navigation.hidden = true;
    }
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.hidden = isOpen;
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!desktopQuery.matches) {
        navigation.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });
  });

  desktopQuery.addEventListener("change", syncNavigationForViewport);
  syncNavigationForViewport();

  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  const sectionLinks = new Map(
    navLinks.map((link) => [link.hash.slice(1), link])
  );
  const sections = [...sectionLinks.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => link.removeAttribute("aria-current"));
      sectionLinks.get(entry.target.id)?.setAttribute("aria-current", "location");
    });
  }, {
    rootMargin: "-25% 0px -65% 0px",
    threshold: 0
  });
  sections.forEach((section) => sectionObserver.observe(section));
})();
