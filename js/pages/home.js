/**
 * ARTISAN MARKETPLACE
 * Landing Page
 */

const HomePage = {

    init() {
        this.setupCategoryLinks();
    },


    setupCategoryLinks() {

        const categoryCards =
            document.querySelectorAll(".category-card");

        categoryCards.forEach(card => {

            card.addEventListener("click", event => {

                event.preventDefault();

                const category =
                    card.querySelector("span:last-child")
                        ?.textContent
                        ?.trim();

                if (!category) {
                    return;
                }

                /*
                 * Marketplace filtering will be connected
                 * once the marketplace/data layer exists.
                 */

                console.log(
                    `Category selected: ${category}`
                );
            });

        });

    }

};


document.addEventListener("DOMContentLoaded", () => {
    HomePage.init();
});