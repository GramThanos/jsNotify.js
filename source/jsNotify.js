/*
 * jsNotify v1.1.0
 *
 *
 * MIT License
 *
 * Copyright (c) 2018 Grammatopoulos Athanasios-Vasileios
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

var jsNotify = (function() {

	// Section Object
	var Section = function (name) {
		// Section's name
		this.name = name;
		// Notifications id increment
		this.inc = 0;
		// List of active notifications
		this.notifies = [];
		// Section's html element
		this.div = document.createElement('div');
		this.div.className = 'jsNotify-section';
		this.div.id = 'jsNotify-section-' + name;
		document.body.appendChild(this.div);
	}
	Section.prototype.hide = function () {
		this.div.style.display = 'none';
	}
	Section.prototype.show = function () {
		this.div.style.display = 'block';
	}

	// Section manager
	Section.list = {};
	Section.create = function (name) {
		if (!Section.list.hasOwnProperty(name)) {
			Section.list[name] = new Section(name);
		}
		return Section.list[name];
	};
	Section.get = function (name) {
		if (Section.list.hasOwnProperty(name)) {
			return Section.list[name];
		}
		return null;
	};

	// Create a Notify object
	var Notify = function (message, classes, options) {
		// Save instance
		var that = this;

		// Options default value
		this.options = {
			section : Notify.options.section,
			time2live : Notify.options.time2live,
			close_btn : Notify.options.close_btn,
			speed : Notify.options.speed,
			fps : Notify.options.fps
		};
		if (typeof options !== 'undefined') {
			for (var item in options) {
				if (this.options.hasOwnProperty(item)) {
					this.options[item] = options[item];
				}
			}
		}

		// Get section
		this.section = Section.create(this.options.section);

		// Generate an id
		this.id = ++this.section.inc;
		this.section.notifies[this.id] = this;

		// No active animations
		this._anim = false;

		// Create html elements
		// Actual notify div
		var div = document.createElement('div');
		div.className = 'jsNotify' + (typeof classes === 'string' && classes.length > 0 ? ' ' + classes : '');
		// Notify close button
		if (this.options.close_btn) {
			var close = document.createElement('div');
			close.className = 'jsNotify-close close';
			close.innerHTML = '&times;';
			close.addEventListener('click', function() {
				that.fadeOut(that.options.speed);
			}, false);
			div.appendChild(close);
		}
		// Content wrapper
		var content = document.createElement('div');
		content.className = 'jsNotify-content';
		if (typeof message === 'string') {
			content.innerHTML = message;
		}
		else {
			content.appendChild(message);
		}
		div.appendChild(content);
		// Clear float
		var clear = document.createElement('div');
		clear.className = 'jsNotify-clear';

		// Notify item wrapper
		var wrapper = document.createElement('div');
		// Hide it out of screen (to measure it)
		wrapper.style.position = 'absolute';
		wrapper.style.right = '-5000px';
		wrapper.style.opacity = 0;
		wrapper.appendChild(div);
		wrapper.appendChild(clear);
		document.body.appendChild(wrapper);

		// Calculate height
		this.height = Math.max(wrapper.clientHeight || 0, wrapper.scrollHeight || 0, wrapper.offsetHeight || 0);

		// Insert it on section
		this.section.div.appendChild(wrapper);
		
		// Initialize style
		wrapper.style.opacity = 0;
		wrapper.style.height = '0px';
		wrapper.style.overflow = 'hidden';
		wrapper.style.position = '';
		wrapper.style.right = '';
		this.wrapper = wrapper;

		this.fadeIn(this.options.speed);

		// If hide timer
		if (this.options.time2live) {
			this.timeout = window.setTimeout(function() {
				that.fadeOut(that.options.speed);
			}, this.options.time2live);
		}
	}

	Notify.prototype.fadeIn = function(time) {
		if (this._fadding_in) return;
		this._fadding_in = true;

		var that = this;
		this.wrapper.style.opacity = 1;
		this.wrapper.style.overflow = 'hidden';

		var anim = new sAnim(
			{from: 0, to: 100, time: time || 500, fps: 60},
			function(value) {
				var percent = Math.round(value) / 100;
				that.wrapper.style.opacity = percent;
				that.wrapper.style.height = Math.round(that.height * percent) + 'px';
			},
			function() {
				that.wrapper.style.height = '';
				that.wrapper.style.overflow = '';
				that.wrapper.style.opacity = '';
				that._fadding_in = false;
			}
		).start();

		// Stop other animations
		if (this._anim) this._anim.stop();
		this._anim = anim;
	};

	Notify.prototype.fadeOut = function(time, destroy) {
		if (this._fadding_out) return;
		this._fadding_out = true;

		var that = this;
		this.wrapper.style.overflow = 'hidden';

		var anim = new sAnim(
			{from: 100, to: 0, time: time || 500, fps: 30},
			function(value) {
				var percent = Math.round(value) / 100;
				that.wrapper.style.opacity = percent;
				that.wrapper.style.height = Math.round(that.height * percent) + 'px';
			},
			function() {
				that._fadding_out = false;
				if (typeof destroy === 'undefined' || destroy) {
					that.destroy();
				}
			}
		).start();

		// Stop other animations
		if (this._anim) this._anim.stop();
		this._anim = anim;
	};

	Notify.prototype.destroy = function() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
		this.wrapper.parentNode.removeChild(this.wrapper);
		delete this.section.notifies[this.id];
		delete this.wrapper;
	};

	// Default notify parameters
	Notify.options = {
		section : 'default',
		time2live : false,
		close_btn : true,
		speed : 250,
		fps : 60
	};

	// Public API
	var jsNotify = function(message, classes, options) {
		return new Notify(message, classes, options);
	}
	jsNotify.options = Notify.options;

	// Export
	return jsNotify;
})();

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
