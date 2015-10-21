// 登录注册
export const Member =  {
  'Login': {
    'url': '/account/login'
  },
  'Register': {
    url : '/account/register'
  },
  'Apply': {
    'url': '/account/invitationcode/apply'
  },
  'Confirm': {
    'url': '/account/invitationcode/confirm'
  },
  'Company': {
    'url': '/account/bussiness/register'
  },
  'Forgotpwd': {
    'url': '/account/forgotpwd'
  },
  'Resetpwd': {
    'url': '/account/resetpwd'
  },
  // 失效确认邮件重新发送
  'Resurgence': {
    'url': '/account/register/verify/resurgence'
  },
  'MemberConfirm' : {
    'url': '/account/register/invitation'
  },
  'Refuse': {
    url: '/account/register/invitation/feedback'
  }
};

export const  Position = {
  'Create': {
    'url': '/position/management/h/create'
  },
  'Action': {
    'url': '/position/invitation/h/status'
  },
  'InfoPerfect': {
    'url': '/account/settings/h/modify'
  },
  'ChatBox': {
    'url': '/position/invitation/chatbox'
  }
};

//人才推荐
export const Talent = {
  'Recommed': {
    'url': '/talent/management/member/recommend'
  },
  'SHARE': {
    'url': '/member/invitation/h/sendEmail'
  }
};

// 消息提示栏
export const Notify = {
  'Pull': {
    'url': '/message/s/untreated',
    'method': 'GET'
  },
  'Skim': {
    'url': '/message/h/skim'
  },
  'Read': {
    'url': '/message/h/read'
  }
};

// 个人页面整块的信息修改
// url的顺序分别为Craete， Modify, 'Delete'
export const FILLIN_ITEM_INFO = {
  Auth: {
    url: '/account/fillin/step1'
  },
  Settings: {
    'Basic': {
      url: '/account/settings/h/modify'
    },
    'Step2': {
      url: '/account/fillin/step2'
    },
    'Expected': {
      url: '/account/fillin/step5'
    },
    'Introduction': {
      url: '/account/settings/h/modify'
    },
    'City': {
      url : '/vendor/location/cities',
      method: "GET"
    }
  },
  Education: {
    Create: {
      'url': '/account/settings/education/h/create'
    },
    Modify: {
      'url': '/account/settings/education/h/modify'
    },
    Delete: {
      'url': '/account/settings/education/h/delete'
    }
  },
  Workexp: {
    Create: {
      'url': '/account/settings/workexp/h/create'
    },
    Modify: {
      'url': '/account/settings/workexp/h/modify'
    },
    Delete: {
      'url': '/account/settings/workexp/h/delete'
    }
  },
  Award: {
    Create: {
      'url': '/account/settings/award/h/create'
    },
    Modify: {
      'url': '/account/settings/award/h/modify'
    },
    Delete: {
      'url': '/account/settings/award/h/delete'
    }
  },
  Project: {
    Create: {
      'url': '/account/settings/project/h/create'
    },
    Modify: {
      'url': '/account/settings/project/h/modify'
    },
    Delete: {
      'url': '/account/settings/project/h/delete'
    }
  }
};

