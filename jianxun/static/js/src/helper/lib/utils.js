// import { SCORE_COLOR } from 'Setting/Chart.Color';
import { SCORE_COLOR } from '../../setting/Chart.Color';

// 将unixTime转换成一般格式
// 可以使用moment.js，但是太大了
export function formatTime(unixTime) {
  let rawTime = unixTime,
      timeMonth = new Date(rawTime*1000).getMonth() + 1,
      timeDay = new Date(rawTime*1000).getDate(),
      time =  timeMonth + '月' + timeDay + '日';
  return time;
};

export function nowTime() {
  let rawTime = new Date(),
      timeYear = rawTime.getFullYear(),
      timeMonth = rawTime.getMonth() + 1,
      timeDay = rawTime.getDate(),
      time =  timeYear + '.' + timeMonth + '.' + timeDay;
  return time;
};

// camel string
export function camelString(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
// 将 UNIXTime转换成正常时间
export function  convertTime(timestamp) {
  if((typeof timestamp).toUpperCase() === 'NUMBER') {
    // let date = new Date(timestamp * 1000);
    let date = new Date(timestamp);
    // console.log(date);
    return date.getFullYear() + '.' + date.getMonth() + '.' + date.getDay();
  }else {
    return timestamp;
  }
};
// 有待加强
// 删除JD中的职位描述
export function  formatJD(string){
  return string.replace('职位描述', '');
};

export function drawScore(target) {
  let bgColor, width ,score = $(target).data('value');
  switch(true) {
    case(score >= 90): {
      bgColor = SCORE_COLOR[0];
      break;
    }
    case (score >= 60 && score <= 90):{
      bgColor = SCORE_COLOR[1];
      break;
    }
    default: {
      bgColor = SCORE_COLOR[2];
      break;
    }
  }
  $(target).attr('title',score);
  score += '%';
  $(target).css({
    'width': score,
    'background': bgColor
  });
}

export function Bind() {
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
                               ? this
                               : oThis || window,
                                 aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }
}
/* @container：将要append到的元素；
   @item: 信息将要插入的元素
   @data: 数据源 */
export function renderPullMessage(container, item, data) {
  let loopLength = data.length;
  for(let i = loopLength; i > 0 ; i-- ) {
    let completeItem = $(item).html(data[i-1].content);

    $(container).append(completeItem);
  }
}

/* 生成时间列表 */
// type: 区别年还是月
export function generateTimeOptions(type, container, target, now, size) {
  let host = container ? $(container).find('select'+target) : $(target);
  if(type === 'year') {
    let nowYear = (new Date()).getFullYear();
    for(let i = nowYear ; i > nowYear -size -1; i--) {
      host.append($('<option>').text(i));
    }
  } else if (type === 'month') {
    for(let i = 1 ; i < 13; i++) {
      host.append($('<option>').text(i));
    }
  }
  // console.log(host);
  // host.materiall_select();
}
/* 使用说明，必须将target的fixed样式设置为 */
/* &.fixed {
   position: fixed;
   top: 0;
   z-index: 10;
   @extend .z-depth-1;
   } */

export function scrollFixed(target) {
  let headTop = $(target).offset().top,
      style = {'position': 'fixed', 'z-index': '10', 'top': '0'};
  $(window).scroll(function() {
    if($(window).scrollTop() >  headTop){
      if($(target).hasClass('fixed')) {
        return;
      } else if(!$(target).hasClass('fixed')){
        $(target).addClass('fixed');
      }
    } else {
      $(target).removeClass('fixed');
    }
  });
}

export function toggleTarget(triggers, targets, handle) {
  $(triggers).children().on('click', function(e) {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    let target = $(this).data('target'),
        targetContainer = $(targets).find('.' + target);
    $(targetContainer).siblings().removeClass('active');
    $(targetContainer).addClass('active');

    if(!!handle && typeof handle === 'function')  handle();
  });
}

export function loading(container, content) {
  $(container).html(content);
}
