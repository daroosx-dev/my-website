// --- 1. CONFIGURATIONS & GLOBAL STATE ---
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 8;
let currentFilteredProducts = [];
let isHomeView = true;

// --- 2. INITIALIZATION & FETCH DATA ---
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        allProducts = data;
        handleURLFilter();
    })
    .catch(error => console.error('Error loading products.json:', error));

// --- 3. CORE FILTER LOGIC ---
function filterProducts(keyword) {
    const cleanKeyword = keyword.toLowerCase().trim();

    return allProducts.filter(p => {
        const pBrand = p.brand ? p.brand.toLowerCase() : '';
        const pCat = p.category ? p.category.toLowerCase() : '';
        const pType = p.type ? p.type.toLowerCase() : '';
        const pMachine = p.machine_type ? p.machine_type.toLowerCase() : '';
        const pCopier = p.copier_type ? p.copier_type.toLowerCase() : '';
        const pName = p.name ? p.name.toLowerCase() : '';

        // លក្ខខណ្ឌពិសេសសម្រាប់ Firmware
        if (cleanKeyword.includes('firmware')) {
            const brandPart = cleanKeyword.replace('firmware', '').replace('software', '').trim();
            const isFirmware = pCat.includes('firmware') || pName.includes('firmware') || pType.includes('firmware');
            
            if (brandPart === '') {
                return isFirmware;
            }
            
            return isFirmware && (pBrand.includes(brandPart) || pName.includes(brandPart));
        }

        // លក្ខខណ្ឌពិសេសសម្រាប់ Laptop និង Desktop
        if (cleanKeyword === 'laptop' || cleanKeyword === 'desktop') {
            return pCat.includes(cleanKeyword) || 
                   pType.includes(cleanKeyword) || 
                   pMachine.includes(cleanKeyword) || 
                   pName.includes(cleanKeyword);
        }

        // លក្ខខណ្ឌស្វែងរកទូទៅ
        return pBrand.includes(cleanKeyword) || 
               pCat.includes(cleanKeyword) || 
               pType.includes(cleanKeyword) || 
               pMachine.includes(cleanKeyword) || 
               pCopier.includes(cleanKeyword) ||
               pName.includes(cleanKeyword);
    });
}

// មុខងារពិនិត្យ URL Parameter ពេលចូលមកពី single-product.html
function handleURLFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterFromURL = urlParams.get('filter');

    if (filterFromURL) {
        const filtered = filterProducts(filterFromURL);
        renderFilteredGrid(filtered, filterFromURL);
        updateActiveSidebarButton(filterFromURL);
    } else {
        renderHomeSections(allProducts);
    }
}

