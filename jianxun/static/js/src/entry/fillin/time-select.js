import { generateTimeOptions} from 'Utils/utils';

let timeSet = [
  ['year', '.panel-content', '.start-edu', 0, 12],
  ['year',  '.panel-content', '.end-edu', 1, 12],
  ['year',  '.panel-content', '.time-year', 1, 12],
  ['month',  '.panel-content', '.time-month']
];

$(document).ready(() => {
  // 生成器
  function timeSelect() {
    $.each(timeSet, function(index) {
      generateTimeOptions.apply(timeSet[index], this);
    });
    $('select').jx_select();
  };

  timeSelect();
});
