document.addEventListener("DOMContentLoaded", function() {
    // ប្រើ Path ត្រឹមត្រូវទៅកាន់ footer/footer.html
    fetch('footer/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // ស្វែងរកកន្លែងដែលមាន id="footer-placeholder"
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if(footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            } else {
                // បើគ្មាន placeholder ទេ វា會យកមកដាក់ต่อท้ายគេបង្អស់ក្នុង body
                document.body.insertAdjacentHTML('beforeend', data);
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});