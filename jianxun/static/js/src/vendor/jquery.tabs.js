define(['jquery', 'Vendor/jquery.velocity.min'], function($, velocity) {

  $.fn.velocity = velocity;
  var methods = {
    init : function() {
      return this.each(function() {

        // For each set of tabs, we want to keep track of
        // which tab is active and its associated content
        var $this = $(this),
            window_width = $(window).width();

        $this.width('100%');
        // Set Tab Width for each tab
        var $num_tabs = $(this).children('li').length,
            $tabs = $(this).children('li');
        /* $this.children('li').each(function() {
           $(this).width((100/$num_tabs)+'%');
           }); */
        var $active, $content, $links = $this.find('li.tab a'),
            $tabs_width = $this.width(),
            $tab_width = $this.find('li').first().outerWidth(),
            $index = 0, $prev_index = 0;
        function calRightSpace(index){
          var space = 0;
          for(var i = index + 1; i < $num_tabs; i++){
            space += $($tabs[i]).outerWidth();
          }
          return space ;
        }
        function calLeftSpace(index){
          var leftSpace = 0;
          for(var i = 0; i < index; i++){
            leftSpace += $($tabs[i]).outerWidth();
          }
          return leftSpace;
        }
        // If the location.hash matches one of the links, use that as the active tab.
        $active = $($links.filter('[href="'+location.hash+'"]'));

        // If no match is found, use the first link or any with class 'active' as the initial active tab.
        if ($active.length === 0) {
          $active = $(this).find('li.tab a.active').first();
        }
        if ($active.length === 0) {
          $active = $(this).find('li.tab a').first();
        }

        $active.addClass('active');
        $index = $links.index($active);
        if ($index < 0) {
          $index = 0;
        }

        $content = $($active[0].hash);

        // append indicator then set indicator width to tab width
        $this.append('<div class="indicator"></div>');
        var $indicator = $this.find('.indicator');
        if ($this.is(":visible")) {
          $indicator.css({"right": calRightSpace($index) + 16});
          $indicator.css({"left": $index * $tab_width + 16});
        }
        $(window).resize(function () {
          $tabs_width = $this.width();
          $tab_width = $this.find('li').first().outerWidth();
          if ($index < 0) {
            $index = 0;
          }
          if ($tab_width !== 0 && $tabs_width !== 0) {
            $indicator.css({"right": $tabs_width - (($index + 1) * $tab_width)});
            $indicator.css({"left": $index * $tab_width});
          }
        });

        // Hide the remaining content
        $links.not($active).each(function () {
          $(this.hash).hide();
        });


        // Bind the click event handler
        $this.on('click', 'a', function(e){
          $tabs_width = $this.width();
          $tab_width = $this.find('li').first().outerWidth();

          // Make the old tab inactive.
          $active.removeClass('active');
          $content.hide();

          // Update the variables with the new link and content
          $active = $(this);
          $content = $(this.hash);
          $links = $this.find('li.tab a');

          // Make the tab active.
          $active.addClass('active');
          $prev_index = $index;
          $index = $links.index($(this));
          if ($index < 0) {
            $index = 0;
          }
          // Change url to current tab
          // window.location.hash = $active.attr('href');

          $content.show();

          // Update indicator
          /* 这里的16是在navbar里面设置的padding值保证indicator只比内容多一丢丢  */
          if (($index - $prev_index) >= 0) {

            var next_tab_width = $($tabs[$index]).outerWidth();
            $indicator.velocity({"right": calRightSpace($index) + 16}, { duration: 300, queue: false, easing: 'easeOutQuad'});
            $indicator.velocity({"left": $tabs_width - calRightSpace($index) - next_tab_width + 16 }, {duration: 300, queue: false, easing: 'easeOutQuad', delay: 90});
          }
          else {
            var next_tab_width = $($tabs[$index]).outerWidth();
            $indicator.velocity({"left":  calLeftSpace($index) + 16 }, {duration: 300, queue: false, easing: 'easeOutQuad', delay: 90});
            $indicator.velocity({"right": calRightSpace($index) + 16}, { duration: 300, queue: false, easing: 'easeOutQuad'});

          }
          /* 不放开点击没法pjax请求了 */
          // Prevent the anchor's default click action
          /* e.preventDefault(); */
        });
      });

    },
    select_tab : function( id ) {
      this.find('a[href="#' + id + '"]').trigger('click');
    }
  };

  $.fn.tabs = function(methodOrOptions) {
    if ( methods[methodOrOptions] ) {
      return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
      // Default to "init"
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
    }
  };
})
