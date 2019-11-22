;(function ( $, window, document, undefined ) {
	var TranslateEvent = function(carousel){
		this._core = carousel;
console.log(this._core);
window.o = this._core;
		var from;
		var current;
		function translateHandler() {
			carousel.trigger('move.owl.carousel', {
				widthcarousel.$stage
			});
		}
		this._handlers = {
			'drag.owl.carousel': $.proxy(function(e) {

				// console.log(e);
				console.log(this._core)
				// if(!e.namespace || !this._core.settings || this._core.settings.verticalSwiping) {
				// 	return;
				// }
				//
				// var isFirstTouchmove;
				// var isTouchmoveDisabled;
				// var startX;
				// var startY;
				// var moveX;
				// var moveY;
				//
				// this._core.$element.on('touchstart', function(touchstartEvent) {
				// 	isFirstTouchmove = true;
				// 	isTouchmoveDisabled = false;
				// 	startX = touchstartEvent.originalEvent.touches[0].clientX;
				// 	startY = touchstartEvent.originalEvent.touches[0].clientY;
				// }).on('touchmove', function(touchmoveEvent) {
				// 	if(isFirstTouchmove) {
				// 		isFirstTouchmove = false;
				// 		moveX = touchmoveEvent.originalEvent.touches[0].clientX;
				// 		moveY = touchmoveEvent.originalEvent.touches[0].clientY;
				// 		// disable touchmove when swiping horizontally
				// 		isTouchmoveDisabled = Math.abs(moveX - startX) >= Math.abs(moveY - startY);
				// 	}
				//
				// 	if(isTouchmoveDisabled) {
				// 		touchmoveEvent.preventDefault();
				// 	}
				// });
			}, this),
			'dragged.owl.carousel': $.proxy(function(e) {

			}, this),
			'translate.owl.carousel': $.proxy(function(e) {

			}, this),
			'translated.owl.carousel': $.proxy(function(e) {

			}, this),
		};

		// set the default options
		this._core.options = $.extend({}, TranslateEvent.Defaults, this._core.options);

		// register event handler
		this._core.$element.on(this._handlers);
	};


	TranslateEvent.Defaults = {
		optionName: 'value',
		optionName2: 'value'
	};
	//methods:
	TranslateEvent.prototype.method = function(){
		console.log('method');
	};
	//destroy:
	TranslateEvent.prototype.destroy = function(){
		//events here
	};
	$.fn.owlCarousel.Constructor.Plugins['translateEvent'] = TranslateEvent;
})( window.Zepto || window.jQuery, window,  document );
