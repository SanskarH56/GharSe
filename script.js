const searchForm = document.querySelector(".search-bar");
const searchInput = document.querySelector(".search-bar input");

if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const query = searchInput.value.trim();

        if (!query) {
            searchInput.focus();
            return;
        }

        /*
         * Redirect to shop page with search query.
         * The marketplace page will eventually filter by this.
         */
        window.location.href = "shop.html";
    });
}


/* ==================== CART ==================== */

let cartCount = 0;

const cartCountElement = document.querySelector(".cart-count");

function updateCartCount() {
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function addToCart() {
    cartCount++;
    updateCartCount();
}


/* ==================== ADD TO CART (product detail) ==================== */

const addToCartBtn = document.querySelector(".add-to-cart");

if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
        addToCart();
        addToCartBtn.textContent = "Added to Cart ✓";
        addToCartBtn.style.background = "var(--green)";

        setTimeout(function () {
            addToCartBtn.textContent = "Add to Cart";
            addToCartBtn.style.background = "";
        }, 1800);
    });
}


/* ==================== PRODUCT BUTTONS ==================== */

const productButtons =
    document.querySelectorAll(".product-button");

productButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        /*
         * If this is an anchor tag it should navigate to the
         * product page — don't intercept it.
         */
        if (button.tagName.toLowerCase() === "a") {
            return; // allow normal navigation
        }

        event.preventDefault();

        /*
         * For actual <button> elements (e.g. add-to-cart),
         * simulate adding a product.
         */
        addToCart();

        button.textContent = "Added to Cart";

        setTimeout(function () {
            button.textContent = "View Product";
        }, 1200);
    });

});


/* ==================== SMOOTH INTERNAL LINKS ==================== */

const internalLinks =
    document.querySelectorAll('a[href="#"]');

internalLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        /*
         * Prevent empty "#" links from jumping
         * to the top of the page.
         */

        event.preventDefault();

    });

});


/* ==================== INITIAL STATE ==================== */

updateCartCount();


const categoryPills =
    document.querySelectorAll(".category-pill");

categoryPills.forEach(function (pill) {

    pill.addEventListener("click", function () {

        categoryPills.forEach(function (item) {
            item.classList.remove("active");
        });

        pill.classList.add("active");

    });

});


/* ==================== CLEAR FILTERS ==================== */

const clearFilters =
    document.querySelector(".clear-filters");

if (clearFilters) {

    clearFilters.addEventListener("click", function () {

        const checkboxes =
            document.querySelectorAll(
                '.filter-panel input[type="checkbox"]'
            );

        const radioButtons =
            document.querySelectorAll(
                '.filter-panel input[type="radio"]'
            );

        const numberInputs =
            document.querySelectorAll(
                '.price-inputs input'
            );

        const selects =
            document.querySelectorAll(
                '.filter-panel select'
            );


        checkboxes.forEach(function (input) {
            input.checked = false;
        });


        radioButtons.forEach(function (input) {
            input.checked = false;
        });


        numberInputs.forEach(function (input) {
            input.value = "";
        });


        selects.forEach(function (select) {
            select.selectedIndex = 0;
        });

    });

}


/* ==================== APPLY FILTERS ==================== */

const applyFilters =
    document.querySelector(".apply-filters");

if (applyFilters) {

    applyFilters.addEventListener("click", function () {

        /*
         * Backend/database filtering will be connected later.
         * For now this provides prototype feedback.
         */

        applyFilters.textContent = "Filters Applied";

        setTimeout(function () {
            applyFilters.textContent = "Apply Filters";
        }, 1200);

    });

}


/* ==================== SORTING ==================== */

const sortSelect =
    document.querySelector("#sort");

if (sortSelect) {

    sortSelect.addEventListener("change", function () {

        /*
         * Actual product sorting will eventually happen
         * through the marketplace data.
         */

        console.log(
            "Products sorted by:",
            sortSelect.value
        );

    });

}


/* ==================== PAGINATION ==================== */

const paginationButtons =
    document.querySelectorAll(".pagination-button");

paginationButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        if (
            button.classList.contains("next")
        ) {
            return;
        }

        paginationButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

    });

});

