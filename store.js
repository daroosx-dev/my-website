let allProducts = [];

// Fetch data from products.json
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        allProducts = data;
        renderProducts(allProducts); 
    })
    .catch(error => console.error('Error loading products.json:', error));

// មុខងារបង្ខំឱ្យអក្សរដិតខ្លាំង ១០០% គ្រប់តម្លៃទាំងអស់
function forceBoldSpecs() {
    const valueCells = document.querySelectorAll('.specs-table td');
    valueCells.forEach(cell => {
        // រើសយកតែ td ណាដែលនៅខាងស្តាំ (រំលង label និង colon)
        if (!cell.classList.contains('label') && !cell.classList.contains('colon')) {
            cell.style.setProperty('font-weight', '800', 'important');
            cell.style.setProperty('color', '#0f172a', 'important');
        }
    });
}

// Render Products Function
function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #777;">រកមិនឃើញផលិតផលដែលអ្នកកំពុងស្វែងរកឡើយ។</p>';
        return;
    }

    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        let colorBarHTML = '';
        if (product.color_bar_type === 'cmyklmlc') {
            colorBarHTML = `
                <div class="cmyk-bar">
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                </div>
            `;
        } else if (product.color_bar_type === '12-color') {
            colorBarHTML = `
                <div class="cmyk-bar">
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                </div>
            `;
        } else if (product.color_bar_type === 'cmyk') {
            colorBarHTML = `
                <div class="cmyk-bar">
                    <span></span><span></span><span></span><span></span>
                </div>
            `;
        } else {
            colorBarHTML = `
                <div class="cmyk-bar">
                    <span style="flex: 1; background: #000000;"></span>
                </div>
            `;
        }

        let tagsHTML = '';
        if (product.tags && product.tags.length > 0) {
            product.tags.forEach(tag => {
                tagsHTML += `<span class="tag-item">✓ ${tag}</span>`;
            });
        }

        const cardDiv = document.createElement('div');
        cardDiv.className = 'product-card';
        
        // 🟢 បន្ថែម class="value" ចូលទៅក្នុង td ខាងស្តាំចំៗទីតាំងនេះ
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
                        <td class="value" style="font-weight: 800 !important; color: #0f172a !important;">${product.machine_type || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="label">Functions</td>
                        <td class="colon">:</td>
                        <td class="value" style="font-weight: 800 !important; color: #0f172a !important;">${product.functions || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="label">Copier Type</td>
                        <td class="colon">:</td>
                        <td class="value" style="font-weight: 800 !important; color: #0f172a !important;">${product.copier_type || 'N/A'}</td>
                    </tr>
                </table>
            </div>

            <div class="card-actions">
                <button class="btn-detail" data-id="${product.id}">Detail</button>
            </div>
        `;

        cardDiv.querySelector('.card-img').addEventListener('click', () => viewDetail(product.id));
        cardDiv.querySelector('.product-title').addEventListener('click', () => viewDetail(product.id));
        cardDiv.querySelector('.btn-detail').addEventListener('click', () => viewDetail(product.id));

        fragment.appendChild(cardDiv);
    });

    grid.appendChild(fragment);

    // ហៅមុខងារបង្ខំឱ្យអក្សរដិតខ្លាំងភ្លាមៗក្រោយពេល Render ចប់
    setTimeout(forceBoldSpecs, 10);
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