/* ==========================================================================
   1. CONFIGURATIONS & GLOBAL STATE
   ========================================================================== */
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 8;
let currentFilteredProducts = [];
let isHomeView = true;

/* ==========================================================================
   2. INITIALIZATION & FETCH DATA
   ========================================================================== */
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        allProducts = data;
        handleURLFilter();
    })
    .catch(error => console.error('Error loading products.json:', error));

/* ==========================================================================
   3. CORE FILTER LOGIC (កន្លែងគ្រប់គ្រងការស្វែងរក និង Filter ទាំងអស់)
   ========================================================================== */
function filterProducts(keyword) {
    const cleanKeyword = keyword.toLowerCase().trim();

    return allProducts.filter(p => {
        const pBrand = p.brand ? p.brand.toLowerCase() : '';
        const pCat = p.category ? p.category.toLowerCase() : '';
        const pType = p.type ? p.type.toLowerCase() : '';
        const pMachine = p.machine_type ? p.machine_type.toLowerCase() : '';
        const pCopier = p.copier_type ? p.copier_type.toLowerCase() : '';
        const pLicense = p.license_type ? p.license_type.toLowerCase() : '';
        const pName = p.name ? p.name.toLowerCase() : '';

        // ក. លក្ខខណ្ឌពិសេសសម្រាប់ Software Firmware (គ្រប់ម៉ាក និងទូទៅ)
        if (cleanKeyword.includes('firmware')) {
            const brandPart = cleanKeyword.replace('firmware', '').replace('software', '').trim();
            const isFirmwareMatch = pCat.includes('firmware') || pName.includes('firmware');
            
            // បើចុច Software Firmware ទទេ គឺ brandPart ស្មើទទេ នឹងបង្ហាញ Firmware ទាំងអស់
            const isBrandMatch = (brandPart === '') || pBrand.includes(brandPart) || pName.includes(brandPart);

            return isFirmwareMatch && isBrandMatch;
        }

        // ខ. លក្ខខណ្ឌស្វែងរកទូទៅ (General Filter)
        return pBrand.includes(cleanKeyword) || 
               pCat.includes(cleanKeyword) || 
               pType.includes(cleanKeyword) || 
               pMachine.includes(cleanKeyword) || 
               pCopier.includes(cleanKeyword) ||
               pLicense.includes(cleanKeyword) ||
               pName.includes(cleanKeyword);
    });
}

// មុខងារពិនិត្យ URL Parameter ពេលចូលមកពីទំព័រផ្សេង
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

/* ==========================================================================
   4. UI RENDERING FUNCTIONS (កន្លែងបង្ហាញទម្រង់ HTML ផ្សេងៗ)
   ========================================================================== */

// មុខងារបង្ខំឱ្យអក្សរក្នុងតារាង Specs ដិតច្បាស់ល្អ
function forceBoldSpecs() {
    const valueCells = document.querySelectorAll('.specs-table td');
    valueCells.forEach(cell => {
        if (!cell.classList.contains('label') && !cell.classList.contains('colon')) {
            cell.style.setProperty('font-weight', '800', 'important');
            cell.style.setProperty('color', '#0f172a', 'important');
        }
    });
}

