var Api = {
    request: async function (path, options) {
        options = options || {};
        var isAuthPath = path.indexOf("/auth/") === 0;
        var headers = { "Content-Type": "application/json" };

        var token = Auth.getToken();
        if (token && !isAuthPath) {
            headers["Authorization"] = "Bearer " + token;
        }

        var response = await fetch(CONFIG.API_BASE_URL + path, {
            method: options.method || "GET",
            headers: headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });

        var json = null;
        try { json = await response.json(); } catch (e) { json = null; }

        if (response.status === 401 && token && !isAuthPath) {
            Auth.logout();
            throw new Error("Your session has expired. Please log in again.");
        }
        if (!response.ok || !json || json.success === false) {
            throw new Error((json && json.message) || "Something went wrong. Please try again.");
        }
        return json.data;
    },
    get: function (path) { return this.request(path); },
    post: function (path, body) { return this.request(path, { method: "POST", body: body }); }
};