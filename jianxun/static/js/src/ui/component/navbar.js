import pjax from 'Vendor/jquery.pjax';
import tabs from 'Vendor/jquery.tabs';
import log from 'Helper/plugin/log';
import { Notify } from 'Setting/UrlMap';
import { AjaxCreate } from 'Data/AjaxHub';
import { mediaReset } from 'Helper/plugin/mediaReset';
import { picture } from 'Vendor/picturefill';


/* ________________________________________________________________________________ */
// let  currentRequests = {};

// $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
//   console.log(jqXHR);
//   if ( options.abortOnRetry ) {
//     alert('提交了');
//     if ( currentRequests[ options.url ] ) {
//       alert('重复提交');
//       currentRequests[ options.url ].abort();
//     }
//     currentRequests[ options.url ] = jqXHR;
//   }
// });

let toggleNotify = () =>{

};
$.extend({
  notify : function (content, options) {
    let notifyHeight = '-56px';
    let notifyMove = (callback) => {
      $('#notify').animate({
        'top': '0'}, '400', () => {
          setTimeout(() => {
            $('#notify').animate({'top': notifyHeight });
            // console.log(notifyHeight);
            if(callback && typeof callback === 'function') {
              callback();
            }
          }, 1000);
        });
    };

    if(!!options) {
      if(options.type === 'errors') {
        $('#notify').removeClass('success');
        $('#notify').addClass('errors');
      } else {
        $('#notify').removeClass('errors');
        $('#notify').addClass('success');
      }
      $('#notify p').html(content);

      notifyMove(options.callback);
      // $('#notify').classAnim('slideInDown', true, options.callback);

    } else {
      $('#notify').removeClass('errors');
      $('#notify').addClass('success');
      $('#notify p').html(content);
      notifyMove();
      // $('#notify').classAnim('slideInDown', true);
    }
    // close action
    $('#notify .cross').click((e) => {
      /* console.log('jia'); */
      $('#notify').animate({'top': notifyHeight});
    });
  }
});

$('document').on('keyup', (e) => {
  $('#notify').removeClass('errors success slideInDown');
});

$.extend({
  scrollTo : function( target, options, callback ){
    if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
    var settings = $.extend({
      scrollTarget  : target,
      offsetTop     : 50,
      duration      : 500,
      easing        : 'swing'
    }, options);
    return this.each(function(){
      var scrollPane = $(this);
      var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
      var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
      scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
        if (typeof callback == 'function') { callback.call(this); }
      });
    });
  }
});
$(document).ready(function(){
    /* 导航栏样式 */
    // $('nav ul.tabs').tabs();
    // 微信sidebar的删除
    $('.weixin-code .weixin-cross').click((e) => {
        $(e.target).closest('.extra-sidebar').remove();
    });

    let  style = 'background:#C5C8C6;color: #707880;font-size: 36px;border-radius: 2px';

  let NotifyAjax = AjaxCreate(Notify);
  /* 导航栏消息拉取等操作 */
  $('.navbar-menu-infobox').hover(
    function() {
        NotifyAjax['Pull']()
          .done(function(res) {
            if(res.status) {
              let messages = res.message;
              if (messages) {
                // 如果本地和服务器数量显示不一致同步为服务器的
                let html_count_container = $('.tooltipped').find('span'),
                    html_count = html_count_container.html().trim(),
                    server_count = messages.length;
                if(html_count !== server_count ) {
                  $(html_count_container).html(server_count);
                };
                $('.notify-card .card-content').find('.info-item').remove();
                let i = server_count;
                for (; i > 0; i--) {
                  let  message;
                  /* TODO: 减少这里重复的代码 */
                  if(!messages[i-1]['is_read']) {
                    message  ='<li class="info-item unread " data-message-id=' +  messages[i-1]['message_id']+'> <span>'+ messages[i-1]['message'] + '</span></li>';
                  } else {
                    message  ='<li class="info-item" data-message-id=' +  messages[i-1]['message_id']+'> <span>' + messages[i-1]['message'] + '</span></li>';
                  }
                  $('.notify-card .card-content').find('.content-container').append($(message));
                }
              } else {
                $('.tooltipped').find('span').css({'display': 'none'});
              }
              $('.notify-card').css({"display": "block"});
            } else {
              $.notify('网络故障，请稍后查看');
            }
          });
    },function() {
      $('.notify-card').css({"display": "none"});
      if ($('.notify-card .unread').length) {
        let data = {
          _xsrf: $('input[name=_xsrf]').val().trim()
        };
        NotifyAjax['Skim'](data);
      }
    });
  // 清除所有消息
  $('.notify-card .header-action').click(function(e) {
    if(!!$('.navbar-menu-infobox span').html()) {
      let data = {
        _xsrf: $('input[name=_xsrf]').val().trim()
      };
      NotifyAjax['Read'](data)
        .done(function(res) {
          if(res.status) {
            $('.notify-card .content-container').children().remove();
            let clearMessage = '<li class="info-item none" <span>消息清除完成</span></li>';
            $('.notify-card .content-container').html(clearMessage);
            $('.navbar-menu-infobox .content-container span').html('');
          } else {
            $.notify('清除消息失败');
          }
        });
    }
  });
  $('.notify-card .content-container').delegate('li', 'click', function(){
    let messageId = $(this).data('message-id');
    if(!!messageId) {
      window.location = '/message/s/reading/' + messageId;
    }
  });
});

/* -------------------------------------------------------------------------------- */
/* 自己设定的提示样式 ，暂时不剥离出去*/
$.fn.classAnim = function(name,remove, func) {
  var $this = this;
  $(this).addClass(name).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
    if(remove){
      $(this).removeClass(name);
    }
    if (func && typeof(func) === 'function') {
      func();
    }
  });
  return $(this);
};

  /* -------------------------------------------------------------------------------- */
