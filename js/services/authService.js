var AuthService = {
    login: async function (identifier, password) {
        var data = await Api.post("/auth/login", { identifier: identifier, password: password });
        Auth.setToken(data.token);
        return data;
    },
    register: function (payload) {
        return Api.post("/auth/register", payload);
    }
};