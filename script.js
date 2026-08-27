let allProducts = [];

// Fetch data from products.json
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        allProducts = data;
        renderProducts(allProducts); // បង្ហាញផលិតផលទាំងអស់ពេលចូលដំបូង (Store)
    })
    .catch(error => console.error('Error loading products.json:', error));

// Render Products Function (កែលម្អល្បឿនដោយប្រើ DocumentFragment)
function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    // សម្អាតទិន្នន័យចាស់ចេញជាមុន
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #777;">រកមិនឃើញផលិតផលដែលអ្នកកំពុងស្វែងរកឡើយ។</p>';
        return;
    }

    // ប្រើប្រាស់ DocumentFragment ដើម្បីបង្កើនល្បឿន Render មិនឱ្យគាំង Browser
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        // Color Bar HTML
        let colorBarHTML = '';
        if (product.color_bar_type === 'cmyk') {
            colorBarHTML = `
                <div class="cmyk-bar">
                    <span class="c-black"></span>
                    <span class="c-cyan"></span>
                    <span class="c-magenta"></span>
                    <span class="c-yellow"></span>
                </div>
            `;
        } else {
            colorBarHTML = `
                <div class="cmyk-bar">
                    <span class="c-black" style="flex: 1;"></span>
                </div>
            `;
        }

        // Tags HTML
        let tagsHTML = '';
        if (product.tags && product.tags.length > 0) {
            product.tags.forEach(tag => {
                tagsHTML += `<span class="tag-item">✓ ${tag}</span>`;
            });
        }

        // Card Element Creation
        const cardDiv = document.createElement('div');
        cardDiv.className = 'product-card';
        
        cardDiv.innerHTML = `
            <div>
                <div class="brand-logo-text">${product.brand || ''}</div>
                <div class="card-img" data-id="${product.id}">
                    <img src="${product.images && product.images.length > 0 ? product.images[0] : 'images/default.png'}" alt="${product.name}">
                </div>
                <div class="product-title" data-id="${product.id}">${product.name}</div>
                <div class="price">${product.price}</div>

                <div class="tag-list">
                    ${tagsHTML}
                </div>

                ${colorBarHTML}

                <table class="specs-table">
                    <tr>
                        <td class="label">Machine Type</td>
                        <td class="colon">:</td>
                        <td class="value">${product.machine_type || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="label">Functions</td>
                        <td class="colon">:</td>
                        <td class="value">${product.functions || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="label">Copier Type</td>
                        <td class="colon">:</td>
                        <td class="value">${product.copier_type || 'N/A'}</td>
                    </tr>
                </table>
            </div>

            <div class="card-actions">
                <button class="btn-detail" data-id="${product.id}">Detail</button>
            </div>
        `;

        // Event Listener សុវត្ថិភាពជាងការប្រើ inline onclick
        cardDiv.querySelector('.card-img').addEventListener('click', () => viewDetail(product.id));
        cardDiv.querySelector('.product-title').addEventListener('click', () => viewDetail(product.id));
        cardDiv.querySelector('.btn-detail').addEventListener('click', () => viewDetail(product.id));

        fragment.appendChild(cardDiv);
    });

    // បញ្ចូលម្ដងទាំងអស់គ្នា ធ្វើឱ្យល្បឿនលឿនជាងមុនឆ្ងាយណាស់
    grid.appendChild(fragment);
}

// Search functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        const filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(keyword) || 
            (p.brand && p.brand.toLowerCase().includes(keyword)) ||
            (p.machine_type && p.machine_type.toLowerCase().includes(keyword)) ||
            (p.category && p.category.toLowerCase().includes(keyword))
        );
        renderProducts(filtered);
    });
}

// Filter functionality
const filterButtons = document.querySelectorAll('.filter-trigger, .filter-btn, .dropdown-content a, .dropdown-menu a, nav a');
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        let filterValue = e.currentTarget.getAttribute('data-filter') || e.currentTarget.textContent.trim();
        
        if (!filterValue) return;
        const keyword = filterValue.toLowerCase().trim();

        if (keyword === 'all' || keyword === 'store' || keyword === 'ទំនិញទាំងអស់') {
            renderProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p => {
                const pBrand = p.brand ? p.brand.toLowerCase() : '';
                const pCat = p.category ? p.category.toLowerCase() : '';
                const pType = p.type ? p.type.toLowerCase() : '';
                const pMachine = p.machine_type ? p.machine_type.toLowerCase() : '';
                const pCopier = p.copier_type ? p.copier_type.toLowerCase() : '';
                const pName = p.name ? p.name.toLowerCase() : '';
                
                const keywords = keyword.split(' ');
                
                return keywords.every(kw => 
                    pBrand.includes(kw) || 
                    pCat.includes(kw) || 
                    pType.includes(kw) || 
                    pMachine.includes(kw) || 
                    pCopier.includes(kw) ||
                    pName.includes(kw)
                );
            });
            
            renderProducts(filtered);
        }
    });
});

// View Detail Redirect Function
function viewDetail(id) {
    window.location.href = `pages/single-product.html?id=${id}`;
}
