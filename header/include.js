document.addEventListener("DOMContentLoaded", function () {
    const headerPlaceholder = document.getElementById("header-placeholder");

    if (headerPlaceholder) {
        fetch("header/header.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
                initHeaderFunctionality();
            })
            .catch(error => {
                console.error("Error loading header:", error);
            });
    } else {
        initHeaderFunctionality();
    }
});

function initHeaderFunctionality() {
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

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener("click", closeDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener("click", closeDrawer);
    }

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