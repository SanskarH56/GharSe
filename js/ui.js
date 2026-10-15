/**
 * GharSe - loading, empty, error and "not available yet" states.
 *
 * Each helper replaces the contents of a container element with a short
 * centred message. Text is set with textContent, so server messages are never
 * parsed as HTML. Colours use the CSS variables already defined in style.css.
 *
 * Needs: nothing (no other script).
 */
var Ui = {

    _box: function (container, message, color) {
        container.innerHTML = "";
        var box = document.createElement("div");
        box.style.cssText = "grid-column: 1 / -1; padding: 40px 16px; text-align: center; " +
                            "color: " + color + "; line-height: 1.6;";
        var text = document.createElement("p");
        text.textContent = message;
        box.appendChild(text);
        container.appendChild(box);
        return box;
    },

    loading: function (container, message) {
        return this._box(container, message || "Loading...", "var(--color-text-secondary)");
    },

    empty: function (container, message) {
        return this._box(container, message || "Nothing to show here yet.", "var(--color-text-secondary)");
    },

    // Shows the message and, when onRetry is given, a Try again button.
    error: function (container, message, onRetry) {
        var box = this._box(container, message || "Something went wrong.", "var(--color-error)");
        if (onRetry) {
            var button = document.createElement("button");
            button.type = "button";
            button.className = "btn btn-secondary";
            button.style.marginTop = "12px";
            button.textContent = "Try again";
            button.addEventListener("click", onRetry);
            box.appendChild(button);
        }
        return box;
    },

    // For pages whose backend endpoints do not exist yet (IT doc 7.2:
    // such pages keep a visible "not available yet" state, never fake data).
    unavailable: function (container, featureName) {
        return this._box(
            container,
            (featureName ? featureName + " is" : "This feature is") + " not available yet. Check back soon.",
            "var(--color-text-secondary)"
        );
    }
};