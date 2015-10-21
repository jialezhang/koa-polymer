 let AjaxCreate  = (map) =>  {
  // let ajaxMap = AjaxSettings[name],
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

};

export { AjaxCreate };
// 将这里的ajax请求之后换成es6 promise  + generator
