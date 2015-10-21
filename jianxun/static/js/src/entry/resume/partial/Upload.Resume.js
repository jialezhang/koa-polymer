// 简历上传
// console.log($.fn.fileupload);
// $('#fileupload').fileupload({
//   url: '/account/settings/resume/upload',
//   dataType: 'json',
//   formData: {
//     _xsrf: xsrf,
//     name: 'resume'
//   },
//   progressall: function (e, data) {
//     var progress = parseInt(data.loaded / data.total * 100, 10);
//     $('#resume-upload-progress .bar').css({'width': progress + '%', 'backgroud': '#20C05C'})
//       .text('上传进度为：' + progress);
//   },
//   // e: 是一个事件捕捉
//   // data: 包含了ajax的res，data.result
//   done: function (e, data) {
//     // console.log(data.result);
//     if(data.result.status) {
//       $('#resume-upload-progress .bar').text('').append( $('<p/>').text(data.result.message.info));
//       setTimeout(function() {
//         $('.resume-status-content').find('a').attr('href', data.result.message.link.download_link);
//         $('.resume-status-container').toggleClass('active');
//         $('#resume-upload-progress .bar').text('').css({'width': 0});
//       }, 1000);
//     } else {
//       $('#resume-upload-progress .bar').css({'background': 'red'});
//       $('#resume-upload-progress .bar').text('').append( $('<p/>').text(data.result.errors.resume));
//     }
//   }
// });
// // 简历链接获取
// ResumeAjax['CV']()
//   .done(function(res) {
//     if(!!res.message) {
//       $('.resume-status-content a').attr('href', res.message.download_link);
//       $('.resume-status-container').addClass('active');
//     }
//   });
// /* 简历重新上传 */
// $('.sidebar .resume-update').click((e) => {
//   $('.resume-no-upload #fileupload').trigger('click');
//   $('.resume-status-container').removeClass('active');
// });
