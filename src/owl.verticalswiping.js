;(function($, window, document) {
	var VerticalSwiping = function(carousel){
		this._core = carousel;
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function(e) {
				if(!e.namespace || !this._core.settings || this._core.settings.verticalSwiping) {
					return;
				}

				var isFirstTouchmove;
				var isTouchmoveDisabled;
				var startX;
				var startY;
				var moveX;
				var moveY;

				this._core.$element.on('touchstart', function(touchstartEvent) {
					isFirstTouchmove = true;
					isTouchmoveDisabled = false;
					startX = touchstartEvent.originalEvent.touches[0].clientX;
					startY = touchstartEvent.originalEvent.touches[0].clientY;
				}).on('touchmove', function(touchmoveEvent) {
					if(isFirstTouchmove) {
						isFirstTouchmove = false;
						moveX = touchmoveEvent.originalEvent.touches[0].clientX;
						moveY = touchmoveEvent.originalEvent.touches[0].clientY;
						// disable touchmove when swiping horizontally
						isTouchmoveDisabled = Math.abs(moveX - startX) >= Math.abs(moveY - startY);
					}

					if(isTouchmoveDisabled) {
						touchmoveEvent.preventDefault();
					}
				});
			}, this),
		};

		// set the default options
		this._core.options = $.extend({}, VerticalSwiping.Defaults, this._core.options);

		// register event handler
		this._core.$element.on(this._handlers);
	};

	VerticalSwiping.Defaults = {
		verticalSwiping: false, // default: disable
	};

	// destroy:
	VerticalSwiping.prototype.destroy = function() {
		for(var handler in this.handlers) {
			this._core.$element.off(handler, this.handlers[handler]);
		}
		for(var property in Object.getOwnPropertyNames(this)) {
			typeof this[property] !== 'function' && (this[property] = null);
		}
	};
	$.fn.owlCarousel.Constructor.Plugins['verticalSwiping'] = VerticalSwiping;
})(window.Zepto || window.jQuery, window, document);
