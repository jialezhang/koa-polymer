import UI from 'UI/ui';
import 'UI/select';
import 'UI/range';

// 获取当前元素所有的属性
  $.fn.getAttributes = function() {
    var attributes = {};

    if( this.length ) {
      $.each( this[0].attributes, function( index, attr ) {
        attributes[ attr.name ] = attr.value;
      } );
    }

    return attributes;
  };

  // Text based inputs
  var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';

  // Handle HTML5 autofocus
  $('input[autofocus]').siblings('label, i').addClass('active');

  // Add active if input element has been pre-populated on document ready
  $(document).ready(function() {
    UI.updateTextFields();
  });

  // // Add active when element has focus
  $(document).on('focus', input_selector, function () {
    $(this).siblings('label, i').addClass('active');
  });

  $(document).on('blur', input_selector, function () {
    if ($(this).val().length === 0 && $(this).attr('placeholder') === undefined) {
      $(this).siblings('label, i').removeClass('active');
    }
  });

  $.fn.scrollTo = function(elem) {
    $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top);
    return this;
  };

  // Select Plugin

  // 初始化
  $('select').jx_select();
