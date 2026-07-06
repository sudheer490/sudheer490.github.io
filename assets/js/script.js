$(document).ready(function () {
  const menu = $('#menu');
  const navbar = $('.navbar');

  menu.on('click', function () {
    menu.toggleClass('fa-times');
    navbar.toggleClass('nav-toggle');
    menu.attr('aria-expanded', navbar.hasClass('nav-toggle'));
  });

  $(window).on('scroll load', function () {
    menu.removeClass('fa-times').attr('aria-expanded', 'false');
    navbar.removeClass('nav-toggle');
    $('#scroll-top').toggleClass('active', window.scrollY > 500);

    $('main section[id]').each(function () {
      const top = $(window).scrollTop();
      const offset = $(this).offset().top - 180;
      if (top >= offset && top < offset + $(this).outerHeight()) {
        $('.navbar a').removeClass('active');
        $('.navbar a[href=\'#' + this.id + '\']').addClass('active');
      }
    });
  });

  $('a[href^=\'#\']').on('click', function (event) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

if (window.Typed) {
  new Typed('.typing-text', {
    strings: ['Data Scientist', 'AI Engineer', 'GenAI / RAG Developer', 'Machine Learning Engineer'],
    loop: true, typeSpeed: 65, backSpeed: 40, backDelay: 1400
  });
}

async function loadSkills() {
  const container = document.getElementById('skillsContainer');
  try {
    const response = await fetch('./skills.json');
    if (!response.ok) throw new Error('Unable to load skills');
    const skills = await response.json();
    const groups = skills.reduce((result, skill) => {
      (result[skill.category] ||= []).push(skill);
      return result;
    }, {});

    container.innerHTML = Object.entries(groups).map(([category, items]) => `
      <section class='skill-group' aria-labelledby='${category.replace(/[^a-z0-9]/gi, '-').toLowerCase()}'>
        <h3 id='${category.replace(/[^a-z0-9]/gi, '-').toLowerCase()}'>${category}</h3>
        <div class='skill-grid'>${items.map(skill => `
          <div class='bar'><div class='info'>
            <img src='${skill.icon}' alt='' width='25' height='25' loading='lazy'>
            <span>${skill.name}</span>
          </div></div>`).join('')}</div>
      </section>`).join('');
  } catch (error) {
    container.innerHTML = '<p>Skills are available on my resume.</p>';
    console.error(error);
  }
}

loadSkills();
document.getElementById('year').textContent = new Date().getFullYear();

if (window.ScrollReveal && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = ScrollReveal({ origin: 'bottom', distance: '30px', duration: 700, interval: 80, reset: false });
  reveal.reveal('.section-intro, .about-grid, .work .box, .experience .container, .skill-group, .education .box');
}
