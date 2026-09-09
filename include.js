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

// មុខងារគ្រប់គ្រង Search Modal និង Button ផ្សេងៗក្នុង Header
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
}