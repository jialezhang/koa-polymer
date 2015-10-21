$('.resume-patch-release').find('.confirm').click(() => {
  let data = {
    _xsrf: $('.resume-patch-release').find('input[name=_xsrf]').val().trim(),
    content: $('.resume-patch-release').find('textarea').val().trim()
  };
  ResumeAjax['Patch'](data)
    .done((res) => {
      if(res.status)  {
        $.notify(res.message.info,{
          callback:  () => {
            let fdItem = juicer(resumeFeedback, {
              fd_id: res.message.feedback_id,
              fd_content: data.content
            });
            $('.resume-patch-release .patch-lists').append(fdItem);
            /* $('.sidebar-content-lists textarea').autogrow(); */
            $('.sidebar-content .new-item textarea').css({"height": "28px"});
            $('.resume-patch-release').find('.new-item textarea').val('');
          }
        });
      } else {
        $.notify("简历申请描述：" + res.errors.content, {
          type: 'errors'
        });
      }
    });
});