// មុខងារបង្កើត HTML សម្រាប់ Product Card នីមួយៗ
function createProductCardHTML(product) {
    const isSoftware = (product.category && product.category.toLowerCase().includes('software')) ||
                       (product.name && product.name.toLowerCase().includes('firmware')) ||
                       (product.machine_type && product.machine_type.toLowerCase().includes('software'));

    let colorBarHTML = '';
    
    if (isSoftware) {
        // បើជា Software/Firmware: ដាក់ត្រឹមបន្ទាត់ស្ដើងពណ៌ #0dcaf0 គ្មានអត្ថបទ
        colorBarHTML = `
            <div style="background-color: #0dcaf0; height: 4px; border-radius: 2px; margin: 10px 0;"></div>
        `;
    } else {
        // បើជាម៉ាស៊ីនព្រីន: ប្តូរពីរបារវែង មកជារង្វង់មូលពណ៌ដាច់ៗពីគ្នា (.color-dots-container)
        if (product.color_bar_type === 'cmyklmlc') {
            colorBarHTML = `
                <div class="color-dots-container">
                    <span class="color-dot" style="background: #000000;" title="Black"></span>
                    <span class="color-dot" style="background: #0088ff;" title="Cyan"></span>
                    <span class="color-dot" style="background: #ff0088;" title="Magenta"></span>
                    <span class="color-dot" style="background: #ffee00;" title="Yellow"></span>
                    <span class="color-dot" style="background: #00ffff;" title="Light Cyan"></span>
                    <span class="color-dot" style="background: #ff00ff;" title="Light Magenta"></span>
                </div>
            `;
        } else if (product.color_bar_type === '12-color') {
            colorBarHTML = `
                <div class="color-dots-container" style="flex-wrap: wrap;">
                    <span class="color-dot" style="background: #000000;"></span>
                    <span class="color-dot" style="background: #333333;"></span>
                    <span class="color-dot" style="background: #0088ff;"></span>
                    <span class="color-dot" style="background: #00ffff;"></span>
                    <span class="color-dot" style="background: #ff0088;"></span>
                    <span class="color-dot" style="background: #ff00ff;"></span>
                    <span class="color-dot" style="background: #ffee00;"></span>
                    <span class="color-dot" style="background: #ff4500;"></span>
                    <span class="color-dot" style="background: #888888;"></span>
                    <span class="color-dot" style="background: #800080;"></span>
                    <span class="color-dot" style="background: #008000;"></span>
                    <span class="color-dot" style="background: #4169e1;"></span>
                </div>
            `;
        } else if (product.color_bar_type === 'cmyk') {
            colorBarHTML = `
                <div class="color-dots-container">
                    <span class="color-dot" style="background: #000000;" title="Black"></span>
                    <span class="color-dot" style="background: #0088ff;" title="Cyan"></span>
                    <span class="color-dot" style="background: #ff0088;" title="Magenta"></span>
                    <span class="color-dot" style="background: #ffee00;" title="Yellow"></span>
                </div>
            `;
        } else {
            colorBarHTML = `
                <div class="color-dots-container">
                    <span class="color-dot" style="background: #000000;" title="Black"></span>
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

    // កំណត់ស្លាកយីហោតារាង Specs ស្វ័យប្រវត្តិ៖ បើជា Software ឱ្យចេញ License Type បើជាម៉ាស៊ីនឱ្យចេញ Copier Type
    const thirdSpecLabel = isSoftware ? "License Type" : "Copier Type";
    const thirdSpecValue = product.license_type || product.copier_type || 'N/A';

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
                        <td class="label">${thirdSpecLabel}</td>
                        <td class="colon">:</td>
                        <td class="value">${thirdSpecValue}</td>
                    </tr>
                </table>
            </div>
            <div class="card-actions">
                <button class="btn-detail" data-id="${product.id}">Detail</button>
            </div>
        </div>
    `;
}

// មុខងារបង្ហាញទំនិញបែងចែកជា Sections នៅទំព័រដើម (Home)
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

// មុខងារបង្ហាញលទ្ធផលពេល Filter ឬ Search ព្រមទាំងមាន Pagination
function renderFilteredGrid(products, title = "Search Results") {
    isHomeView = false;
    currentFilteredProducts = products;
    const mainContainer = document.getElementById('main-content-container');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    if (products.length === 0) {
        mainContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #777; grid-column: 1 / -1;">រកមិនឃើញផលិតផលដែលអ្នកកំពុងស្វែងរកឡើយ។</p>';
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

// បង្កើតទំព័រទម្លាក់លេខ (Pagination) ខាងក្រោម
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

/* ==========================================================================
   5. EVENT LISTENERS (ការចាប់ព្រឹត្តិការណ៍ ចុច និងស្វែងរក)
   ========================================================================== */

function attachCardEvents(container) {
    container.querySelectorAll('.card-img, .product-title, .btn-detail').forEach(element => {
        element.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (id) viewDetail(id);
        });
    });
}

// ព្រឹត្តិការណ៍ពេលវាយបញ្ចូលក្នុង Search Bar
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

// ព្រឹត្តិការណ៍ពេលចុចលើ Sidebar ឬ Menu Filter ផ្សេងៗ
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

// មុខងារបញ្ជូនទៅកាន់ទំព័រព័ត៌មានលម្អិត (Single Product Detail)
function viewDetail(id) {
    window.location.href = `pages/single-product.html?id=${id}`;
}