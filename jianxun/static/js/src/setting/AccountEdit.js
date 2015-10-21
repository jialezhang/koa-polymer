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
let InfoPerfect = {
    'name' : '#user-name',
    'telephone' : '#telephone',
    'expected_start_salary' : '#start-salary',
    'expected_end_salary' : '#end-salary',
    'skills': '#skill'
};
let FillInInfo = {
    Auth: {
        'zhihu_login': '#zhihu-account',
        'blog_url': '#blog-addr'
    },
    Step2: {
        'name': '#username',
        'telephone': '#telephone',
        'highest_edu': '.degree',
        'province': '#province',
        'city': '#city',
        'work_exp': '.exp',
        'skills': '#skill',
        'languages': '#languages'
    },
    Education: {
        'school_name': '.school-name',
        'start_year': '.start-edu',
        'end_year': '.end-edu',
        'time_till_now': '.time-till-now-education',
        'degree': '.degree',
        'major': '.major-in'
    },
    Award: {
        'name': '.award-name',
        'time_year': '.award-time-year',
        'time_month': '.award-time-month',
        'description': '.award-description'
    },
    Workexp: {
        'company_name': '.workexp-name',
        'position_name': '.position-name',
        'start_time_year': '.time-year.start-time',
        'end_time_year': '.time-year.end-time',
        'start_time_month': '.time-month.start-time',
        'time_till_now': '.time-till-now-workexp',
        'end_time_month': '.time-month.end-time',
        'position_desc': '.position-description'
    },
    // granted_at: 2014-5
    Project: {
        'name': '.project-name',
        'start_time_year': '.time-year.start-time',
        'end_time_year': '.time-year.end-time',
        'start_time_month': '.time-month.start-time',
        'end_time_month': '.time-month.end-time',
        'time_till_now': '.time-till-now-project',
        'description': '.project-description'
    },
    Introduction: {
        'introduction': '#introduction'
    },
    Expected: {
        'expected_position': '#expected-position',
        'expected_start_salary': '#expected-start-salary',
        'expected_end_salary': '#expected-end-salary',
        'expected_work_cities': '#expected-city',
        'expected_company_phase_item': '.company-phase label.active',
        'expected_company_phase': '#expected_company_phase'
    }
};
export { password,expected_salary, name, telephone,
         registerInfo, loginInfo, InvitationCode,
         InfoPerfect, forgotpwdInfo, resetpwdInfo,FillInInfo, rejection }
