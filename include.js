document.addEventListener("DOMContentLoaded", function () {
    // ពិនិត្យមើលថាតើទំពរបច្ចុប្បន្នស្ថិតក្នុងថត ror (folder) ណាមួយ ដូចជា pages ឬ html-page
    const pathName = window.location.pathname;
    const isSubFolder = pathName.includes('/pages/') || pathName.includes('/html-page/');

    // ១. ទាញយក header.html (បើស្ថិតក្នុងថតរង ត្រូវថយក្រោយ ../header.html បើនៅថតមេ ប្រើ header.html ធម្មតា)
    const headerUrl = isSubFolder ? "../header.html" : "header.html";

    fetch(headerUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;

                // បើស្ថិតក្នុងថតរង សូមកែតម្រូវ Links និង Images ក្នុង Header ឱ្យថយក្រោយមួយកម្រិត (../) ស្វ័យប្រវត្តិ
                if (isSubFolder) {
                    const links = headerPlaceholder.querySelectorAll("a");
                    links.forEach(link => {
                        let href = link.getAttribute("href");
                        if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("tel:") && !href.startsWith("mailto:")) {
                            if (!href.startsWith("../")) {
                                link.setAttribute("href", "../" + href);
                            }
                        }
                    });

                    const images = headerPlaceholder.querySelectorAll("img");
                    images.forEach(img => {
                        let src = img.getAttribute("src");
                        if (src && !src.startsWith("http") && !src.startsWith("../")) {
                            img.setAttribute("src", "../" + src);
                        }
                    });
                }

                initHeaderScript();
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // ២. ទាញយក footer.html
    const footerUrl = isSubFolder ? "../footer.html" : "footer.html";

    fetch(footerUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;

                if (isSubFolder) {
                    const footerLinks = footerPlaceholder.querySelectorAll("a");
                    footerLinks.forEach(link => {
                        let href = link.getAttribute("href");
                        if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("tel:") && !href.startsWith("mailto:")) {
                            if (!href.startsWith("../")) {
                                link.setAttribute("href", "../" + href);
                            }
                        }
                    });
                }
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});

// មុខងារគ្រប់គ្រង Search Modal, Mobile Menu និង Dropdown ក្នុង Header
function initHeaderScript() {
    const openSearchModal = document.getElementById('openSearchModal');
    const searchModalOverlay = document.getElementById('searchModalOverlay');
    const searchCloseModal = document.getElementById('searchCloseModal');
    const liveSearchInput = document.getElementById('liveSearchInput');

    if (openSearchModal && searchModalOverlay) {
        openSearchModal.addEventListener('click', (e) => {
            e.preventDefault();
            searchModalOverlay.style.display = 'flex';
            if (liveSearchInput) liveSearchInput.focus();
        });
    }

    if (searchCloseModal && searchModalOverlay) {
        searchCloseModal.addEventListener('click', () => {
            searchModalOverlay.style.display = 'none';
        });
    }

    if (searchModalOverlay) {
        searchModalOverlay.addEventListener('click', (e) => {
            if (e.target === searchModalOverlay) {
                searchModalOverlay.style.display = 'none';
            }
        });
    }

    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const menuIcon = document.getElementById('menuIcon');

    if (menuToggle && navMenu && menuIcon) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');

            if (navMenu.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            } else {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
        });
    }

    const dropdowns = document.querySelectorAll('.apple-nav .dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        if (dropbtn) {
            dropbtn.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('open');
                }
            });
        }
    });
}