/*
 * sAnim v1.0.0
 * https://github.com/GramThanos/sAnim
 *
 * MIT License
 * Copyright (c) 2018 Grammatopoulos Athanasios-Vasileios
 */

var sAnim = (function(){

	// Constructor
	function SAnim(optns, step, end) {
		optns = optns || {};
		
		// Save info
		this.d = {};
		// Start anim from value
		this.d.fm = (typeof optns.from === 'number') ? optns.from : 0;
		// Stop anim to value
		this.d.to = (typeof optns.to === 'number') ? optns.to : 0;
		// Anim time frame
		this.d.tf = (typeof optns.time === 'number' && optns.time > 0) ? optns.time : 500;
		// Time between frames
		this.d.ms = (typeof optns.fps === 'number' && optns.fps > 0) ? 1000/optns.fps : 1000/60;
		// Animation step
		this.d.sp = (this.d.to - this.d.fm) / (this.d.tf / this.d.ms);
		
		// Save callbacks
		this.c = {
			stp : step,
			end : end || null
		};
		
		// Animation is stopped
		this.stop();
    }

    // Version
    SAnim.version = 'v1.0.0';
	
	// Start the anim
	SAnim.prototype.start = function() {
		// Check if already running
		if (this.d.i) return;
		// Save instance
		var that = this;
		// Start interval
		this.d.i = setInterval(function() {
			that._step();
		}, this.d.ms);
		that._step();
		return this;
	}
	
	// Pause the anim
	SAnim.prototype.pause = function() {
		// Check if not running
		if (!this.d.i) return;
		clearInterval(this.d.i);
		this.d.i = null;
		return this;
	}
	
	// Stop the anim
	SAnim.prototype.stop = function() {
		this.pause();
		this.d.st = this.d.fm - this.d.sp;
		return this;
	}
	
	// Step the anim
	SAnim.prototype._step = function() {
		// If anim ended
		if (
			(this.d.sp > 0 && this.d.st >= this.d.to) ||
			(this.d.sp < 0 && this.d.st <= this.d.to)
		) {
			this._end();
			return;
		}
		// Calculate state
		this.d.st += this.d.sp;
		if (
			(this.d.sp > 0 && this.d.st > this.d.to) ||
			(this.d.sp < 0 && this.d.st < this.d.to)
		) {
			this.d.st = this.d.to;
		}
		
		// Call step
		this.c.stp(this.d.st, this.d.fm, this.d.to, this.d.tf);
		return this;
	}
	
	// Anim ended
	SAnim.prototype._end = function() {
		// Stop anim
		this.stop();
		// Call end callback
		if (this.c.end) {
			this.c.end(this.d.fm, this.d.to, this.d.tf);
		}
		return this;
	}

	// Return
	return SAnim;
})();
