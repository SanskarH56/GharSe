#!/usr/bin/env bash
# Swap the old nav and toast scripts for the new ones on every page.
#
#   js/nav/navigation.js   ->  js/auth.js + js/nav.js
#   js/cart/cart-ux.js     ->  js/toast.js
#
# Run from the GharSe-frontend root.
#   ./switch-nav-toast.sh          shows what WOULD change (changes nothing)
#   ./switch-nav-toast.sh --apply  makes the changes (then review with git diff)

set -euo pipefail

APPLY=0
[ "${1:-}" = "--apply" ] && APPLY=1

if [ ! -f index.html ] || [ ! -d pages ]; then
    echo "Run this from the GharSe-frontend root (index.html and pages/ must be here)." >&2
    exit 1
fi

changed=0
while IFS= read -r f; do
    nav=$(grep -c 'js/nav/navigation\.js' "$f" || true)
    ux=$(grep -c 'js/cart/cart-ux\.js' "$f" || true)
    [ "$nav" -eq 0 ] && [ "$ux" -eq 0 ] && continue

    changed=$((changed + 1))
    echo "== $f"
    grep -n 'js/nav/navigation\.js\|js/cart/cart-ux\.js' "$f" | sed 's/^/     before: /'

    if [ "$APPLY" -eq 1 ]; then
        # Add the new auth.js only if the page does not already load it.
        if ! grep -q 'js/auth\.js"' "$f"; then
            perl -0pi -e 's{^([ \t]*)<script src="((?:\.\./)*)js/nav/navigation\.js"></script>}{$1<script src="$2js/auth.js"></script>\n$1<script src="$2js/nav.js"></script>}m' "$f"
        else
            perl -0pi -e 's{js/nav/navigation\.js}{js/nav.js}' "$f"
        fi
        perl -0pi -e 's{js/cart/cart-ux\.js}{js/toast.js}' "$f"
        grep -n 'js/auth\.js\|js/nav\.js\|js/toast\.js' "$f" | sed 's/^/     after:  /'
    fi
done < <(find index.html pages -name '*.html' | sort)

echo
if [ "$APPLY" -eq 1 ]; then
    echo "Updated $changed page(s). Review with: git diff"
else
    echo "$changed page(s) would change. Re-run with --apply to make the changes."
fi