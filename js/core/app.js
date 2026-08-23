/**
 * ARTISAN MARKETPLACE
 * Application Bootstrap
 */

const ArtisanApp = {

    name: "Artisan Marketplace",

    version: "1.0.0",

    init() {
        console.log(
            `${this.name} v${this.version} initialized.`
        );

        this.initializeGlobalInteractions();
    },


    initializeGlobalInteractions() {

        const menuButton =
            document.getElementById("mobileMenuButton");

        const navigation =
            document.querySelector(".main-nav");

        if (!menuButton || !navigation) {
            return;
        }

        menuButton.addEventListener("click", () => {

            const isOpen =
                navigation.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });
    }

};


document.addEventListener("DOMContentLoaded", () => {
    ArtisanApp.init();
});