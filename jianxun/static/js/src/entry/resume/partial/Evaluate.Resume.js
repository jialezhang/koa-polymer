// 是否开启推荐
$(document).ready(function() {
  let switchAjaxStatus = false;

  $('.switch-container .switch .lever').click((e) => {
    let container = $(e.target).closest('.switch'), is_open_recommend;

    // console.log(switchAjaxStatus);
    if(!switchAjaxStatus) {
      if(container.hasClass('active')) {
        is_open_recommend = 0;
      } else {
        is_open_recommend = 1;
      }
      let data = {
        is_open_recommend: is_open_recommend
      };
      let settings = JSON.stringify(data);

      // $('.swtich-container').ajaxStart(() => {
      switchAjaxStatus = true;
      // });

      $.ajax({
        url:  '/account/settings/h/modify',
        method: 'POST',
        data: {
          _xsrf: $('input[name=_xsrf]').val().trim(),
          settings: settings
        },
        success: (res) => {
          if(res.status) {
            if(container.hasClass('active')) {
              container.removeClass('active');
              container.find('input').removeAttr('checked');
            } else {
              container.addClass('active');
              container.find('input').attr('checked', 'checked');
            }
              $.notify(res.message); 
          } else {
            $.notify(res.message.errors, {
              type: 'errors'
            });
          }
          switchAjaxStatus = false;
        }
      });
    } else {

      $.notify('请等待操作完成', {
        type: 'errors'
      });

      return ;
    }

  });

  // resume_review_status
  // 提交测评
  let evaluateAjaxStatus = false;
  $('.evaluate-action button').click((e) => {

    if(evaluateAjaxStatus) {
      return ;
    }
    $(e.target).html('提交中....');

    evaluateAjaxStatus = true;

    let settings = {
      resume_review_status: 1
    };
      $.ajax({
        url:  '/account/settings/h/modify',
        method: 'POST',
        data: {
          _xsrf: $('input[name=_xsrf]').val().trim(),
          settings: JSON.stringify(settings)
        },
        success: (res) => {
          if(res.status) {
            $.notify(res.message, {
              callback: () => {
                $('.resume-evaluate-status.initial').remove();
                $('.resume-evaluate-status.processing').removeClass('mute');
                evaluateAjaxStatus = false;
              }
            });
          } else {
            $.notify(res.message.errors, {
              type: 'errors'
            });
          }
        }
    });
  });
});
