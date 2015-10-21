// 账户登录注册
let registerInfo  = {
    'email' : '#sign-email',
    'password' : '#new-password',
    'memberinv_record_token' : 'input[name="memberinv_record_token"]',
    'from' : 'input[name="from"]',
    'password_confirm' : '#confirm-password'
},
    loginInfo  = {
        'email' : '#email',
        'password' : '#password',
        '_xsrf': '#login-form input[name="_xsrf"]'
    },
    forgotpwdInfo = {
        'email' : '#email'
    },
    resetpwdInfo = {
        'password' : '#new-password',
        'v': 'input[name="v"]'
    };
let rejection = {
    content: '#rejection-content',
    v: 'input[name=v]',
    type: 'input[name=type]'
};

let InvitationCode = {
    'Apply' : {
        'user_name': '#company-linkman',
        'position': '.occupytion input',
        'telephone': '#phone-number',
        'email': '#company-email',
        'company_name': '#company-name',
        'company_website': '#company-website',
        'description': '#description'
    },
    'Confirm': {
        'invitationcode': '#invitation-code'
    }
};

export {  registerInfo, loginInfo, InvitationCode }
