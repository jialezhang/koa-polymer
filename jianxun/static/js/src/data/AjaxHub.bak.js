export default class AjaxHub {
  /**
   * a wrapper for ajax
   * @param { Object } map - two dimension config for ajax url map 
   * @returns { Object } entity of simple ajax object 
   */

  static create(map) {
    let ajaxMap = map,
        ajaxEnities = {};
    for(let atype in  ajaxMap) {
      ajaxEnities[atype] = {};
      let options = {
        url: ajaxMap[atype]['url'],
        method: !ajaxMap[atype]['method'] ? 'POST' : ajaxMap[atype]['method']
      };
      ajaxEnities[atype] = function (options) {
        if (arguments.length > 1 ) {
          options.data = arguments[1];
          // options.success = arguments[2]; 
        }
        return $.ajax(options);
      }.bind(this, options);
    }
    return ajaxEnities;
  }

  /**
   * start ajax submit
   * @param { String } container - the ajax action emmiter
   */
  static start(container) {
    if(this.preCheck(container)) {
      let val = $(container).is('input') ? 'val' : 'html';
      let loadingText = $(container).attr('data-loading') ? $(container).data('loading') : '提交中...';

      $(container)[val](loadingText).addClass('disabled').attr('disabled', 'disabled');
    } else {
      this.finished(container);
    }
  }

  /**
   * check for ajax valid
   * @param { String } container - the ajax action emmiter
   */
  static preCheck(container) {
    if(!$(container).hasClass('disabled')) {
      return true;
    }
  }

  /**
   * reset ajax status 
   * @param { String } container - the ajax action emmiter
   */
  static finished(container) {
    let val = $(container).is('input') ? 'val' : 'html';
    let resText= $(container).attr('data-restext') ? $(container).attr('data-restext') : '确定';
    console.log(resText);
    $(container)[val](resText).removeClass('disabled').removeAttr('disabled');
  }
};
// 将这里的ajax请求之后换成es6 promise  + generator
