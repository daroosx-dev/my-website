document.addEventListener("DOMContentLoaded", function() {
    // ឧទាហរណ៍៖ ប្រសិនបើហ្វាល include.js នៅខាងក្នុងថត footer/ ហើយចង់ទាញយក footer.html មកដាក់
    fetch('footer/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // ស្វែងរកកន្លែងដែលមាន id="footer-placeholder" ឬ id="footer" ដើម្បីទម្លាក់កូដចុះក្រោម
            const footerPlaceholder = document.getElementById('footer-placeholder') || document.body;
            if(document.getElementById('footer-placeholder')) {
                document.getElementById('footer-placeholder').innerHTML = data;
            } else {
                // បើគ្មាន placeholder ទេ វា會យកមកដាក់ต่อท้ายគេបង្អស់ក្នុង body
                document.body.insertAdjacentHTML('beforeend', data);
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});