document.addEventListener("DOMContentLoaded", function () {
    const pathName = window.location.pathname;
    const isSubFolder = pathName.includes('/pages/') || pathName.includes('/html-page/');

    const headerUrl = isSubFolder ? "../header/header.html" : "header/header.html";
    const footerUrl = isSubFolder ? "../footer/footer.html" : "footer/footer.html";

    // ១. ទាញយក Header
    fetch(headerUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;

                if (isSubFolder) {
                    headerPlaceholder.querySelectorAll("a").forEach(link => {
                        let href = link.getAttribute("href");
                        if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("tel:") && !href.startsWith("mailto:") && !href.startsWith("javascript:") && !href.startsWith("../")) {
                            if (href.startsWith("/")) href = href.substring(1);
                            
                            if (pathName.includes('/html-page/') && href === "software.html") {
                                link.setAttribute("href", "software.html");
                            } else {
                                link.setAttribute("href", "../" + href);
                            }
                        }
                    });

                    headerPlaceholder.querySelectorAll("img").forEach(img => {
                        let src = img.getAttribute("src");
                        if (src && !src.startsWith("http") && !src.startsWith("../")) {
                            if (src.startsWith("/")) src = src.substring(1);
                            img.setAttribute("src", "../" + src);
                        }
                    });
                }

                // កំណត់ Active Menu ឱ្យចំ Software
                const currentFileName = window.location.pathname.split("/").pop();
                if (currentFileName === "software.html") {
                    headerPlaceholder.querySelectorAll(".apple-nav a, .header-nav a, .drawer-links a").forEach(a => {
                        a.classList.remove("active");
                        let hrefAttr = a.getAttribute("href");
                        if (hrefAttr && hrefAttr.includes("software.html")) {
                            a.classList.add("active");
                        }
                    });
                }

                initHeaderScript();
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // ២. ទាញយក Footer
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
                    footerPlaceholder.querySelectorAll("a").forEach(link => {
                        let href = link.getAttribute("href");
                        if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("tel:") && !href.startsWith("mailto:") && !href.startsWith("javascript:") && !href.startsWith("../")) {
                            if (href.startsWith("/")) href = href.substring(1);
                            link.setAttribute("href", "../" + href);
                        }
                    });
                }
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});

// មុខងារគ្រប់គ្រង Menu និង Scroll Effect
function initHeaderScript() {
    const siteHeader = document.getElementById("siteHeader");
    const openMenuBtn = document.getElementById("openMenuBtn");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");

    if (openMenuBtn && mobileDrawer && drawerOverlay) {
        openMenuBtn.addEventListener("click", function () {
            mobileDrawer.classList.add("open");
            drawerOverlay.classList.add("open");
            document.body.style.overflow = "hidden";
        });
    }

    function closeDrawer() {
        if (mobileDrawer && drawerOverlay) {
            mobileDrawer.classList.remove("open");
            drawerOverlay.classList.remove("open");
            document.body.style.overflow = "auto";
        }
    }

    if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);

    window.addEventListener("scroll", function () {
        if (siteHeader) {
            if (window.scrollY > 50) {
                siteHeader.classList.add("scrolled");
            } else {
                siteHeader.classList.remove("scrolled");
            }
        }
    });
}