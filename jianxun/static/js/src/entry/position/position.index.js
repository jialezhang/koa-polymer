import navbar from  'UI/component/navbar';

import modal from 'Vendor/jquery.modal';
import tagIt from 'Vendor/jquery.tag-it';
import juicer from 'Vendor/juicer';
// import wysiwyg from 'Vendors/wysiwyg';

import { nowTime } from 'Helper/lib/utils';
import * as Data from 'Helper/lib/DataHub';
import autogrow  from 'Helper/plugin/textarea';
import AjaxHub from 'Helper/lib/AjaxHub.es';
import { formErrorsDisplay, ErrorsDisplay,
         Reload, Redirect, CloseModal } from 'Helper/lib/ResponseHandler';

import { InfoPerfect } from './setting';
import { Position } from './url';
import { CHAT_ITEM } from './chat-item';

$(document).ready(function() {

  $('textarea').autogrow();


  // $('.input-container textarea').wysiwyg('container');

  $('#skill').tagit();

  let PositionAjax = AjaxHub.create(Position);

    // 微信二维码的显示
    if($('.weixin-modal').length && !window.localStorage['weixin']) {
        $('.weixin-modal').openModal();

        $('.weixin-modal').find('.modal-close').click((e) => {
            window.localStorage.setItem('weixin', '1');
        });
    };
  $('#chat-item-input').find('.emit').click( function(e){
    let emitter_name = $(e.target).data('name'),
        chatInput = $(this).closest('.chat-input'),
        emitter_avatar = chatInput.find('.user-avatar img').attr('src');

    let data = {
      token: $('.section-content-main').data('inv-token').trim(),
      type: $('.section-content-main').data('inv-type').trim(),
      message: $('#chat-item-input').find('.input-container textarea').val().trim(),
      _xsrf: $('#chat-item-input').find('input[name=_xsrf]').val().trim()
    };

    PositionAjax['ChatBox'](data).done((res) => {
      if(res.status) {
        let messageData = {
          emitter_name: emitter_name,
          emitter_avatar: emitter_avatar,
          chat_content: data.message,
          emit_time: nowTime()

        };
        let chat = juicer(CHAT_ITEM, messageData);
        $(chat).insertBefore(chatInput);
        $('textarea').autogrow();
        $('#chat-item-input').find('.input-container textarea').val('');
      }
    });
  });

  /* 接受和拒绝的操作 */
  $('#invitation-action-emitter').children('.mini-state-btn').click(function(e) {
    let tokenContainer = $('.invtation-details-container');
    let data = {
      raw_type : tokenContainer.data('inv-type'),
      type: $(this).data('type'),
      _xsrf: $(this).siblings('input[name=_xsrf]').val().trim(),
      token: tokenContainer.data('inv-token')
    };
    PositionAjax['Action'](data)
      .done(function(res) {
        /* console.log(res); */
        if(res.status) {
          $.notify(res.message.info, {
            callback: () => {
              window.location = res.message.url;
            }
          });
          /* 特定错误弹框 */
        } else {
          if(res.errors.incomplete) {
            let data = res.errors.incomplete.info;
            Data.renderData(1, '#status-modal', res.errors.incomplete.info , InfoPerfect,
                            function() {
                              $.notify(res.errors.incomplete.err, {
                                type: 'errors'
                              });

                              $('#status-modal').openModal();
                            });
          } else {
            let errors = '';
            for(var key in res.errors) {
              errors += res.errors[key];
            }
            $.notify(errors, {
              type: 'errors'
            });
          }
        }
      });
  });

  /* 信息完善 */
  $('#status-modal .content-action').find('.confirm').click( (e) => {
    let rawData = Data.getData(1, $('#status-modal'), InfoPerfect),
        errorHandle = formErrorsDisplay(InfoPerfect), data = {};
      console.log(rawData);
    data['settings']= JSON.stringify(rawData);
    data['_xsrf'] = rawData['_xsrf'];
    PositionAjax['InfoPerfect'](data)
       .done(errorHandle)
       .done(function(res) {
         if(res.status){
           $.notify('修改成功', {
             callback: () => {
               $('#lean-overlay').trigger('click');
             }
           });
         }
       });
  });
});
