// js/navbar.js
fetch('navbar.html')
  .then(response => response.text())
  .then(html => {
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = html;

    const path = window.location.pathname;
    const currentPage = path.substring(path.lastIndexOf("/") + 1);
    const links = navbar.querySelectorAll('.nav-link');

    links.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
