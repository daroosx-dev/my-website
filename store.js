let allProducts = [];

// Fetch data from products.json
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        allProducts = data;
        renderHomeSections(allProducts); 
    })
    .catch(error => console.error('Error loading products.json:', error));

// មុខងារបង្ខំឱ្យអក្សរដិតខ្លាំង ១០០% គ្រប់តម្លៃទាំងអស់
function forceBoldSpecs() {
    const valueCells = document.querySelectorAll('.specs-table td');
    valueCells.forEach(cell => {
        if (!cell.classList.contains('label') && !cell.classList.contains('colon')) {
            cell.style.setProperty('font-weight', '800', 'important');
            cell.style.setProperty('color', '#0f172a', 'important');
        }
    });
}

// មុខងារបង្កើត HTML សម្រាប់ Product Card នីមួយៗ (គាំទ្រគ្រប់ប្រភេទពណ៌ទាំងអស់)
function createProductCardHTML(product) {
    let colorBarHTML = '';
    
    if (product.color_bar_type === 'cmyklmlc') {
        // ៦ ពណ៌ (CMYK + Light Cyan + Light Magenta)
        colorBarHTML = `
            <div class="cmyk-bar">
                <span style="background: #000000;"></span>
                <span style="background: #0088ff;"></span>
                <span style="background: #ff0088;"></span>
                <span style="background: #ffee00;"></span>
                <span style="background: #00ffff;"></span>
                <span style="background: #ff00ff;"></span>
            </div>
        `;
    } else if (product.color_bar_type === '12-color') {
        // ១២ ពណ៌សម្រាប់ម៉ាស៊ីន ផ្លូតទ័រ អាជីព
        colorBarHTML = `
            <div class="cmyk-bar">
                <span style="background: #000000;"></span>
                <span style="background: #333333;"></span>
                <span style="background: #0088ff;"></span>
                <span style="background: #00ffff;"></span>
                <span style="background: #ff0088;"></span>
                <span style="background: #ff00ff;"></span>
                <span style="background: #ffee00;"></span>
                <span style="background: #ff4500;"></span>
                <span style="background: #888888;"></span>
                <span style="background: #800080;"></span>
                <span style="background: #008000;"></span>
                <span style="background: #4169e1;"></span>
            </div>
        `;
    } else if (product.color_bar_type === 'cmyk') {
        // ៤ ពណ៌ស្តង់ដារ (CMYK)
        colorBarHTML = `
            <div class="cmyk-bar">
                <span style="background: #000000;"></span>
                <span style="background: #0088ff;"></span>
                <span style="background: #ff0088;"></span>
                <span style="background: #ffee00;"></span>
            </div>
        `;
    } else {
        // បន្ទាត់ខ្មៅធម្មតា (Mono)
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

    return `
        <div class="product-card">
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
        </div>
    `;
}

// មុខងារបង្ហាញទំនិញបែងចែកជា Section តាមប្រភេទ និង Brand យ៉ាងសំបូរបែប
function renderHomeSections(products) {
    const mainContainer = document.getElementById('main-content-container');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    // បងអាចកែបន្ថែម កាត់បន្ថយ ឬប្ដូរឈ្មោះ Section ទាំងនេះបានតាមចិត្តចង់!
    const targetSections = [
        { title: 'Software Firmware Canon', filterKey: 'category', filterValue: 'Firmware' },
        { title: 'Epson Printer', filterKey: 'brand', filterValue: 'Epson' },
        { title: 'Hp Printer', filterKey: 'brand', filterValue: 'Hp' }
    ];

    targetSections.forEach(section => {
        const matchedProducts = products.filter(p => {
            if (!p) return false;
            const val = p[section.filterKey] ? String(p[section.filterKey]).toLowerCase() : '';
            return val.includes(section.filterValue.toLowerCase());
        }).slice(0, 8); // កំណត់បង្ហាញត្រឹម 8 ផលិតផលក្នុងមួយ Section
        
        if (matchedProducts.length > 0) {
            const sectionHTML = `
                <div class="section-header-container">
                    <div class="section-title-box">
                        <h2>${section.title}</h2>
                    </div>
                </div>
                <div class="product-container" id="grid-${section.title.toLowerCase().replace(/\s+/g, '-')}" style="margin-bottom: 20px;">
                    ${matchedProducts.map(product => createProductCardHTML(product)).join('')}
                </div>
            `;
            mainContainer.insertAdjacentHTML('beforeend', sectionHTML);
        }
    });

    attachCardEvents(mainContainer);
    setTimeout(forceBoldSpecs, 10);
}

// មុខងារបង្ហាញទំនិញក្នុង Grid តែមួយ (ពេលអ្នកប្រើប្រាស់ធ្វើการ Search ឬ Filter រកម៉ាក ឬប្រភេទជាក់លាក់ណាមួយ)
function renderFilteredGrid(products, title = "Search Results") {
    const mainContainer = document.getElementById('main-content-container');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    if (products.length === 0) {
        mainContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #777; grid-column: 1 / -1;">រកមិនឃើញផលិតផលដែលអ្នកកំពុងស្វែងរកឡើយ។</p>';
        return;
    }

    const sectionHTML = `
        <div class="section-header-container">
            <div class="section-title-box">
                <h2>${title} (${products.length})</h2>
            </div>
        </div>
        <div class="product-container" id="filtered-product-grid">
            ${products.map(product => createProductCardHTML(product)).join('')}
        </div>
    `;

    mainContainer.innerHTML = sectionHTML;
    attachCardEvents(mainContainer);
    setTimeout(forceBoldSpecs, 10);
}

// ភ្ជាប់ព្រឹត្តិការណ៍ចុចលើកាត (Click Events)
function attachCardEvents(container) {
    container.querySelectorAll('.card-img, .product-title, .btn-detail').forEach(element => {
        element.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (id) viewDetail(id);
        });
    });
}

// Search functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        if (keyword === '') {
            renderHomeSections(allProducts);
            return;
        }
        const filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(keyword) || 
            (p.brand && p.brand.toLowerCase().includes(keyword)) ||
            (p.machine_type && p.machine_type.toLowerCase().includes(keyword)) ||
            (p.category && p.category.toLowerCase().includes(keyword))
        );
        renderFilteredGrid(filtered, `Search: "${keyword}"`);
    });
}

// Filter functionality (សម្រាប់ប៊ូតុង Store, HP, Canon, Epson, វីនដូ, ជាដើម)
const filterButtons = document.querySelectorAll('.filter-trigger, .filter-btn, .dropdown-content a, .dropdown-menu a, nav a');
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        let filterValue = e.currentTarget.getAttribute('data-filter') || e.currentTarget.textContent.trim();
        if (!filterValue) return;
        const keyword = filterValue.toLowerCase().trim();

        if (keyword === 'all' || keyword === 'store' || keyword === 'ទំនិញទាំងអស់') {
            renderHomeSections(allProducts);
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
            
            renderFilteredGrid(filtered, filterValue);
        }
    });
});

// View Detail Redirect Function
function viewDetail(id) {
    window.location.href = `pages/single-product.html?id=${id}`;
}