// ប្ដូរ Active Class ឱ្យប៊ូតុង Sidebar ស្វ័យប្រវត្តិ
function updateActiveSidebarButton(filterValue) {
    document.querySelectorAll('.filter-trigger, .software-sidebar a').forEach(btn => {
        const btnFilter = btn.getAttribute('data-filter') || btn.textContent.trim();
        if (btnFilter.toLowerCase() === filterValue.toLowerCase()) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// --- 4. UI RENDERING FUNCTIONS ---

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

// មុខងារបង្កើត HTML សម្រាប់ Product Card (បែងចែក Specs និងបង្ហាញ Color Dots ស្វ័យប្រវត្តិ)
function createProductCardHTML(product) {
    // 1. ពិនិត្យថាតើផលិតផលនេះជា Computer (Laptop ឬ Desktop) ឬអត់
    const isComputer = (product.category && (product.category.toLowerCase().includes('laptop') || product.category.toLowerCase().includes('desktop'))) || 
                       (product.machine_type && (product.machine_type.toLowerCase().includes('laptop') || product.machine_type.toLowerCase().includes('desktop')));

    // 2. ពិនិត្យមើលថាតើជា License ដែរឬទេ (ដក Color Dots ចេញតែ License បុណ្នោះ)
    const checkStr = `${product.category || ''} ${product.type || ''} ${product.name || ''} ${product.machine_type || ''}`.toLowerCase();
    const isLicense = checkStr.includes('license');

    let colorBarHTML = '';
    
    // បង្ហាញ Color Dots លើគ្រប់ផលិតផលទាំងអស់ រួមទាំង Firmware/Software (លើកលែងតែ Computer និង License)
    if (!isComputer && !isLicense) {
        const colorType = product.color_bar_type ? product.color_bar_type.toLowerCase().trim() : '';
        
        if (colorType === 'cmyklmlc') {
            colorBarHTML = `
                <div class="color-dots-container" style="display: flex; justify-content: center; gap: 6px; margin: 10px 0;">
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #000000; display: inline-block;" title="Black"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #0088ff; display: inline-block;" title="Cyan"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #ff0088; display: inline-block;" title="Magenta"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #ffee00; display: inline-block;" title="Yellow"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #00ffff; display: inline-block;" title="Light Cyan"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #ff00ff; display: inline-block;" title="Light Magenta"></span>
                </div>
            `;
        } else if (colorType === '12-color') {
            colorBarHTML = `
                <div class="color-dots-container" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; margin: 10px 0;">
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #000000; display: inline-block;"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #333333; display: inline-block;"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #0088ff; display: inline-block;"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #00ffff; display: inline-block;"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #ff0088; display: inline-block;"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #ff00ff; display: inline-block;"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #ffee00; display: inline-block;"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #ff4500; display: inline-block;"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #888888; display: inline-block;"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #800080; display: inline-block;"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #008000; display: inline-block;"></span>
                    <span class="color-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #4169e1; display: inline-block;"></span>
                </div>
            `;
        } else if (colorType === 'cmyk') {
            colorBarHTML = `
                <div class="color-dots-container" style="display: flex; justify-content: center; gap: 8px; margin: 10px 0;">
                    <span class="color-dot" style="width: 16px; height: 16px; border-radius: 50%; background: #000000; display: inline-block;" title="Black"></span>
                    <span class="color-dot" style="width: 16px; height: 16px; border-radius: 50%; background: #0088ff; display: inline-block;" title="Cyan"></span>
                    <span class="color-dot" style="width: 16px; height: 16px; border-radius: 50%; background: #ff0088; display: inline-block;" title="Magenta"></span>
                    <span class="color-dot" style="width: 16px; height: 16px; border-radius: 50%; background: #ffee00; display: inline-block;" title="Yellow"></span>
                </div>
            `;
        } else {
            // បង្ហាញពណ៌ K (Black) សម្រាប់ព្រីនធ័រម៉ូណូ ឬ Firmware/Software
            colorBarHTML = `
                <div class="color-dots-container" style="display: flex; justify-content: center; gap: 8px; margin: 10px 0;">
                    <span class="color-dot" style="width: 16px; height: 16px; border-radius: 50%; background: #000000; display: inline-block;" title="Black (K)"></span>
                </div>
            `;
        }
    }

    let tagsHTML = '';
    if (product.tags && product.tags.length > 0) {
        product.tags.forEach(tag => {
            tagsHTML += `<span class="tag-item">✓ ${tag}</span>`;
        });
    }

    let specsHTML = '';

    if (isComputer) {
        specsHTML = `
            <table class="specs-table">
                <tr>
                    <td class="label">Processor</td>
                    <td class="colon">:</td>
                    <td class="value" style="font-weight: 800 !important; color: #0f172a !important;">${product.processor || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="label">Memory</td>
                    <td class="colon">:</td>
                    <td class="value" style="font-weight: 800 !important; color: #0f172a !important;">${product.memory || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="label">Storage</td>
                    <td class="colon">:</td>
                    <td class="value" style="font-weight: 800 !important; color: #0f172a !important;">${product.storage || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="label">Graphic</td>
                    <td class="colon">:</td>
                    <td class="value" style="font-weight: 800 !important; color: #0f172a !important;">${product.graphic || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="label">Power</td>
                    <td class="colon">:</td>
                    <td class="value" style="font-weight: 800 !important; color: #0f172a !important;">${product.power || 'N/A'}</td>
                </tr>
            </table>
        `;
    } else {
        specsHTML = `
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
        `;
    }

    return `
        <div class="product-card" style="position: relative;">
            <div>
                <div class="brand-logo-text">${product.brand || ''}</div>
                <div class="card-img" data-id="${product.id}">
                    <img src="${product.images && product.images.length > 0 ? product.images[0] : 'images/default.png'}" alt="${product.name}">
                </div>
                <div class="product-title" data-id="${product.id}">${product.name}</div>
                <div class="price">${product.price}</div>

                <div class="tag-list">${tagsHTML}</div>
                ${colorBarHTML}

                ${specsHTML}
            </div>
            <div class="card-actions">
                <button class="btn-detail" data-id="${product.id}">Detail</button>
            </div>
        </div>
    `;
}

// មុខងារបង្ហាញទំនិញបែងចែកជា 3 Section ពេលនៅหน้า Home
function renderHomeSections(products) {
    isHomeView = true;
    currentPage = 1;
    const mainContainer = document.getElementById('main-content-container');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    const targetSections = [
        { title: 'Software Firmware Canon', filterKey: 'category', filterValue: 'Firmware', brandCheck: 'canon' },
        { title: 'Software Firmware Toshiba', filterKey: 'category', filterValue: 'Firmware', brandCheck: 'toshiba' },
        { title: 'EPSON Printer', filterKey: 'brand', filterValue: 'Epson' }
    ];

    targetSections.forEach(section => {
        const matchedProducts = products.filter(p => {
            if (!p) return false;
            const cat = p.category ? String(p.category).toLowerCase() : '';
            const brand = p.brand ? String(p.brand).toLowerCase() : '';
            const name = p.name ? String(p.name).toLowerCase() : '';

            if (section.brandCheck) {
                return (cat.includes('firmware') || name.includes('firmware')) && 
                       (brand.includes(section.brandCheck) || name.includes(section.brandCheck));
            } else {
                const val = p[section.filterKey] ? String(p[section.filterKey]).toLowerCase() : '';
                return val.includes(section.filterValue.toLowerCase());
            }
        }).slice(0, 4);
        
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

    removePagination();
    attachCardEvents(mainContainer);
    setTimeout(forceBoldSpecs, 10);
}

// មុខងារបង្ហាញ Filtered Grid និង Pagination
function renderFilteredGrid(products, title = "Search Results") {
    isHomeView = false;
    currentFilteredProducts = products;
    const mainContainer = document.getElementById('main-content-container');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    if (products.length === 0) {
        mainContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #777; grid-column: 1 / -1;">រកមិនឃើញផលិតផលដែលអ្នកកំពុងស្វែងរកឡើយ political position.</p>';
        removePagination();
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = products.slice(startIndex, endIndex);

    const sectionHTML = `
        <div class="section-header-container">
            <div class="section-title-box">
                <h2>${title} (${products.length})</h2>
            </div>
        </div>
        <div class="product-container" id="filtered-product-grid">
            ${paginatedItems.map(product => createProductCardHTML(product)).join('')}
        </div>
    `;

    mainContainer.innerHTML = sectionHTML;
    renderPagination(products.length);
    attachCardEvents(mainContainer);
    setTimeout(forceBoldSpecs, 10);
}

// បង្កើត Pagination ខាងក្រោម
function renderPagination(totalItems) {
    let paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination-container';
        paginationContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 8px; margin: 30px 0;';
        
        const mainContainer = document.getElementById('main-content-container');
        if (mainContainer && mainContainer.parentNode) {
            mainContainer.parentNode.insertBefore(paginationContainer, mainContainer.nextSibling);
        }
    }

    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.style.cssText = `
            padding: 6px 14px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            border: 1px solid ${i === currentPage ? '#2563eb' : '#cbd5e1'};
            background-color: ${i === currentPage ? '#2563eb' : '#ffffff'};
            color: ${i === currentPage ? '#ffffff' : '#334155'};
        `;

        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderFilteredGrid(currentFilteredProducts, document.querySelector('.section-title-box h2').textContent.split('(')[0].trim());
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        paginationContainer.appendChild(pageBtn);
    }
}

function removePagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) paginationContainer.innerHTML = '';
}

// --- 5. EVENT LISTENERS ---

function attachCardEvents(container) {
    container.querySelectorAll('.card-img, .product-title, .btn-detail').forEach(element => {
        element.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (id) viewDetail(id);
        });
    });
}

// Search Bar Input Event
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.trim();
        currentPage = 1;
        if (keyword === '') {
            renderHomeSections(allProducts);
            return;
        }
        const filtered = filterProducts(keyword);
        renderFilteredGrid(filtered, `Search: "${keyword}"`);
    });
}

// Sidebar & Mega Menu Filter Click Event
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.filter-trigger, .dropdown-content button, .dropdown-content a, .mega-item, .software-sidebar a');
    if (!trigger) return;

    let filterValue = trigger.getAttribute('data-filter') || trigger.textContent.trim();
    if (!filterValue) return;

    currentPage = 1;
    const cleanKeyword = filterValue.toLowerCase().trim();

    if (cleanKeyword.includes('all') || cleanKeyword === 'store' || cleanKeyword === 'home' || cleanKeyword.includes('products (all)')) {
        renderHomeSections(allProducts);
        return;
    }

    document.querySelectorAll('.filter-trigger, .software-sidebar a').forEach(btn => btn.classList.remove('active'));
    trigger.classList.add('active');

    const filtered = filterProducts(filterValue);
    renderFilteredGrid(filtered, filterValue);
});

// View Detail Redirect Function
function viewDetail(id) {
    window.location.href = `pages/single-product.html?id=${id}`;
}