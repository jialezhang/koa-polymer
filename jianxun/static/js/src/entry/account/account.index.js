import navbar from  'UI/component/navbar';
import modal from 'Vendor/jquery.modal';
import validate from  'Helper/plugin/jquery.validate';

import { getData } from 'Data/DataHub';
import { formErrorsDisplay, ErrorsDisplay,
         Reload, Redirect } from 'Data/ResponseHandler';
import { AjaxCreate } from 'Data/AjaxHub';

import { CUSTOMER_SETTINGS } from './setting';
import { AccountSettings } from './url';

$(document).ready(() => {

  //账户基本信息修改请求
  $('#username-form').validate();
  $('#telephone-form').validate();
  $('#account-password-form').validate();
  $('#account-salary-form').validate();

  // 账户基本信息修改弹框
  $('.item-action a').click( (e) => {
    const target = $('#' + $(e.target).data('target') );
    target.openModal();
  });

  $('.modal').find('input').on('keydown', (e) => {
    if(e.keyCode === 13 ) {
      e.preventDefault();
    }
  });

  let renderAccountData  = (data, target) => {
    let previewData = '';
    let previewTarget = target === 'name' ? 'username' : target;
    if(data[target]) {
      previewData = data[target]; 
    }
    if( target === 'expected_salary') {
      previewData = data['expected_start_salary'] + 'k-' +  data['expected_end_salary'] + 'k';
      previewTarget = 'expected-salary';
    } 
    if( target === 'password') {
      previewData = '********';
    }
    $('.card-content').find('.' + previewTarget).html(previewData);
    $('.modal').closeModal();
    
    for( let key in data ) {
      $(CUSTOMER_SETTINGS[target][key]).val(data[key]);
    }
  };

  $('.card-action .confirm').click( (e) => {
    const target = $(e.target).data('target');
    let rawData, data;
    rawData = getData(1, $('.modal'), CUSTOMER_SETTINGS[target]);
    // console.log(rawData);
    if(target === 'password') {
      if(rawData['old_password'] && rawData['old_password'] === rawData['new_password']) {
        $.notify('新旧密码相同，请重新输入', {
          type: 'errors'
        });
        return;
      }
      else if(rawData['password_confirm'] !== rawData['new_password']) {
        $.notify('两次密码不同，请重新输入', {
          type: 'errors'
        });
        return;
      }
    }

    data = {
      'settings': JSON.stringify(rawData),
      'type': target,
      '_xsrf': $('input[name=_xsrf]').val().trim()
    };
    let AccountAjax = AjaxCreate(AccountSettings),
        errorHandle = formErrorsDisplay(CUSTOMER_SETTINGS[target]);
    AccountAjax['Basic'](data)
      .done(errorHandle)
      .done((res) => {
        if(res.status) {
          renderAccountData(rawData, target);
        }
      });
  });
});
