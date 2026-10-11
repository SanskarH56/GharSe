var Auth = {
    TOKEN_KEY: "gharse_token",

    getToken: function () { return localStorage.getItem(this.TOKEN_KEY); },
    setToken: function (t) { localStorage.setItem(this.TOKEN_KEY, t); },
    isLoggedIn: function () { return !!this.getToken(); },

    getClaims: function () {
        var t = this.getToken();
        if (!t) return null;
        try {
            var b64 = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
            return JSON.parse(atob(b64));
        } catch (e) { return null; }
    },

    getRole: function () {
        var c = this.getClaims();
        return c ? c.role : null;
    },

    logout: function () {
        localStorage.removeItem(this.TOKEN_KEY);
        window.location.href = "/index.html";
    }
};