  // $('select').jx_select();
  // console.log('jiale');
  /* 登录之后的活动选择 */
  // if($('.events-modal').length) {
  //   setTimeout(() => {
  //     $('.events-modal').openModal();
  //   },1000);
  // }

  // $('.event-cancel').click((e) => {
  //   $.ajax({
  //     url: '/event/1/h/refuse',
  //     method: 'POST',
  //     data: {
  //       _xsrf: $('input[name=_xsrf]').val().trim()
  //     },
  //     success: (res) => {
  //       if(res.status) {
  //         $('.events-modal').closeModal();
  //         } else {
  //           $.notify(res.errors);
  //         }
  //       }
  //   });
  // });

  // 参加活动
  // $('.events-modal-action').click((e) => {
  //   let data = {
  //     _xsrf: $('input[name=_xsrf]').val().trim()
  //   };
  //   $.ajax({
  //     url: '/event/1/h/participate',
  //     method: 'POST',
  //     data: data,
  //     success: (res) => {
  //       if(res.status) {
  //         let message = res.message.info ? res.message.info : res.message;
  //         $.notify(message);
  //         $('.events-modal').closeModal();
  //         } else {
  //           console.log(res.message.info);
  //         }
  //     }
  //   });
  // });
  // console.log('jiale');
 
