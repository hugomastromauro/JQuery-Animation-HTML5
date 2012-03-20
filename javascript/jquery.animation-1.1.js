/*
 * jQuery Animate v1.1 - http://www.hugomastromauro.com
 * 
 * Copyright © 2011 Hugo Mastromauro
 * All rights reserved.
 *
 */

;(function($) {
	
	$.fn.extend({
		
		animation:function(options) {
			
			// Definição de propriedades
			var defaults = $.extend({}, $.init.defaults, {
				
				els: [], // Array de elementos
				order: 0, // Ordenação
    			event: (navigator.userAgent.match(/iPad/i)) ? "touchend" : "click" // Definição de evento touch ou click
	  		
			}, options);

			var prefix = 'data-', // Prefixo do atributo
				len = this.length; // Quantidade de elementos com animação
			
			return this.each(function(i, el) {
				
				// Recupera atributos dos elementos					  
				args = el.getAttribute(prefix + 'effects');
				
	       		try {
					args = jQuery.parseJSON(args);
				} catch(e) { 
					return;
				}
				
				// Recupera as opções do elemento
				if (!args.options)
					args['options'] = {};
				
				// Verifica se o elemento vai fazer duas ações
				if (typeof args.orientation == 'object') {
					
					// Verifica e executa animação sequêncial
					if (args.iteration) {

						$(args.iteration, el).each(function(index, el){

							$.each(args.orientation, function(index, value) {
								
								// Verifica se tem função de retorno								
								if (index == args.orientation.length-1) {
									if (args.options.callback)
										value.callback = args.options.callback;
								}
								
								// Chama a função que define as animações
								$.orientation(value, el, defaults, args.options);
								
							});
							
						});
						
					} else {

						// Se não for sequêncial, executa de forma simples
						$.each(args.orientation, function(index, value) { 						

							// Verifica se tem função de retorno								
							if (index == args.orientation.length-1) {
								if (args.options.callback)
									value.callback = args.options.callback;
							}
								
							// Chama a função que define as animações
							if (typeof value.orientation == 'string' && value.orientation == 'event') {
								
								$.eventHandler(value, el, defaults);
								
							}else{
								$.orientation(value, el, defaults, args.options);
							}
							
						});
					}
					
				} else if (typeof args.orientation == 'string' && args.orientation == 'event') {

					$.eventHandler(args, el, defaults);
			
				} else {
					
					// Verifica se tem função de retorno
					if (args.options.callback)
							args.callback = args.options.callback;
													
					// Chama a função que define as animações
					$.orientation(args, el, defaults, args.options);
				}
				
				// Ordena os elementos
				defaults.els.sort(function(a, b){
 					return a.order-b.order;
				});
				
				// Só executa a animação quando todos os elementos estiverem preparados						
				if (i == len-1)
					$.init(defaults);
				
			});
		}
	});
	
	$.eventHandler = function(args, el, defaults){
	
		// Verifica se é um evento e prepara a animação
		eventobj = defaults.events[args.name];

		// Faz as mesmas verificações de ações			
		if (typeof eventobj.orientation == 'object') {
			
			$.each(eventobj.orientation, function(index, value) { 

				// Verifica se tem função de retorno								
				if (index == eventobj.orientation.length-1) {
					if (eventobj.options.callback)
						value.callback = eventobj.options.callback;
				}

				// Chama a função que define as animações				
				$.orientation(value, el, defaults, eventobj.options);
			});
			
		} else {

			// Verifica se tem função de retorno
			if (args.options.callback)
					eventobj.orientation.callback = args.options.callback;

			// Chama a função que define as animações			
			$.orientation(eventobj.orientation, el, defaults, eventobj.options);
		}
	};
		
	$.orientation = function(args, el, defaults, options){

		// Define se vai começar com alpha ou não
		var rise = options.rise >= 0 ? options.rise : defaults.rise;

		// Objeto que define as propriedades da animação
		var anim = {
			'obj': el, // Elemento
			'start': {}, // Propriedades de início
			'end': {}, // Propriedades de fim
			'duration': !args.duration ? defaults.duration : args.duration, // Duração da animação
			'easing': !args.easing ? defaults.easing : args.easing, // Tipo de efeito
			'defined': !options.defined ? defaults.defined : options.defined, // Animação pré-definida
			'order': options.order, // Ordem de execução das animações
			'timeout': options.timeout ? options.timeout : 0, // Pausa das animações
			'callback': options.callback ? options.callback : null, // Função de retorno
			'event': options.event ? options.event : null
		};
		
		// Define todas as propriedades da animação			
		if (typeof args == 'object') {	
			$.each(args, function(key, value) {				
				anim[key] = value;
			});
		}
		
		// Define propriedades do evento
		if (options.event) {
			anim['event'] = options.event;
			anim['target'] = options.target ? options.target : null;
		}
		
		// Define propriedades do efeito blur
		if (options.blur) {
			options.blur['opacity'] = options.blur['opacity'] ? options.blur['opacity'] : defaults.blur.opacity;
			options.blur['nimgs'] = options.blur['nimgs'] ? options.blur['nimgs'] : defaults.blur.nimgs;
			
			anim['defined'] = 'blur';
			anim['blur'] = options.blur;
			
			// Cria elementos do blur
			$.blur(el, options);
		}

		if (options.sequential) {

			rel = $('<div/>')
				.css({ position: 'relative' })
				.appendTo($(el));
			
			$('img', el)
    			.css({
    				position: 'absolute',
    				zIndex: 0,
    				opacity: 0
    			})
    			.appendTo(rel);
    		
    		options.sequential['loops'] = options.sequential['loops'] ? options.sequential['loops'] : defaults.sequential.loops;
    		options.sequential['framerate'] = options.sequential['framerate'] ? options.sequential['framerate'] : defaults.sequential.framerate;
			
			if (typeof args == 'object') {
    			anim['callback'] = $.sequential(el, options);
    		}else{
    			anim['callback'] = 'sequential';
    			$.sequential(el, options);	
    		}
		}
		
		// Define propriedades de alpha (nascer) do elemento
 		if (rise == 0) {
			anim.start['opacity'] = 1;			
			anim.end['opacity'] = 1;
		} else if (rise == 1) {
			anim.start['opacity'] = 0;			
			anim.end['opacity'] = 1;
		} else if (rise == 2) {
			anim.start['opacity'] = 1;			
			anim.end['opacity'] = 0;
		} else if (rise == 3) {
			anim.start['opacity'] = 0;			
			anim.end['opacity'] = options.opacity;
		} 

		// Guarda o objeto com as propriedades da animação no array de elementos e compartilha com as outras funções
		defaults.els[defaults.order] = anim;
		defaults.order++;
		
		//console.debug(anim);
	};
	
	$.sequential = function(el, options) {
		
		var f = 1000/options.sequential.framerate,
       		loops = options.sequential.loops,
       		num = 0,
       		len = $('img', el).length;

    	var timer = setInterval(function() { 
    
    		z = len - num;
			
    		$('img', el)
    			.css({ opacity: 0, zIndex: 0 });
		
	    	$('img', el)
	    		.eq(num)
	    		.css({ zIndex: z, opacity: 1 });
             		
	    	if (num == len-1) {

    			if (loops == 1) {
    				
    				clearTimeout(timer); 
	    		   	timer = null;

	    		   	if (typeof window[options.callback] == 'function') {
    					window[options.callback]();
    				}
	    		   	
    			}else if (loops > 1){
		      		loops--;
				}
				
		      	num = 0;
		      	
    		}else{
    			num++;
	    	}
		}, f); 		
	};
	
	// Função que cria os elementos do blur
	$.blur = function(el, options) {
	
		var element = $(el), // Elemento atual
	      	alpha = $('<div/>').appendTo(element), // Elemento principal
			img = $('img', element).duplicate(1).appendTo(alpha), // Elemento fantasma
			opc = options.blur.opacity, // Opacidade do blur
			nimgs = options.blur.nimgs; // Número de imagens para criar o efeito blur
		
		// Remove elemento fantasma			
		$('img', element).remove();
		$('img', alpha).hide();
		 
		// Executa apenas quando as imagens estiverem carregadas           		     		 
      	img.bind('load', function (){
			
			// Define formas dos elementos do blur
			element.css({
				position: 'relative',
	      		width: img.attr('width'),
	      	   	height: img.attr('height')
	      	});
			
			// Define formas do elemento principal		      			
	      	alpha.css({
				position: 'relative',
	      		width: img.attr('width'),
	      	    height: img.attr('height'),
	      	});
	      	
			// Define posições das imagens para o efeito blur		
	      	img.css({
	      		position: 'absolute',
	      		'z-index': -1
	      	});
      	});
		
		// Duplica as imagens pela quantidade de imagens necessária para o efeito	
		imgs = img.duplicate( nimgs );
		
		// Define propriedades do primeiro elemento visível
		$(imgs[imgs.length-1]).css({ 
					position: 'absolute',
					'z-index': imgs.length 
				})
				.pixastic( "blurfast", { amount: 200 });
		
		// Define propriedades das imagens
		for (i=0; i<(imgs.length-1); i++) {	
			$(imgs[i])
				.pixastic( "blurfast", { amount: parseFloat(5-((i+1)/10)) } )
				.css({
					position: 'absolute',
					'z-index': i,
					opacity: parseFloat((1/nimgs)*(i*opc))
			});	
		}
		
		// Insere as imagens no elemento principal
		imgs.appendTo(alpha);
	};
	
	// Função que duplica elementos
	$.fn.duplicate = function( count, cloneEvents ) {	
  		var tmp = [];
  		for ( var i = 0; i < count; i++ ) {
  			$.merge( tmp, this.clone( cloneEvents ).get() );
  		}
  		return this.pushStack( tmp );
  	};
	
	// Início das animações
	$.init = function (defaults) {				
		
		var count = 0; // Contagem de execuções
		
		// Define pausa para o começo de todas animações
		window.setTimeout(function() {

        	effect.init(count);
        
    	}, defaults.timestart);

    	var effect = {
    		
    		init: function(el){
				 
				// Verifica se é um evento
    			if (typeof defaults.els[el].event == 'string') {

					// Elemento da ação
					var target = defaults.els[el].target == null ? defaults.els[el].obj : defaults.els[el].target,
						event = defaults.els[el].event == 'click' ? defaults.event : defaults.els[el].event;
					
					// Atachando o evento no elemento
	    			$(target).bind(event, function(e){
    					e.preventDefault();

    					// Executa animação pré-definida
    					window.setTimeout(function() {
    						effect[defaults.els[el].defined](el);
    					}, defaults.els[el].timeout);
    				
    					$(this).unbind(event);
    					
    				});
    				
					if (count < defaults.els.length-1) {
	        			count++;
	        			effect.init(count);
	        		}
    				
    			} else {
					
					// Definindo pausa para o começo da animação do elemento
    				window.setTimeout(function() {
    					effect[defaults.els[el].defined](el);
    				}, defaults.els[el].timeout);
    			}    		
    		},
    		
    		// Animação pré-definida básica
    		basic: function(el) {
    			
    			/// Definindo as propriedades de posicionamento padrão css se não for informado.
    			/*$.each(defaults.els[el].end, function(key, value){
    				if (value === "") {
    					defaults.els[el].end[key] = $(defaults.els[el].obj).css(key);
    				}
    			});*/
    			
    			this.calculate(el);
				
    			$(defaults.els[el].obj)
    				.css(defaults.els[el].start)
    				.animate(defaults.els[el].end, defaults.els[el].duration, defaults.els[el].easing, effect.callbackeffect);
    		},
    		
    		// Animação pré-definida de zoom
    		zoom: function(el) {
    		
    			//implementar
    		},
    		
    		// Animação pré-definida de blur
    		blur: function(el) {
				
				/*
				 * Corrigir propriedades de direção do blur
				 *
				 */
				
				$('img', defaults.els[el].obj).each(function(i) {
				
					$(this).animate({ top: parseInt(i*defaults.els[el].blur.nimgs) });
				});
				
    			$(defaults.els[el].obj)
    				.css(defaults.els[el].start)
    				.animate(defaults.els[el].end, { 
    						
    						duration: defaults.els[el].duration,
    						easing: defaults.els[el].easing,
    						step: function(now, fx) {
    						
    							if ( now > fx.end-10 ) {
    							
    								$('img', this).animate({ top: 0 }, 50);
    							}
    						},
    						complete: effect.callbackeffect						
    					});
    				
    		},
    		
    		// Animação pré-definida de rotacionar
    		rotate: function(el) {
				
					rotate = defaults.els[el].start.rotate;
										
    			$(defaults.els[el].obj)
    				.rotate(rotate)
    				.css(defaults.els[el].start)
    				.animate(defaults.els[el].end, defaults.els[el].duration, defaults.els[el].easing, effect.callbackeffect);
	        		
    		},
    		
    		// Animação pré-definida de slide de conteúdo
    		slide: function(el) {

    			if (defaults.els[el].end.width == undefined)
    				defaults.els[el].end.width = $(defaults.els[el].obj).width();
    				
    			if (defaults.els[el].start.width == undefined)
    				defaults.els[el].start.width = 0;
    				
   				if (defaults.els[el].end.height == undefined)
    				defaults.els[el].end.height = $(defaults.els[el].obj).height();
    				
    			if (defaults.els[el].start.height == undefined)
    				defaults.els[el].start.height = 0;
    			
    			$(defaults.els[el].obj)
    				.css(defaults.els[el].start)
    				.animate(defaults.els[el].end, defaults.els[el].duration, defaults.els[el].easing, effect.callbackeffect);
    			
    		},
    		
    		sequential: function(el) {
    			return;
    		},
    		
    		// Animação pré-definida de escala
    		scale: function(el) {

    			scale = defaults.els[el].start.scale;
				
				$(defaults.els[el].obj)
					.scale(scale)
					.css(defaults.els[el].start)
					.animate(defaults.els[el].end, defaults.els[el].duration, defaults.els[el].easing, effect.callbackeffect);
					
    		},
    		
    		calculate: function(el) {
    			
    			/// Definindo as propriedades de posicionamento padrão css se não for informado.
    			$.each(defaults.els[el].end, function(key, value){
    			
    				var obj = $(defaults.els[el].obj);

    				if (value === "") {
    					defaults.els[el].end[key] = obj.css(key);
    				}
    			
    				if (value.toString().indexOf('+=') != -1) {
    					defaults.els[el].end[key] = parseInt(obj.css(key).match(/\d+/)) + parseInt(value.toString().match(/\d+/));
    				}
    				
    				if (value.toString().indexOf('-=') != -1) {
    					defaults.els[el].end[key] = parseInt(obj.css(key).match(/\d+/)) - parseInt(value.toString().match(/\d+/));
    				}
    			});
    			
    			
    			$.each(defaults.els[el].start, function(key, value){

    				var obj = $(defaults.els[el].obj);

    				if (value === "") {
    					defaults.els[el].start[key] = obj.css(key);
    				}
    				
    				    				
    				if (value.toString().indexOf('+=') != -1) {
    					defaults.els[el].start[key] = parseInt(obj.css(key).match(/\d+/)) + parseInt(value.toString().match(/\d+/));
    				}
    				
    				if (value.toString().indexOf('-=') != -1) {
    					defaults.els[el].start[key] = parseInt(obj.css(key).match(/\d+/)) - parseInt(value.toString().match(/\d+/));
    				}
    			});
    		},
    		
    		// Retorno das animações
    		callbackeffect: function() {
				
				// Executa função de retorno se definida
    			if (typeof window[defaults.els[count].callback] == 'function')
    				window[defaults.els[count].callback]();
    			 
    			// Verifica estado das animações e continua execução    			
    			if (count < defaults.els.length-1) {
	        		count++;
	        		effect.init(count);
	        	}		
    		}
    	};
	};
    
    // Funções auxiliares
    var rotateUnits = 'deg';
    $.fn.rotate = function (val)
    {
        var style = $(this).css('-webkit-transform') || 'none';
        
        if (typeof val == 'undefined')
        {
            if (style)
            {
                var m = style.match(/rotate\(([^)]+)\)/);
                if (m && m[1])
                {
                    return m[1];
                }
            }
            
            return 0;
        }
        
        var m = val.toString().match(/^(-?\d+(\.\d+)?)(.+)?$/);
        if (m)
        {
            if (m[3])
            {
                rotateUnits = m[3];
            }
            
            $(this).css(
                '-webkit-transform',
                style.replace(/none|rotate\([^)]*\)/, '') + 'rotate(' + m[1] + rotateUnits + ')'
            );
        }

        return this;
    }
    
    $.fn.scale = function (val, duration, options)
    {
        var style = $(this).css('-webkit-transform');
        
        if (typeof val == 'undefined')
        {
            if (style)
            {
                var m = style.match(/scale\(([^)]+)\)/);
                if (m && m[1])
                {
                    return m[1];
                }
            }
            
            return 1;
        }
        
        $(this).css(
            '-webkit-transform',
            style.replace(/none|scale\([^)]*\)/, '') + 'scale(' + val + ')'
        );
        
        return this;
    }

    var curProxied = $.fx.prototype.cur;
    $.fx.prototype.cur = function ()
    {
        if (this.prop == 'rotate')
        {
            return parseFloat($(this.elem).rotate());
        }
        else if (this.prop == 'scale')
        {
            return parseFloat($(this.elem).scale());
        }
        
        return curProxied.apply(this, arguments);
    }
    
    $.fx.step.rotate = function (fx)
    {
        $(fx.elem).rotate(fx.now + rotateUnits);
    }
    
    $.fx.step.scale = function (fx)
    {
        $(fx.elem).scale(fx.now);
    }
        
    var animateProxied = $.fn.animate;
    $.fn.animate = function (prop)
    {
        if (typeof prop['rotate'] != 'undefined')
        {
            var m = prop['rotate'].toString().match(/^(([+-]=)?(-?\d+(\.\d+)?))(.+)?$/);
            if (m && m[5])
            {
                rotateUnits = m[5];
            }
            
            prop['rotate'] = m[1];
        }

        return animateProxied.apply(this, arguments);
    }
	
	// Propriedades padrões
	$.init.defaults = {
		fix: 20,
		timestart: 700,
		duration: 600,
	  	direction: 'left',
	  	defined: 'basic',
	  	easing: 'linear',
	  	rise: 1,
	  	opacity: 1,
	  	blur: {
	  		nimgs: 7,
	  		opacity: 0.7
	  	},
	  	sequential: {
	  		loops: 10, // infinite
	  		framerate: 20
	  	},
	  	events: {}
	};   
	
})(jQuery);
