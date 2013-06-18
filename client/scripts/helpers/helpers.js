// place your handlebars helpers here..

/**
 * Logs a value.
 * @method log
 * @param value
 */
Handlebars.registerHelper("log", function(value) {
    console.log(value);
});