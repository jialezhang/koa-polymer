import Chart from 'Vendor/Chart/Chart.Core';
import Line from 'Vendor/Chart/Chart.Line';
import Doughnut from 'Vendor/Chart/Chart.Doughnut';
import Radar from 'Vendor/Chart/Chart.Radar';
import Polar from 'Vendor/Chart/Chart.PolarArea';
import { GithubColors } from 'Vendor/Chart/GithubColors';
import juicer from 'Vendor/juicer';

import { PIE_COLOR } from 'Setting/Chart.Color';

import AjaxHub from 'Helper/lib/AjaxHub.es';
import { toggleTarget, camelString } from 'Helper/lib/utils';

import { Resume } from '../setting/url';
// import { ability, fieldItem } from 'UI/component/template/dist/resume/index';
import * as  RESUME_TEMPLATE from '../template/index';

$(document).ready(function() {

  // console.log(RESUME_TEMPLATE);
  function disableTab(target, container) {
    let bullet = $(container).find('[target=' + target + ']');
    if(bullet) {
      bullet.parent().addClass('disabled');
    }
  }
  // 数据获取初始化
  let memberToken = $('.main-container .user-resume').data('member-token'),
      memberType = $('.main-container .user-resume').data('member-type');
  for ( let index in Resume) {
    let getUrl =  Resume[index]['url'];
    getUrl = getUrl.replace('%user_id', memberToken);
    // console.log(getUrl);
    Resume[index]['url'] = getUrl.replace('%user_type', memberType);
    // console.log(Resume[index]['url']);
  }
   
  let DataAjax  = AjaxHub.create(Resume);
  const PIE_COLORS = ['#4fc3f7', '#29b6f6','#03a9f4', '#039be5','#0288d1'];

  /* 饼状图 */
  if($('.score-item.general-score').length) {
    let userGeneralScore = {
      'generalScore': $('.score-item.general-score').data('score'),
      'fitScore': $('.score-item.fit-score').data('score')
    };
    // 分别对应60,70,80,90
    let SCORE_COLOR = ['#D85020', '#E2872A', '#F2C43A', '#4Cd61E','#12A277'];
    let target = {};
    target.value = parseInt(userGeneralScore.generalScore);
    // console.log(target.value);
    switch(true) {
    case(target.value >= 90):
      target.color = SCORE_COLOR[0];
      target.label = '史诗';
      break;
    case(target.value >= 80):
      target.color = SCORE_COLOR[1];
      target.label = '传说';
      break;
    case(target.value >= 70):
      target.color = SCORE_COLOR[2];
      target.label = '高级';
      break;
    case(target.value >= 60) :
      target.color = SCORE_COLOR[3];
      target.label = '中级';
      break;
    default:
      target.color = SCORE_COLOR[4];
      target.label = '初级';
    };
    // target.label = '';

    // console.log(target);
    let generalScore =
          [target,
           {
             value: 100 - userGeneralScore.generalScore,
             color: '#CBCBCB'
           }
          ];
    
    let DoughnutOptions = {
      percenptageInnerCutout : 60,
      segmentShowStroke : true,
      animateScale: true,
      labelTopFontSize: 10,
      labelTopFontColor: "rgba(0,0,0,0.54)",
      labelBottomFontSize: 12,
      labelBottomColor: "#12A277",
      // TopPosition
      labelTP: 12,
      labelBP: 12,
      hasCenterLabel: true,
      scaleShowLabels: false,
      showTooltips: false
    };
    // TODO: 将分数显示出来
    let genctx = $("#general-score").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    let myLineChart = new Chart(genctx).Doughnut(generalScore, DoughnutOptions);

  }
    // 测评详情的图
  let polarData = [],
      items = $('.resume-evaluate').find('.section-item-block');

  $.each(items, (index) => {
    let itemData = {
      value: $(items[index]).data('score'),
      label: $(items[index]).data('title'),
      color: PIE_COLORS[index]
    };
    polarData.push(itemData);
  });
  // console.log(polarData);

  if($("#evaluate-score").length) {
    let genctx = $("#evaluate-score").get(0).getContext("2d");
    new Chart(genctx).PolarArea(polarData, {
    });
  }
  /* 雷达图 */
  // let radarData = {
  //   labels: ["代码能力", "开源代码贡献", "博客及社区活跃", "教育经历", "工作经历"],
  //   datasets: [
  //     {
  //       label: "My Second dataset",
  //       fillColor: "rgba(151,187,205,0.2)",
  //       strokeColor: "rgba(151,187,205,1)",
  //       pointColor: "rgba(151,187,205,1)",
  //       pointStrokeColor: "#fff",
  //       pointHighlightFill: "#fff",
  //       pointHighlightStroke: "rgba(151,187,205,1)",
  //       data: [28, 48, 40, 19, 24]
  //     }
  //   ]
  // };
  // let radarctx = $("#radarChart").get(0).getContext("2d");
  // let radarChart = new Chart(radarctx).Radar(radarData);
  /* 条形图--活跃时间 */
  let TLDayData = {},TLWeekData = {}, dayLabel = [], weekLabel = [],
      dayData = [], weekData= [];
  DataAjax['TimeLine']()
    .done(function(res) {
      if(res.message) {
        let hourStatus = res.message.stat.hour,
            weekStatus = res.message.stat.week;
        for (let i in hourStatus) {
          dayLabel.push(hourStatus[i][0] + 1);
          dayData.push(hourStatus[i][1]);
        }
        for (let i in weekStatus) {
          weekLabel.push(weekStatus[i][0] + 1);
          weekData.push(weekStatus[i][1]);
        }
        // TLDayData.labels = dayLabel, TLWeekData.labels = weekLabel;
        // TLDayData.data = dayData, TLWeekData.data = weekData;
        TLDayData = {
          labels: dayLabel,
          datasets: [
            {
              label: 'Daily Active Time',
              fillColor:  "rgba(136, 211, 161, 0.99)",
              strokeColor: "rgba(136, 211, 161, 0.99)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: dayData
            }
          ]
        };
        TLWeekData = {
          labels: weekLabel,
          datasets: [
            {
              label: 'Weekly Active Time',
              fillColor: "rgba(136, 211, 161, 0.99)",
              strokeColor: "rgba(136, 211, 161, 0.99)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: weekData
            }
          ]
        };

        let lineDayctx = $(".time-day canvas").get(0).getContext("2d");
        let lineWeekctx = $(".time-week canvas").get(0).getContext("2d");
        let lineChartDay = new Chart(lineDayctx).Line(TLDayData, {
          showTooltips: false,
          pointDot : false
        });
        let lineChartWeek = new Chart(lineWeekctx).Line(TLWeekData, {
          showTooltips: false,
          pointDot : false
        });
      } else {
        $('.resume-section.resume-active-time').remove();
        disableTab('resume-active-time', '.head-menu');
      }
    });
  toggleTarget('.resume-active-time .trigger-container', '.resume-active-time .resume-section-content', function() {
    let target = $('.resume-active-time .trigger-container').find('.active').data('target'),
        targetContainer = $('resume-active-time .resume-section-content');
  });
  // $('.resume-active-time .mini-state-btn[data-target=time-week]').click(function() {
  //   let target = $(this).data('target');
  //   if($('.resume-active-time .resume-section-content .' + target).) {

  //   }
  // });
  /* 技术方向 */
  // 获取技术方向
  // container: 对应html中的ID标签一部分；如 container='repos' id='field-repos'
  function drawPie(target, data, colors, num=12) {
    let container = $('#field-' + target );
    if(container.length) {
      let pieCtx = container.get(0).getContext('2d'), pieData = [], pieTotal = 0 ,pieDis = 0;
      for (let i = 0; i < data.length; i ++ ) {
        let ratioValue = data[i][2],
            abilityValue = data[i][1],
            labelName = data[i][0];
            // colorIndex = Math.floor(Math.random() * 4);
        if(ratioValue){
          pieTotal += ratioValue;
        }
        if(i < num) {
          pieDis += ratioValue;
          let pieItem = {
            value: ratioValue,
            color: colors[i],
            label: labelName
          };
          pieData.push(pieItem);
        }
        let abilityItem = juicer(RESUME_TEMPLATE['FIELD_ITEM_ABILITY'], {
          label_name: labelName,
          style: "background:" + colors[i]
        });
        container.closest('.field-item').find('.corner-mark-list').append(abilityItem);
      }
      pieData.push({
        value: pieTotal - pieDis,
        color: "#0D47A1",
        label: '其他'
      });
      /* console.log(pieData); */
      let PieChart = new Chart(pieCtx).Pie(pieData);
    }
  };

  DataAjax['Direction']()
    .done(function(res){
      if(res.status) {
        let data = res.message,
            repos = data.repos,
            questions = data.questions,
            stars = data.stars,
            emptySta = 0;
        // console.log(data);
        let names = {
          repos: '最近项目',
          questions: '最近问题',
          stars: '最近关注'
        };
        for(let index in data) {
          if(data[index].length) {
            let field = juicer(RESUME_TEMPLATE['FIELD_ITEM'], {
              field_name: names[index],
              field_index: index
            });
            $('.skill-fields').append(field);
            /* console.log(PIE_COLOR[camelString(index)]); */
            drawPie(index, data[index], PIE_COLOR[camelString(index)]);
          } else {
            emptySta++;
            continue;
          }
        }
        if(emptySta === 3 ) {
          $('.resume-section.resume-skill-focus').remove();
          disableTab('resume-skill-focus', '.head-menu');
        }
      }
    });

  /* 项目语言技能组成 */
  $('.repository-lang-stats-graph').children('span.language-color').each(function(){
    let language = $(this).data('language'),
        ratio = $(this).attr('data-value'),
        bgColor;
    if (typeof ratio === typeof undefined || ratio === false) {
      ratio = "100%";
    }
    /* console.log(ratio) */
    for (let item in GithubColors ) {
      /* console.log(!!GithubColors[item]['color']); */
      if(language === item && !!GithubColors[item]['color']) {
        bgColor = GithubColors[item]['color'];
        break ;
      }
    }

    if(!bgColor) {
      bgColor =  "#315665";
    }
    /* console.log(bgColor); */
    $(this).css({
      'background': bgColor,
      'width': ratio
    });
  });
});
