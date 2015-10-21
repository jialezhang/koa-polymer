import navbar from  'UI/component/navbar';
import { FillInTemplate } from 'UI/component/template/dist/fillin/index';
import pjax from  'Vendor/jquery.pjax';
import form from 'Vendor/jquery.form';
import modal from  'Vendor/jquery.modal';
import tagIt from 'Vendor/jquery.tag-it';
import juicer from 'Vendor/juicer';

import { FILLIN_INFO } from './setting';
import { FILLIN_ITEM_INFO } from './url';

import autogrow from 'Helper/plugin/textarea';
import { getData, renderData, clearTable } from 'Helper/lib/DataHub';
import validate from  'Helper/plugin/jquery.validate';
import { formErrorsDisplay, Reload, Redirect } from 'Helper/lib/ResponseHandler';
import AjaxHub from 'Helper/lib/AjaxHub.es';
import { camelString, generateTimeOptions, drawScore } from 'Helper/lib/utils';

$(document).ready(() => {

  $('.checkbox-group').find('label').click(function() {
    // console.log($(this).html());

    if($(this).html().trim() === '全国') {
      // console.log('ahha')
      $(this).closest('.input-field').find('.checkbox-group label').removeClass('active');
      $(this).closest('.input-field').find('.checkbox-group input').prop('checked', false);
    } else {
      $(this).closest('.input-field').find('.checkbox-group').first().find('label').removeClass('active');
      $(this).closest('.input-field').find('.checkbox-group').first().find('input').prop('checked', false);
    }
    $(this).prev().trigger('click');
    $(this).toggleClass('active');
  });

  // auth认证部分
  $('.auth-item')
        .hover((e) => {
          let  target = $(e.target).find('.update-auth-container');
          if(target.length) {
            $('.update-auth-container').removeClass('active');
            target.stop(true, true).addClass('active');
          }
        },
               (e) => {
                 $('.update-auth-container').removeClass('active');
               });
  // 显示能力评测数据
  $('.step1.fillin-card').find('.score-bar-container .percent')
    .attr('data-value', function(i, val){
      let actives = 0, items = 0, $this = $(this);

      $('.step1.fillin-card').find('.auth-list-container li').each(function(index){
        items++;
        if($(this).hasClass('active')) actives++;
      });
      $('#auth-get').find('.auth-text').each(function(index) {
        items++;
        if($(this).hasClass('active')) actives++;
      });
      val = (actives/items) * 100;
      return val;
    });
  drawScore($('.step1.fillin-card').find('.score-bar-container .percent'));

  // step1 数据提交
  $('.step1.fillin-card').find('.card-action .btn').click( (e) => {
    let data = getData(1, '.step1', FILLIN_INFO['Auth']),
        AuthAjax = AjaxHub.create(FILLIN_ITEM_INFO),
        destUrl = $(e.target).data('href'),
        errorHandle = formErrorsDisplay(FILLIN_INFO['Auth']),
        emmiter = $(e.target);

    AjaxHub.start(emmiter);

    if(data['zhihu_login'] === 'http://www.zhihu.com/people/') {
      data['zhihu_login'] = '';
    }
    if(data['blog_url'] === 'http://') {
      data['blog_url'] = '';
    }
    AuthAjax['Auth'](data)
      .done(errorHandle)
      .done((res) => {
        AjaxHub.finished(emmiter);
      })
      .done(Redirect(destUrl));
  });

  $('#skill').tagit();
  $('#languages').tagit();
  $('#expected-city').tagit();
  $('textarea').autogrow();
  //账户基本信息修改请求
  $('#account-password-form').validate();
  $('#step2-edit').validate();
  $('#fillin-step3').validate();
  $('#fillin-step4').validate();

  $('.panel-container').delegate('.time-till-now label', 'click', (e) => {
    $(e.target).toggleClass('active');
    $(e.target).siblings('input[type=checkbox]').trigger('click');
    $(e.target).closest('.time-container').find('.end-time-container').toggleClass('mute');
  });

  let timeSet = [
    ['year', '.panel-content', '.start-edu', 0, 12],
    ['year',  '.panel-content', '.end-edu', 1, 12],
    ['year',  '.panel-content', '.time-year', 1, 12],
    ['month',  '.panel-content', '.time-month']
  ];
  // 生成器
  function timeSelect() {
    $.each(timeSet, function(index) {
      generateTimeOptions.apply(timeSet[index], this);
    });
    $('select').jx_select();
  };
  timeSelect();
  // 根据具体需要将时间从年月合并为年-月的格式
  function preFormatTime(data) {
    if(data.hasOwnProperty("start_time_year") && data.hasOwnProperty("start_time_month")) {
      data.start_time = data.start_time_year + "-" + data.start_time_month;
      if(data.start_time === "-") {
        data.start_time = "";
      }
      // delete data.start_time_year;
      // delete data.start_time_month;
    }
    if(data.hasOwnProperty("end_time_year") && data.hasOwnProperty("end_time_month")) {
      data.end_time = data.end_time_year + "-" + data.end_time_month;

      if(data.end_time === "-") {
        data.end_time = "";
      }
    }
    if(data.hasOwnProperty("time_till_now") && data.time_till_now === 1 ) {
      data.end_time ? data.end_time = '' : data.end_year = '';
    }
      // delete data.end_time_year;
      // delete data.end_time_month;
    return data;
  }

  function scrollToSee(target) {
    // $('body,html').scrollTop($(target).offset().top);
    $('body,html').animate({
      scrollTop: $(target).offset().top - 100
    });
    // 如果有input则聚焦
    if($(target).find('input').length) {
      $(target).find('input').first().focus();
    }
  }

  // 期望职位选择
  $('.expected-position').jx_simpleSelect();

  let FillAjax = {};
  for(let type in FILLIN_ITEM_INFO ) {
    FillAjax[type] = AjaxHub.create(FILLIN_ITEM_INFO[type]);
  }
  // 获取城市列表
  $('.province li').click(function(){
    var province = ($('.province input').val().trim()),
        data = {
          province: province
        };
    FillAjax['Settings']['City'](data).done(function(res){
      // var select = $('.city select');
      var select = $('.city'),
          newSelect = $('<select id="city">');
      // console.log(select);
      select.empty();
      if(res.status) {
        for(var i = 0; i < res.message.length; i++){
          let option = $("<option>").text(res.message[i]);
          newSelect.append(option);
        }
        select.append(newSelect);
        newSelect.jx_select();
      }
    });
  });

  // console.log('webwewe');
  // step5的提交和补充描述提交
  $('#step5-edit .card-action .confirm, .introduction .card-action .confirm').click( (e) => {
    let target = camelString($(e.target).closest('.card-action').data('target')),
        errorHandle = formErrorsDisplay(FILLIN_INFO[target]),
        container = $('.basic-info');
    let data = getData(1, container, FILLIN_INFO[target]);

    // let fromHandler;
    // 多增出来的参数
    // if(!!$(e.target).data('from-handler')) {
    //   fromHandler = $(e.target).data('from-handler');
    // }
    // console.log(fromHandler);
    // console.log(data);
    let company = [], phases = $('.company-phase label.active');
    let city = [], cities = $('.expected-city-item label.active');
    /* console.log(phases); */
    $.each(phases, (index) => {
      company.push($((phases[index])).html().trim());
    });


    $.each(cities, (index) => {
      city.push($((cities[index])).html().trim());
    });

    delete data.expected_company_phase_item;
    data['expected_company_phase'] = company.toString();
    data['expected_work_cities'] = city.toString();
    data['expected_position_main'] = $('#expected-position').find('input').data('main-class').trim(); 
    data['expected_position_sub'] = $('#expected-position').find('input').data('sub-class').trim(); 
    delete data.expected_position;

    data = {
      _xsrf: data['_xsrf'],
      settings: JSON.stringify(data)
    };

    // console.log(data);

    FillAjax['Settings'][target](data)
      .done(errorHandle)
      .done((res) => {
        if(res.status) {
          let message = res.message.info ? res.message.info : res.message;
          if(target === 'Introduction') {
            $.notify(message);
            $('#fillin-step4').find('.introduction').addClass('show');
          }
          if(target === 'Expected') {
            $.notify(message);
            if(res.message.url) {
              setTimeout(() => {
                window.location = res.message.url;
              }, 1000);
            }
          }
        }
      });
  });
  // step2的提交
  $('#step2-edit .card-action').find('.confirm').click((e) => {
    let target = camelString($(e.target).closest('.card-action').data('target')),
        dest = $(e.target).data('href'),
        errorHandle = formErrorsDisplay(FILLIN_INFO[target]),
        container = $('.basic-info');
    let data = getData(1, container, FILLIN_INFO[target]);
    // console.log(data);
    dest = Redirect(dest);

    data = {
      _xsrf: data['_xsrf'],
      settings: JSON.stringify(data)
    };

    FillAjax['Settings'][target](data)
      .done(errorHandle)
      .done(dest);
  });

  // 附加信息交互事件
  $('#fillin-step4').find('#introduction').bind({
    focus: (e) => {
      /* console.log('jia'); */
      $(e.target).closest('.introduction').removeClass('show');
    }
  });
  $('#fillin-step4').find('.introduction .cancel').on('click', (e) =>{
      $(e.target).closest('.introduction').addClass('show');
  });

  // 显示新补充item
  $('.panel-new').click((e) => {
    let type = $(e.target).data('type'),
        target = $(e.target).parent().find('.panel-content.new.' + type + '-item'),
        targetContainer = $(e.target).parent().find('.card-panel.' + type);
    // 将panel状态改为新建状态
    /* console.log(targetContainer); */
    clearTable(target, FILLIN_INFO[camelString(type)]);
    targetContainer.find('.panel-content.exist').removeClass('mute');
    target.find('.panel-action').attr('data-type', 'new');
    target.find('.panel-action .delete').removeClass('active');
    target.addClass('active');
    scrollToSee(target);
  });

  // 添加panel中的取消
  $('.panel-content.new .panel-action').find('.cancel').click((e) => {
    e.preventDefault();
    let actionContainer = $(e.target).closest('.panel-action'),
        panelContainer = $(e.target).closest('.panel-content'),
        target = actionContainer.data('target');
    panelContainer.removeClass('active');
    clearTable(panelContainer, FILLIN_INFO[camelString(target)]);
  });
  // 修改panel中的取消
  $('.card-panel').delegate('.panel-content.exist .panel-action .cancel', 'click', (e) => {
    // console.log('ne');
    let panelContainer = $(e.target).closest('.panel-content.exist');
    panelContainer.find('.panel-edit-container').removeClass('active');
    panelContainer.find('.panel-show-container').removeClass('mute');
  });
  // 新项目添加
  $('.panel-content.new').delegate('.panel-action[data-type=new] .confirm', 'click', (e) => {
    // checkErrors();
    let emitter = $(e.target);

    AjaxHub.start(emitter);
    e.preventDefault();
    // console.log($(e.target).closest('.panel-action'));
    let target = $(e.target).closest('.panel-action').data('target'),
        target_id = target + '_id',
        container = $(e.target).closest('.panel-content.new'),
        cardContainer = $(e.target).closest('.card-panel.' + target);
    // target = $(e.target).parent().find('.panel-content[data-type=new]' + type + '-item');
    // 在这里需要变成camel格式
    target = camelString(target);
    let errorsHandler = formErrorsDisplay(container, FILLIN_INFO[target]);
    let rawData = getData(1, container, FILLIN_INFO[target], 1), data = rawData;
    // console.log(data);
    if(target === 'Project' || target === 'Workexp') {
      preFormatTime(data);
    };
    if(target === 'Award') {
      data['granted_at'] = data.time_year + "-" + data.time_month;
      // delete data.time_month;
    }

    FillAjax[target]['Create'](data)
      .done(errorsHandler)
      .done((res) => {
        AjaxHub.finished(emitter);
        if(res.status) {
          data['data_id'] = res.message[target_id];
          let newTemplate= juicer(FillInTemplate[target], rawData);
          $.notify(res.message.info, {
            callback: () => {
              $(newTemplate).insertAfter(container);
              $(newTemplate).validate();
              $('textarea').autogrow();
              clearTable(container, FILLIN_INFO[target]);
              container.removeClass('active');
            }
          });
        }
      });
  });
  // console.warn('haah');
  // 项目修改
  $('.main-container').delegate('.panel-content.exist span.edit-trigger', 'click',(e) => {
    e.preventDefault();
    // console.log('tet');
    let target = $(e.target).data('target'),
        cardContainer = $(e.target).closest('.card-panel.' + target),
        targetContainer = $(e.target).closest('.panel-content.exist');

    let editContainer =  targetContainer.find('.panel-edit-container'),
        showContainer =  targetContainer.find('.panel-show-container');

    targetContainer.find('textarea.jx').autogrow();
    targetContainer.find('.panel-show-container').addClass('mute');

    if(!editContainer.find('.dropdown-content').length) {
      // console.log('jiale');
      editContainer.find('select').jx_select();
    }
    target = camelString(target);
    timeSelect();
    let data = getData(1, showContainer, FILLIN_INFO[target]);
    // console.log(data);
    renderData(1, editContainer, data, FILLIN_INFO[target]);
    editContainer.addClass('active');
  });

  // 修改条目请求发送
  $('.main-container').delegate('.panel-edit-container .confirm', 'click', (e) => {
      e.preventDefault();
    let emitter = $(e.target);
      // console.log('edit');
      // TARGET_ID: 用于修改的id
      // targetId：由于在data[]中没法使用拼接
      let panelContent = $(e.target).closest('.panel-content.exist'),
          target = $(e.target).closest('.panel-action').data('target'),
          TARGET_ID = panelContent.attr('data-' + target + '-id'),
          showContainer = panelContent.find('.panel-show-container'),
          editContainer = panelContent.find('.panel-edit-container');
      // console.log(panelContent);
      let errorsHandler = formErrorsDisplay(editContainer, FILLIN_INFO[target]),
          targetID = target + '_id';
      let originTarget = $('.panel-content.exist[data-' + target + '-id=' + TARGET_ID + ']');

      target = camelString(target);
      let data = getData(1, editContainer, FILLIN_INFO[target], 1);
      data[targetID] = TARGET_ID;

      // if(target === 'Project'|| target === 'Workexp') {
      data = preFormatTime(data);
      // };
      if(target === 'Award') {
        data['granted_at'] = data.time_year + "-" + data.time_month;
        delete data.time_month;
      }
    AjaxHub.start(emitter);
      FillAjax[target]['Modify'](data)
        .done(errorsHandler)
        .done((res) => {
          AjaxHub.finished(emitter);
          if(res.status) {
            $.notify(res.message, {
              callback: () => {
                // console.log('xiugaichenggogn');
                // console.log(data);
                renderData(0, showContainer, data, FILLIN_INFO[target]);
                editContainer.removeClass('active');
                showContainer.removeClass('mute');
              }
            });
          }
        });
    });
  // 条目删除
  $('.card-panel')
    .delegate('.panel-action .delete', 'click', (e) => {
      let container = $(e.target).closest('.panel-content.exist'),
          target = $(e.target).closest('.panel-action').data('target');

      let TARGET_ID = container.attr('data-'+ target+'-id'),
      // let TARGET_ID = container.data(target+'-id'),
          sourceContainer = $(e.target).closest('.card-panel.' + target).find('.panel-content.exist[data-' + target + '-id=' + TARGET_ID + ']');
      // console.log(container);
      // console.log(container.attr('data-'+ target+'-id'));
      // 这里如果采用data获取值,会导致缓存上一个状态的值
      // console.log(TARGET_ID);
      let data = {
        _xsrf: $('input[name=_xsrf]').val().trim()
      };
      data[target + '_id'] = TARGET_ID;
      target = camelString(target);
      FillAjax[target]['Delete'](data)
        .done((res) => {
          if(res.status) {
            $.notify(res.message, {
              callback: (res) => {
                container.remove();
              }
            });
          } else {
            $.notify(res.errors.sys, {
              type: 'errors'
            });
          }
        });
    });

  // step5
  // 选中的按钮动作
  $('.company-phase label').click((e) => {
    $(e.target).toggleClass('active');
    $(e.target).siblings('input.filled-in').trigger('click');
  });

  // 确认相关信息
  $('.panel-content.exist').find('.confirm-mask-content').click((e) => {
    let targetContainer = $(e.target).closest('.panel-content.exist'),
        target = targetContainer.data('target'),
        target_id = target + '_id',
        targetId = targetContainer.data(target + '-id');
    // 包裹的最外层的
    let cardContainer = $(e.target).closest('.card-panel.' + target);
    target = camelString(target);
    let data = getData(1, targetContainer, FILLIN_INFO[target], 1);
    if(target === 'Workexp' || target === 'Project') {
      data = preFormatTime(data);
    }
    // console.log(data);
    FillAjax[target]['Create'](data)
      .done((res) => {
        targetContainer.remove();
        data['data_id'] = res.message[target_id];
        // console.log(data);
        let newTemplate= juicer(FillInTemplate[target], data);
        $.notify(res.message.info, {
          callback: () => {
            cardContainer.append(newTemplate);
          }
        });
      });
  });
});
