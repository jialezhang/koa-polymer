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
