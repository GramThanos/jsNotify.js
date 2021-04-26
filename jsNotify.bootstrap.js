/*
 * jsNotify v1.1.0
 * Bootstrap Theme API
 */

// Bootstrap jsNotify
jsNotify.bootstrap = function(message, type, options) {
	return jsNotify(message, 'alert alert-' + type + ' alert-dismissible', options);
};

// Functions for each alert type
jsNotify.primary = function(message, options) {
	return this.bootstrap(message, 'primary', options);
};
jsNotify.secondary = function(message, options) {
	return this.bootstrap(message, 'secondary', options);
};
jsNotify.success = function(message, options) {
	return this.bootstrap(message, 'success', options);
};
jsNotify.danger = function(message, options) {
	return this.bootstrap(message, 'danger', options);
};
jsNotify.warning = function(message, options) {
	return this.bootstrap(message, 'warning', options);
};
jsNotify.info = function(message, options) {
	return this.bootstrap(message, 'info', options);
};
jsNotify.light = function(message, options) {
	return this.bootstrap(message, 'light', options);
};
jsNotify.dark = function(message, options) {
	return this.bootstrap(message, 'dark', options);
};
