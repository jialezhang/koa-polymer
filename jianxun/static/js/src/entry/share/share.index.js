import navbar from  'UI/component/navbar';

import modal from 'Vendor/jquery.modal';
import ZeroClipboard from  'Vendor/ZeroClipboard';
import editor from  'Vendor/wysiwyg-editor';

import { getData, checkErrors, checkFilled } from 'Helper/lib/DataHub';
import { formErrorsDisplay, ErrorsDisplay,
         Reload, Redirect, getResMessage } from 'Helper/lib/ResponseHandler';
import AjaxHub from 'Helper/lib/AjaxHub.es';
import validate from  'Helper/plugin/jquery.validate';

import { TALENT } from './url';
import { SHARE_INFO } from './setting';

ZeroClipboard.config({
  forceEnhancedClipboard: true,
  swfPath: '//jianxun.b0.upaiyun.com/c/jx_static/js/ZeroClipboard.swf'
});

$(document).ready(() => {



  let  client = new ZeroClipboard( $("#J_copy_button") );

  console.log(client);
  client.on( "ready", function( readyEvent ) {
    // alert( "ZeroClipboard SWF is ready!" );
    // console.log('copy ready'); 

    client.on( 'copy', function(event) {
      event.clipboardData.setData('text/plain', $('.code-content').val().trim());
    } );

    client.on( "aftercopy", function( event ) {
      // `this` === `client`
      // `event.target` === the element that was clicked
      alert('复制成功');
    } );
  } );

  // let captcha1 = new window.Geetest().appendTo('#geetest-verification-code');

  $('.email-input-top').validate();

  // $('.email-editor-content').each(
  //   function(index, element) {
  //     $(element).wysiwyg({
  //       classes: 'some-more-classes',
  //       // 'selection'|'top'|'top-selection'|'bottom'|'bottom-selection'
  //       toolbar: index == 0 ? 'top-selection' : (index == 1 ? 'bottom-focus' : 'selection'),
  //       // Submit-Button
  //       submit: {
  //         title: 'Submit',
  //         image: '\uf00c' // <img src="path/to/image.png" width="16" height="16" alt="" />
  //       },
  //       // Other properties
  //       maxImageSize: [600,200]
  //     });
  //   }
  // );

  // 填写名字
  $('.email-target-name').on('keyup', (e) => {
    let name = $(e.target).val().trim();
    $('#invitee-name').html(name);
  });

  $('.email-confirm button').click((e) => {
    let shareAjax = AjaxHub.create(TALENT);
    let data = getData(1, '.card-content', SHARE_INFO, 1);
    let shareDisplay = formErrorsDisplay(SHARE_INFO, '.card-content')
    // data['content'] = $('#email-content').html();

    // console.log(data)
    if(checkFilled('.card-content')) {
      return ;
    }
    if(!checkErrors('.card-content')) {
      // console.log('jiale')
      return ;
    }
    shareAjax['SHARE'](data)
      .done(shareDisplay)
      .done((res) => {
        if(res.status) {
          let message = getResMessage(res.message);
          $.notify(message, {
            callback: () => {
              // console.log(res)
              window.location = '/resume';
            }
          });
        }
        // } else {
        //     let errors = getResMessage(res.errors)
        //     $.notify(errors, {
        //         type: 'errors'
        //     });
        // }
      });
  });
  // var client = new ZeroClipboard( document.getElementById("copy-button") );

  // client.on( "ready", function( readyEvent ) {
  //   // alert( "ZeroClipboard SWF is ready!" );

  //   client.on( "aftercopy", function( event ) {
  //     // `this` === `client`
  //     // `event.target` === the element that was clicked
  //     event.target.style.display = "none";
  //     alert("Copied text to clipboard: " + event.data["text/plain"] );
  //   } );
  // } );
});
