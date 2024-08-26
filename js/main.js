// load time function
(() => {
    const loadTimeCode = document.querySelector('.load-time');

    window.addEventListener('load', () => {
        loadTimeCode.innerHTML +=
            `Page loaded in ${Math.floor(performance.mark('pageEnd').startTime * 100) / 100} ms`;
    });
})();

// active/not active nav link function
(() => {
    document.addEventListener('DOMContentLoaded', function () {
        const menuItems = document.querySelectorAll('.nav__link');
        const currentPage = document.location.pathname;

        menuItems.forEach(item => {
            if (currentPage.includes(item.getAttribute('href'))) {
                item.classList.add('nav__link-active');
            }
        });

        menuItems.forEach(item => {
            item.addEventListener('mouseover', function () {
                item.style.color = '#9c9c9c';
            });
            item.addEventListener('mouseout', function () {
                item.style.color = '';
            });
        });
    });
})();
