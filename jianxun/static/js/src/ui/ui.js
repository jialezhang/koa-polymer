export default class UI {

  static updateTextFields() {
    let  input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
    $(input_selector).each(function(index, element) {
      if ($(element).val().length > 0 || $(this).attr('placeholder') !== undefined) {
        // 找到相关的同级元素
        $(this).siblings('label, i').addClass('active');
      }
      else {
        $(this).siblings('label, i').removeClass('active');
      }
    });
  };
  
};
