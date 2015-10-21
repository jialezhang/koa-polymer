define(['jquery'], function($) {
  // jquery.ease plugin部分使用
  $.easing['jswing'] = $.easing['swing'];
  $.extend(
    $.easing,{
def: 'easeOutQuad',
        swing: function (x, t, b, c, d) {
                //alert($.easing.default);
                return $.easing[$.easing.def](x, t, b, c, d);
        },
        easeInQuad: function (x, t, b, c, d) {
                return c*(t/=d)*t + b;
        },
        easeOutQuad: function (x, t, b, c, d) {
                return -c *(t/=d)*(t-2) + b;
        },
        easeInOutQuad: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInCubic: function (x, t, b, c, d) {
                return c*(t/=d)*t*t + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t + b;
                return c/2*((t-=2)*t*t + 2) + b;
        },
        easeInQuart: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t + b;
        },
        easeOutQuart: function (x, t, b, c, d) {
                return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOutQuart: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        easeInQuint: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t*t + b;
        },
        easeOutQuint: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOutQuint: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                return c/2*((t-=2)*t*t*t*t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d) {
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
                return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },
        easeInExpo: function (x, t, b, c, d) {
                return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOutExpo: function (x, t, b, c, d) {
                return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d) {
                if (t==0) return b;
                if (t==d) return b+c;
                if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (x, t, b, c, d) {
                return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOutCirc: function (x, t, b, c, d) {
                return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOutCirc: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },
        easeInElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        easeInOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        easeInBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        easeInBounce: function (x, t, b, c, d) {
                return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
                if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                }
        },
        easeInOutBounce: function (x, t, b, c, d) {
                if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
                return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    });
    $.fn.collapsible = function(options) {
      var defaults = {
        accordion: undefined
      };

      options = $.extend(defaults, options);


      return this.each(function() {

        var $this = $(this);

        var $panel_headers = $(this).find('>.collapsible-header');

        var collapsible_type = $this.data("collapsible");

        // Turn off any existing event handlers
        $this.off('click.collapse', '.collapsible-header');
        $panel_headers.off('click.collapse');

        /****************
         Helper Functions
         ****************/

        // Accordion Open
        function accordionOpen(object) {
          $panel_headers = $this.find('>.collapsible-header');
          if (object.hasClass('active')) {
            object.parent().addClass('active');
          }
          else {
            object.parent().removeClass('active');
          }
          if (object.parent().hasClass('active')){
            object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
          }
          else{
            object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
          }
          $panel_headers.not(object).removeClass('active').parent().removeClass('active');
          $panel_headers.not(object).parent().children('.collapsible-body').stop(true,false).slideUp(
            {
              duration: 350,
              easing: "easeOutQuart",
              queue: false,
              complete:
              function() {
                $(this).css('height', '')
              }
            });
        }

        // Expandable Open
        function expandableOpen(object) {
          if (object.hasClass('active')) {
            object.parent().addClass('active');
          }
          else {
            object.parent().removeClass('active');
          }
          if (object.parent().hasClass('active')){
            object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '')}});
          }
          else{
            object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '')}});
          }
        }

        /**
         * Check if object is children of panel header
         * @param  {Object}  object Jquery object
         * @return {Boolean} true if it is children
         */
        function isChildrenOfPanelHeader(object) {

          var panelHeader = getPanelHeader(object);

          return panelHeader.length > 0;
        }

        /**
         * Get panel header from a children element
         * @param  {Object} object Jquery object
         * @return {Object} panel header object
         */
        function getPanelHeader(object) {

          return object.closest('.collapsible-header');
        }

        /*****  End Helper Functions  *****/



        if (options.accordion || collapsible_type == "accordion" || collapsible_type == undefined)
        { // Handle Accordion
          // Add click handler to only direct collapsible header children
          $panel_headers = $this.find('> .collapsible-header');
          $panel_headers.on('click.collapse', function (e) {
            var element = $(e.target);

            if (isChildrenOfPanelHeader(element)) {
              element = getPanelHeader(element);
            }

            element.toggleClass('active');

            accordionOpen(element);
          });
          // Open first active
          accordionOpen($panel_headers.filter('.active').first());
        }
        else { // Handle Expandables
          $panel_headers.each(function () {
            // Add click handler to only direct collapsible header children
            $(this).on('click.collapse', function (e) {
              var element = $(e.target);
              if (isChildrenOfPanelHeader(element)) {
                element = getPanelHeader(element);
              }
              element.toggleClass('active');
              expandableOpen(element);
            });
            // Open any bodies that have the active class
            if ($(this).hasClass('active')) {
              expandableOpen($(this));
            }
          });
        }
      });
    };
  });
