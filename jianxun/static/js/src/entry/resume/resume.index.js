import navbar from 'UI/component/navbar';
import tabs from 'Vendor/jquery.tabs';
import autogrow from 'Helper/plugin/textarea';
import AjaxHub from 'Data/AjaxHub.es';
import { formatTime, drawScore, renderPullMessage,
         scrollFixed } from 'Helper/lib/utils';
import Upload from 'Vendor/jquery.fileupload';
import juicer from 'Vendor/juicer';

import ResumeChart from './partial/Chart.Resume';
import Evaluate from './partial/Evaluate.Resume';
import { Resume } from './setting/url';

import _ from 'Vendor/underscore/underscore';

$(document).ready(function() {

  let xsrf = $('input[name=_xsrf]').val().trim();

  $('.head-menu .menu-tabs').tabs();
  // 将head-menu固定在顶部
  scrollFixed('.head-menu');
  // let ResumeAjax = AjaxCreate(Resume);
  let ResumeAjax = AjaxHub.create(Resume);

  $('.sidebar-content .new-item textarea').autogrow();
  // // 侧边栏简历修改申请获取

  $('textarea.jx').autogrow();

  ResumeAjax['PatchGet']()
            .done(function(res) {
              if(!!res.message) {

                let patch = '<textarea class="jx-textarea text-display-item" readonly></textarea>';
                renderPullMessage('.resume-patch-release .patch-lists', patch, res.message );
                $('.patch-lists textarea').autogrow();
              }
            });
  /* 侧边栏简历申请修改 */
  $('.resume-patch-release').find('.action-content, .footer-action .cancel')
     .click(() => {
       $('.resume-patch-release').toggleClass('active');
     });


  $('.score-bar-container .percent').each(function() {
    drawScore($(this));
  });

  // language type record change
  $('.resume-skill-menu').children('li').click(function() {
    /* console.log('1'); */
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    let target = $(this).attr('target');
    /* console.log($('.skill-consist-main').find('.section-content[data-lang="' + target + '"]')); */
    $('.skill-consist-main').find('.skill-section-content').removeClass('active');
    $('.skill-consist-main').find('.skill-section-content[data-lang="' + target + '"]').addClass('active');
  });

  // 账号信息部分切换
  $('.resume-account-menu').children('li').click(function() {
    /* console.log('2'); */
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    let target = $(this).attr('target');
    $('.account-info-main').find('.account-section-content').removeClass('active');
    $('.account-info-main').find('.' + target).addClass('active');
  });

  $('.head-menu .tab').find('a').click(function() {
    let target = '.' + $(this).attr('target'),
        targetTop = $('.' + $(this).attr('target') ).offset().top;
    $('body').animate({
      scrollTop: targetTop - 56
    });
  });
});
