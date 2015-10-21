// method: 是否是POST请求，如果则flag为真
/* trim : 是否保留为空元素 ,如果保留则为真*/
// targetMap: 元素和名称的映射表
/* container: 包裹container，如果全部限为id很不灵活 */

let getData = (method, container, targetMap, trim) =>  {
  let data = {};
  if( method ) {
    // 这样性能肯定会很低，不过暂时就这样吧哈哈
    data['_xsrf'] = $('input[name=_xsrf]').val().trim();
  }
  for(let key in targetMap){
    /* ele: 正在进行操作的元素 */
    let ele = $(container).find(targetMap[key]);
    // console.log(key);
    // console.log(ele.length);
    if(ele.length) {
      let  tagname = ele.prop('tagName').toUpperCase(),
           value;
      // 用于读取数组类填写
      let arrYeah = ele.siblings('.tagit').length;
      if(arrYeah) {
        let valueList = $(ele).siblings('ul').children().find('span.tagit-label'),
            valueLength = valueList.length, TValue = [];
        for(var i = valueLength -1 ; i >= 0; i-- ){
          TValue.push($(valueList[i]).html().trim());
        }
          value = TValue.toString();
          // console.log(value);
          // value = value.toString();
      } else if(ele.attr('data-empty') === 'true') {
        value = '';
          // 如果是checkbox类
      } else if( tagname === 'INPUT' && ele.attr('type') === 'checkbox') {
        if($(ele).is(':checked')) {
          value = 1;
        } else {
          value = 0;
        }
        // 如果是在行内元素之中直接读取html值
        /* } else if (['TEXTAREA'].indexOf(tagname) !== -1) {
           consle.log(ele);
           value = ele.text().trim(); */
      } else if (['SPAN', 'P', 'LABEL', 'DIV'].indexOf(tagname) !== -1) {
        value = ele.html().trim();
          // 如果是下拉列表 
      } else if( tagname === 'SELECT'){
        let container = ele.closest('.select-wrapper').find('.select-dropdown.dropdown-content li.selected span');
        if(container.length) {
          value = container.html().trim();
        } else {
          value = '';
        }
      } else {
          // console.log(ele)
        value = ele.val().trim();
          // console.log(value);
      }
        // console.log(value);
      data[key] = value;
    }
    /* if(value === '' && !trim ) {
       continue;
       } else {
       data[key] = value;
       } */
  }
  return data;
}

  // 编辑职位页面
  // container: 需要渲染界面的selector；
  // data: 需要渲染的数据;
  // infoSettings: 渲染数据对应selector的配置
  // fill用来判断是不是填充表格

let renderData = (fill, container, data, infoSettings, callback) => {
  for ( let key in data ){
      (function(index) {
        let target = $(container).find(infoSettings[index]);
        if(target.length) {
          let tagname = target.prop('tagName').toUpperCase();
          /* console.log(index);
             console.log(data[index]); */
          target.attr('data-empty', 'false');
          if(index !== '_xsrf' && target.length) {
            if(!fill) {
              if(index === 'time_till_now'){
                let nowContainer = $(container).find('[class*="time-till-now"]'),
                    endContainer = $(container).find('.end-time-container');
                if(data['time_till_now']) {
                  endContainer.addClass('mute');
                  nowContainer.removeClass('mute').html('至今');
                } else {
                  nowContainer.addClass('mute').html('');
                  endContainer.removeClass('mute');
              }
             } else {
               target.text(data[index]);
             }
            } else if (fill) {
              // 此处不能通用，仅针对该html格式
              // 下拉列表选项
              if(tagname === 'SELECT'){
                /* console.log('下拉列表'); */
                target.siblings('input.select-dropdown').val(data[index]);
                let liContainer = target.siblings('.select-dropdown.dropdown-content'),
                    value = data[index];
                liContainer.find('li').each((index) => {
                  liContainer.find('li').eq(index).removeClass('selected');
                  if(liContainer.find('li').eq(index).find('span').html().trim() === value) {
                    liContainer.find('li').eq(index).addClass('selected');
                  }
                });
              }
              else if(target.siblings('ul.tagit').length){
                // console.log('标签');
                // tag类填充
                /* 如果为空跳出 */
                if(!data[key]) {
                  return ;
                }
                  target.siblings('ul.tagit').children('.tagit-choice').remove();
                let liItem = '<li class="tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable"><span class="tagit-label"></span><a class="tagit-close"><span class="text-icon">×</span><span class="ui-icon ui-icon-close"></span></a></li>';
                let tags = data[key].split(',');
                for(let i=0 ; i < tags.length; i++) {
                  let newLi = $(liItem);
                  newLi.find('.tagit-label').text(tags[i]);
                  newLi.insertBefore(target.siblings('ul.tagit').find('.tagit-new'));
                };
              }
              // deal with time-till-now
              else if( index === 'time_till_now' && data['time_till_now']){
                let timeContainer  = target.closest('.time-container'),
                    nowContainer = timeContainer.find('.time-till-now label');
                if(nowContainer.hasClass('active')) {
                  return ;
                }
                target.closest('.time-container')
                  .find('.time-till-now input[type=checkbox]').trigger('click');

                nowContainer.addClass('active');

                timeContainer.find('.end-time-container').addClass('mute');

              } else if(['SPAN', 'P', 'LABEL', 'DIV'].indexOf(tagname) !== -1){
                // console.log('文本');
                target.text(data[index]);
              } else {
                // console.log('输入框');
                target.val(data[index]);
              }
            }
          }
        }
      })(key);
    }
    if(callback && (typeof callback) === 'function') {
      // console.log('test');
      callback();
    }
};
/* 用于清除表格数据 */
/* TODO: 将表格完全恢复到原始状态 */
let clearTable = (container, targetMap) => {
  for(let key in targetMap){
    /* ele: 正在进行操作的元素 */
    (function(index) {
      let ele = $(container).find(targetMap[key]);
      if(ele.length)  ele.val('');
    })(key);
  }
};

let checkErrors = (container) => {
    let errors = [];
    $(container).find('.help-block').each(function (index) {
      let error = $(this).html().trim();
      if(!!$(this).html().trim()) {
        errors.push(error);
      };
    });

  if(errors.length) {
    $.notify('请按提示正确填写信息', {
      type: 'errors'
    });
      return false;
    } else {
      return true;
    }
};

let checkFilled = (container) => {
  $(container).find('.validate').each(function(index) {
    if(!$(this).val()) {
      $.notify('请填写相应信息', {
        type: 'errors'
      });
      return false;
    } else {
        return true;
    }
  });
};

export { getData, renderData, clearTable, checkErrors, checkFilled,}
