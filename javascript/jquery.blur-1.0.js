(function($) {
	$.fn.blur = function(options) {    
		var opts = $.extend({}, $.fn.blur.defaults, options);  
		return this.each(function() {   _this = $(this);   _alpha = $('<div/>').appendTo(this);
			_img = $('img', this).duplicate(1).appendTo(_alpha);
			$('img', _this).remove();
			$('img', _alpha).hide();  
			var options = $.meta ? $.extend({}, opts, $this.data()) : opts;           _img.bind('load', function() {
				_this.css({
					position: 'relative',
					   width: _img.attr('width'),
					     height: _img.attr('height')   
				});      _alpha.css({   width: _img.attr('width'),
					     height: _img.attr('height'),
					   
				});      _img.css({   position: 'absolute',
					   'z-index': -1   
				});      
			});  $.fn.blur.create(_alpha, _img, options);    
		}); 
	};  $.fn.blur.create = function(obj, img, options) {
		imgs = img.duplicate(options.nimgs);
		for (i = 0; i < imgs.length; i++) {
			$(imgs[i]).pixastic("blurfast", {
				amount: parseFloat(5 - ((i + 1) / 10))
			}).css({
				position: 'absolute',
				'z-index': i,
				opacity: parseFloat((options.nimgs / 10) - ((i * options.opacity) / 10))
			});
			$.fn.blur.position($(imgs[i]), i, options);
		}
		imgs.appendTo(obj); 
	};  $.fn.blur.position = function(obj, pos, options) { 
		switch (options.position) {  
		case 'top left':
			  obj.css({
				top: -parseInt(pos * 3),
				left: parseInt(pos * 3)
			}); 
			break;  
		case 'top right':
			    obj.css({
				top: -parseInt(pos * 3),
				right: parseInt(pos * 3)
			});  
			break;   
		case 'top top':
			      obj.css({
				top: parseInt(pos * 5)
			}); 
			break;  
		case 'bottom left':
			   obj.css({
				top: parseInt(pos * 3),
				left: parseInt(pos * 3)
			});  
			break; 
		case 'bottom right':
			   obj.css({
				top: parseInt(pos * 3),
				right: parseInt(pos * 3)
			});  
			break;   
		case 'bottom bottom':
			      obj.css({
				top: parseInt(pos * 5)
			});  
			break;   
		} 
	};  $.fn.blur.end = function() {  $('img:first', _this).clone().appendTo(_this).css({  opacity: 1  
		});  $('div', _this).remove();  
	};   $.fn.duplicate = function(count, cloneEvents) { 
		var tmp = []; 
		for (var i = 0; i < count; i++) { $.merge(tmp, this.clone(cloneEvents).get()); 
		} 
		return this.pushStack(tmp); 
	}; $.fn.blur.defaults = { opacity: 0.7,
		  nimgs: 5,
		  position: 'top top' 
	};   $.fx.step['blur'] = function(fx) { 
		if (fx.state == 0) { $(fx.elem).blur({
				nimgs: fx.end
			}); 
		}  
	}; 
})(jQuery);
