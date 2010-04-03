/*global _, lang */
//l10n

function _(str) {
    if (lang && lang[str]) {
        return lang[str];
    } else {
        return str;
    }
}
