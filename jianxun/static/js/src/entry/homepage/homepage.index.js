import navbar from  'UI/component/navbar';
import validate from  'Helper/plugin/jquery.validate';

$(document).ready(() => {

  $('#invitationcode-apply-form').validate();
  $('.faq-type-list').find('.type-list-item').click(function() {
    let target = '.' + $(this).data('target') + '-content';
    $('.faq-collection-container').find('.faq-container-item').css({'display': 'none'});
    $('.faq-collection-container').find(target).css({'display': 'block'});
    $(this).siblings().removeClass('active');
    $(this).toggleClass('active');
  });

  $('.answer-content').find('li').click(function() {
    $(this).siblings().removeClass('active');
    let question = $(this).html().trim();
    $('.faq .caption-list').siblings('.caption-title').find('span').html(question);
    $('.faq .caption-list').children().removeClass('active');
    $('.faq .answer-content li').eq($(this).index()).addClass('active');
    $('.faq .caption-list li').eq($(this).index()).addClass('active');
  });

});
