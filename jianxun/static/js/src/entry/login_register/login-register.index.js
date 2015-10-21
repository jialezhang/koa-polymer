import navbar from  'UI/component/navbar';

import form from 'Vendor/jquery.form';
import modal from 'Vendor/jquery.modal';

import AjaxHub from 'Helper/lib/AjaxHub.es';
import { getData, checkErrors } from 'Helper/lib/DataHub';
import { formErrorsDisplay, Redirect } from 'Helper/lib/ResponseHandler';
import Url from 'Helper/lib/url';
import autogrow from 'Helper/plugin/textarea';
import validate from  'Helper/plugin/jquery.validate';

import * as AccountEdit  from './setting';
import { MEMBER } from './url';

$(document).ready(() => {
    // 登录模块选择
    $('#login-form  .login-type, #forgotpwd-form .login-type').children().on('click', (e) => {
        $(e.target).closest('.login-type').children().removeClass('active');
        $(e.target).closest('.login-type-item').addClass('active');
    });

    // iOS 输入框 fixed bug
    $('input').on('touchstart', (e) => {
        $('header').css({'position': 'static'});
        $(e.target).focus();
        e.preventDefault();
    });
    $('input').on('blur', (e) => {
        $('header').css({'position': 'fixed'});
        e.preventDefault();
    });
    // 启用验证模式
    // 申请验证
    $('#invitationcode-apply-form').validate();
    // 登录验证
    $('#login-form').validate();
    // 邀请接入确认
    $('#member-confirm-form').validate();
    // B端接入认领
    $('#bussiness-register-form').validate();
    //c端主动接入
    $('#customer-initiative-register-form').validate();
    // forget password
    $('#forgotpwd-form, #resetpwd-form').validate();

    $('select').jx_select();

    $('textarea.jx').autogrow();

    $('#cancel').on('click', (e) => {
        return window.localtion = '/';
    });

    let MemberAjax = AjaxHub.create(MEMBER);
    // 用户注册模块
    $('#user-register').click((e) => {
        let data = getData(1, AccountEdit['registerInfo']);
        let errorHandle = formErrorsDisplay(AccountEdit['registerInfo']);
        MemberAjax['Register'](data)
            .done(errorHandle)
            .done(Redirect('/account/login'));
    });

    // C端注册
    let cRegister = () => {
        let data = getData(1, $('#customer-initiative-register-form'), AccountEdit['registerInfo']);
        if(!data['password_confirm']) {
            $(AccountEdit['registerInfo']['password_confirm']).siblings('.help-block').html('请输入确认密码');

            return ;
        }
        if(checkErrors('#customer-initiative-register-form')) {
            let errorHandle = formErrorsDisplay(AccountEdit['registerInfo']);
            MemberAjax['Register'](data)
                .done(errorHandle)
                .done((res) => {
                    if(res.status) {
                        /* $('.modal').openModal(); */
                        /* TODO 返回链接*/
                        window.location = '/account/register/s/success';
                    } else {
                        $.notify('操作失败,请重新操作', {
                            type: 'errors'
                        });
                    }
                });
        } else {
            $.notify('请按提示填写正确信息', {
                type: 'errors'
            });
        }
    };

    let  login = () =>  {
        const type = $('.login-type').children('.active').attr('data-userType');
        let  data = getData(1, $('.login-register-container'), AccountEdit['loginInfo']), checked = 0;
        let errorHandle = formErrorsDisplay(AccountEdit['loginInfo']);
        let target = Url.parse(),
            url = target['next'] ;
        // console.log(url);
        // if(!url) {
        //   if(type === 'b') {
        //     url = $CONFIG['b_domain'];
        //   }else if (type === 'c') {
        //     url = $CONFIG['c_domain'];
        //   } else {
        //     $.notify('非法操作', {
        //       type: 'errors'
        //     });
        //   }
        // }

        ($('#remember_me').is(':checked')) ? checked = 1 : checked = 0  ;

        data['remember_me'] = checked;
        data['type']  = type;
        // console.log(data) 
        MemberAjax['Login'](data)
          .done(errorHandle)
          .done((res) => {
            if(res.status) {
              if(url) {
                window.location = url;
              } else {
                window.location = res.message.url;
              }
            }
          });
    };

    $('#customer-initiative-register-form .card-action .confirm').click((e) => {
        cRegister();
    });
    // B && C端注册
    $('#customer-initiative-register-form  #confirm-password').on('keyup', (e) => {
        if(e.keyCode === 13) {
            $('#customer-initiative-register-form .card-action .confirm').trigger('click');
        }
    });
    // 用户登录
    // 登录切换时，消除错误显示
    $('.login-type').find('.login-type-item').click((e) => {
        $('#login-form').find('.help-block').html('');
    });

    // 登录回车处理
    $('#login-form #password').on('keyup', (e) => {
        if(e.keyCode === 13) {
            $('#login-form #user-login').trigger('click');
        }
    });

    $('#login-form #user-login').click((e) => {
        login();
    });


    // 忘记密码
    $('#forgotpwd').click((e) => {
        let type = $('.login-type').children('.active').attr('data-userType'),
            data = getData(1, $('#forgotpwd-form'), AccountEdit['forgotpwdInfo']),
            errorHandle = formErrorsDisplay(AccountEdit['forgotpwdInfo']);

        data['type']  = type;

        MemberAjax['Forgotpwd'](data)
            .done(errorHandle)
        // .done(Redirect('/'));
            .done((res) => {
                if(res.status) {
                    // console.log(res);
                    $.notify(res.message, {
                        callback: () => {
                            window.location = '/account/login';
                        }
                    });
                }
            });
    });

    //重置密码
    $('#resetpwd').click((e) => {
        let data = getData(1, $('#resetpwd-form'), AccountEdit['resetpwdInfo']),
            errorHandle = formErrorsDisplay(AccountEdit['resetpwdInfo']);
        console.log( AccountEdit['resetpwdInfo']);
        if(checkErrors('#resetpwd-form')) {
            MemberAjax['Resetpwd'](data)
                .done(errorHandle)
                .done((res) => {
                    if(res.status) {
                        // console.log(res);
                        $.notify(res.message, {
                            callback: () => {
                                window.location = '/account/login';
                            }
                        });
                    }
                });
        } else {
            $.notify('请按提示填写正确的信息', {
                type: 'errors'
            });
        }

    });
    // 邀请码申请
    $('.card-action .apply').click( (e) => {
        if(checkErrors('#invitationcode-apply-form')) {
            let data = getData(1, $('.card'), AccountEdit['InvitationCode']['Apply']),
                errorHandle = formErrorsDisplay(AccountEdit['InvitationCode']['Apply']);
            MemberAjax['Apply'](data)
                .done(errorHandle)
                .done((res) => {
                    if(res.status) {
                        /* $('.modal').openModal(); */
                        /* setTimeout(function() { */
                        window.location = '/account/bussiness/register/s/success';
                        /* }, 3000); */
                    }
                })
                .done(Redirect());
        }
    });

    function invitationCodeConfirm() {
        let data = getData(1, $('.invite-code'), AccountEdit['InvitationCode']['Confirm']),
            errorHandle = formErrorsDisplay(AccountEdit['InvitationCode']['Confirm']);
        MemberAjax['Confirm'](data)
            .done(errorHandle)
            .done(function(res) {
                if(res.status) {
                    const url = '/account/bussiness/register?v=' + res.message.params.v;
                    $.notify(res.message.info, {
                        callback: (e)=> {
                            window.location = url;
                        }
                    });
                }
            });
    }
    // 邀请码确认
    $('.ask-for #invitation-confirm').click( (e) => {
        invitationCodeConfirm();
    });
    $('#invitation-code').on('keyup', function(e) {
        if(e.keyCode === 13 ) {
            invitationCodeConfirm();
        }
    });

    // 公司认领
    let companyRegisterData = {},
        bRegister = () => {
            companyRegisterData = {
                v: $('.company-claim').find('input[name="v"]').val().trim(),
                password : $('#bussiness-register-form #new-password').val().trim()
            };
            if( companyRegisterData.v &&  companyRegisterData.password && checkErrors('#bussiness-register-form')) {
                $('#company-modal').openModal();
            } else {
                $.notify('请根据提示填写正确的信息', {
                    type: 'errors'
                });
            };
        };

    $('#bussiness-register-form').validate();

    $('.card-action.company-claim').find('.confirm').click(function(e) {
        bRegister();
    });
    // 回车处理
    $('#bussiness-register-form').find('#confirm-password').on('keyup', (e) =>{
        if(e.keyCode === 13)  {
            bRegister();
        }
    });

    $('.claim-action .btn').click(function(e) {
        companyRegisterData['company_token'] = $(this).closest('.company-item').data('company-token');
        companyRegisterData['_xsrf'] = $('#bussiness-register-form input[name=_xsrf]').val().trim();
        MemberAjax['Company']( companyRegisterData)
            .done(function(res){
                if(res.status) {
                    let message = res.message.info;
                    // console.log(message);
                    $.notify(message, {
                        callback: () => {
                            window.location = res.message.url;
                        }
                    });
                } else {
                    $.notify('填写错误', {
                        type: 'errors',
                        callback: (e) => {
                            $('#company-modal').closeModal();
                        }
                    });
                }
            });
    });

    $('.no-fit-company').find('.confirm').click((e) => {
        // console.log('jiale');
        companyRegisterData['company_token'] = '';
        companyRegisterData['_xsrf'] = $('#bussiness-register-form input[name=_xsrf]').val().trim();
        MemberAjax['Company']( companyRegisterData)
            .done((res) => {
                if(res.status) {
                    $.notify(res.message.info, {
                        callback: (e) => {
                            window.location = res.message.url;
                        }
                    });
                } else {
                    $.notify('填写错误',{
                        type: 'errors',
                        callback:  (e) => {
                            $('#company-modal').closeModal();
                        }
                    });
                }
            });
    });
    // 列表中修改class的active
    $('.toggleActive').children().click( function(e){
        $(this).siblings().removeClass('active');
        $(this).toggleClass('active');
    });
    // 信息录入
    $('.refuse-status').find('.confirm').click(function(e) {

        let data = getData(1, $('.main-container'), AccountEdit['rejection']),
            rejectionList =
            $('.rejection-list').find('.rejection-item.active span').html().trim();
        data['content'] =
            data['content'] ?  (data['content'] + '\n' + rejectionList) : rejectionList;
        MemberAjax['Refuse'](data)
            .done(function(res) {
                if(!!res.status) {
                    $.notify(res.message, {
                        callback: () => {
                            $('.refuse-card').remove();
                            $('.register').css({"display": "block"});
                        }
                    });
                }
            });
    });
    // 被动接入确认
    $('#member-confirm-form').find('.confirm').click(function(e) {
        let data = {
            'password': $('#password').val().trim(),
            '_xsrf': $('.main-container').find('input[name=_xsrf]').val().trim(),
            'v': $('.main-container').find('input[name=v]').val().trim(),
            'type': $('.main-container').find('input[name=type]').val().trim()
        };
        MemberAjax['MemberConfirm'](data)

            .done(Redirect('/position/invitation/s/untreated'));
    });

    // 已经失效确认邮件重新发送
    $('#resurgence-form').find('.confirm').click((e) => {
        let data = {
            '_xsrf': $('.main-container').find('input[name=_xsrf]').val().trim(),
            v: $(e.target).siblings('input[name=v]').val().trim()
        };
        // console.log(data);
        MemberAjax['Resurgence'](data)
            .done(Redirect('/account/login'));
    });

});
