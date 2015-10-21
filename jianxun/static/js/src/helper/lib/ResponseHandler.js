// 用于在有form中有'help-block'
// @eleMap: 查找元素的名称|selector的配置
// res: server端返回的数据
export function formErrorsDisplay(eleMap, container) {
  // 还是要引入ajax之后的response
  return function(res) {
    if(!res.status) {
      if(res.errors.sys) {
        $.notify(res.errors.sys, {type: 'errors'});
      } else {
        if(typeof res.errors === 'string') {
          $.notify(res.errors, {type: 'errors'});
        } else {
          for(let key in res.errors){
            let flag = eleMap[key];
            // 如果返回的错误中对应在填充项里面侧在对应的input下面显示错误
            if(!!flag){
              let tagname = $(eleMap[key]).prop('tagName').toUpperCase();
              // console.log($(eleMap[key]).siblings('.help-block'));
              if(tagname === 'SELECT') {
                $(eleMap[key]).parent().siblings('.help-block').html(res.errors[key]);
              }
              if(container && $(container).find(eleMap[key]).siblings('.help-block').length) {
                $(container).find(eleMap[key]).siblings('.help-block').html(res.errors[key]);
              } else if($(eleMap[key]).siblings('.help-block').length) {
                $(eleMap[key]).siblings('.help-block').html(res.errors[key]);
              } else {
                $.notify(res.errors[key], {
                  type: "errors"
                });
              }
            } else {
              // 否则顶栏显示
              $.notify(res.errors[key], {
                type: "errors"
              });
            }
          }
        }
      }
    };
  };
}

export function ErrorsDisplay() {
  return function(res) {
    if(!res.status) {
      $.notify(res.errors.sys);
    }
  };
}

export function Reload() {
  return function(res){
    if(res.status) {
      let message = res.message.info ? res.message.info : res.message;
      $.notify(message);
      setTimeout(()=>{
        window.location.reload();
      }, 1000);
    }
  };
}

export function Redirect(url) {
  return function(res){
    if(res.status) {
      let message = res.message.info ? res.message.info : res.message;
      $.notify(message);
      setTimeout(() => {
        if(res.message.url) {
          window.location = res.message.url;
        } else {
          window.location = url;
        }
      }, 1000);

    }
  };
}
export function CloseModal(ModalName) {
  return function(res){
    if(res.status) {
      $.notify(res.message, ()=>{
        $(ModalName).closeModal();
      });
    }
  };
}


export function getResMessage(obj) {
    if (typeof obj === 'string') {
        return obj;
    } else {
        if(typeof obj === 'object') {
            
            let message = [];
            for (let key in obj) {
                if(typeof obj[key] === 'string') {
                    message.push(obj[key]);
                }
            }
            return message.toString();
        }
    }
}

