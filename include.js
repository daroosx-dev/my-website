document.addEventListener("DOMContentLoaded", function () {
    // ១. ទាញយក header.html មកដាក់ចូល #header-placeholder
    fetch('header.html')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initHeaderScript();
        })
        .catch(error => console.error('Error loading header:', error));

    // ២. ទាញយក footer.html មកដាក់ចូល #footer-placeholder
    fetch('footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});

// មុខងារគ្រប់គ្រង Search Modal, Mobile Menu និង Dropdown ក្នុង Header
function initHeaderScript() {
    // ផ្នែក Search Modal
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

    // ផ្នែក Mobile Menu Toggle (ប៊ូតុងបីឆ្នូតលើទូរស័ព្ទ)
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

    // ផ្នែក Dropdown ពេលស្ថិតនៅលើទូរស័ព្ទ (Screen ≤ 992px)
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