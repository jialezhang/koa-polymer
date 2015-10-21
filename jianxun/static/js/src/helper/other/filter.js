define(['jquery', 'Settings/filter-settings', 'Vendors/jquery.pjax', 'Utils/url'], function($, filterConfig, pjax, Url){
  var filter = {};
  var $tag = {
    city : '',
    position : '',
    position_tag : '',
    position_container : '',
    education : '',
    exp : '',
    company_state : ''
  };
  var data = {
    page : 1
  };
  var pathname =  window.location.pathname;
  var searchConfig = {
    url: pathname === '/' || pathname === '/search/job' ? '/search/job' : '/subscription/search' ,
    type: 'GET'
  };
  filter.setTag  = function($this, flag, setDefault){
    var filterType = $this.closest('.filter-container').attr('id');
    $("#" + filterType + ' a').each(function(){
      $(this).removeClass('active');
    });
    // 如果不是已选中元素就添加样式
    if(!flag || setDefault){
      $this.addClass('active');
    }else{
      // 否则选中“默认”
      $("#" + filterType + ' a.filter-none').addClass('active');
    }
  };

  filter.init = function(){
    for(var key in filterConfig.main){
      //每个标签点击触发事件
      var getFilter = function(key){
        $('.filter-search.bind').delegate(filterConfig.main[key].container, 'click', function(e){
          var value = $(this).html(),
              flag = $(this).hasClass('active'),
              condition = key,
              data = {};
          if(value === '不限'|| flag ){
            value = '';
          }
          if (value === '上一页' || value === '下一页') {
            value = $(this).attr('title');
          }
          // 设立样式
          filter.setTag($(this), flag);
          data[condition] = value;
          data = Url.updateUrl(data);
          var options = {
            container: '#jobs-container',
            url: searchConfig.url,
            type: searchConfig.type,
            data: data
          };
          $(options.container).on('pjax:success',function(){
            /* $('#search-misc-diaplay').css({'display': 'block'}); */
            var total = $(options.container + ' #result_total').attr('value');
            /* took = $(options.container + ' #time_consumed').attr('value'); */
            /* $('#display_time_consumed').html(took/1000); */
            $('#display_result_total').html(total);
          });
          $.pjax(options);
        });
      }(key);
    };
    // 薪水精确度排序和页码
    filter.pagination = function() {
      for(var key in filterConfig.jobs){
        //每个标签点击触发事件
        var getFilter = function(key){
          $('.main-content').delegate(filterConfig.jobs[key].container, 'click', function(e){
            var value = $(this).html(),
                flag = $(this).hasClass('active'),
                condition = key,
                data = {};
            if (value === '上一页' || value === '下一页') {
              value = $(this).attr('title');
            }
            data[condition] = value;
            data = Url.updateUrl(data);
            var options = {
              container: '#jobs-container',
              url: searchConfig.url,
              type: searchConfig.type,
              data: data
            };
            $.pjax(options);
          });
        }(key);
      }
      // $('.main-content').delegate('#filter-page a', 'click', function(e) {
      //   var value = $(this).html(),
      //       flag = $(this).hasClass('active'),
      //       data = {};
      //   if (value === '上一页' || value === '下一页') {
      //     value = $(this).attr('title');
      //   }
      //   // 设立样式
      //   filter.setTag($(this), flag);
      //   data['page'] = value;
      //   data = Url.updateUrl(data);
      //   console.log(searchConfig.url);
      //   var options = {
      //     container: '#jobs-container',
      //     url: searchConfig.url,
      //     type: searchConfig.type,
      //     data: data
      //   };
      //   $.pjax(options);
      // });
    };
    // 职位显示子栏
    $('#position .filter-position a').click(function(e){
      var subclass = $(this).data('value');
      $('.filter-position a').removeClass('selected');
      $(this).toggleClass('selected');
      /*       $('#position>.filter-position-more').toggle('slow'); */
      $('#position>.filter-position-more').addClass('hide');
      $('#position #'+ subclass).removeClass('hide');
    });
    // 城市列表显示
    $(".btn-city-more").on("click", function () {
      $(".btn-city-more").toggle();
      $("#city-more").toggle("slow");
    });
    // 显示搜索过程数据
    if(!!$('#result_total').attr('value')){
      $('#search-misc-diaplay').css({'display': 'block'});
      var total = $('#jobs-container #result_total').attr('value'),
          took = $('#jobs-container #time_consumed').attr('value');
      $('#display_time_consumed').html(took/1000);
      $('#display_result_total').html(total);
    }
  };

  // setTag和bind绑定指定区域的点击效果,默认选项指定class为filter-none,单个选择项用filter-container包裹
  filter.bind = function(options){
    console.log(options);
    // options = {
    //   container: 整个filter的包容器

    // }
    // var clickData = $('<input id="#click-data" "type=text" style="display: none">');
    for(var key in options.selector){
      //每个标签点击触发事件
      var clickFilter = function(key){
        $(options.container).delegate(options.selector[key].container,'click',function(e){

          var value = $(this).html(),
              flag = $(this).hasClass('active'),
              condition = key,
              data = {};
          if(value === '不限'|| flag ){
            value = '';
          }
          // 设立样式
          filter.setTag($(this), flag);
        });
      }(key);
    };
  };
  // 获取已经clicked的值
  filter.getClicked = function(selector){
    var data = {}, prop = '';
    $.each(selector, function(key, value){
      // 如果对应有active的class标记出来
      $('.filter-search '+selector[key].container).each(function(index){
        prop = $(this).html().trim();
        if($(this).hasClass('active') && prop !== '不限'){
          data[key] = prop;
        }
      });
    });
    return data;
  };
  filter.highlight = function(options, selector){
    var highLights = {};
    // 遍历各种搜索条件的配置
    $.each(selector, function(key, value){
      // 如果链接中存在相应的条件项就开始遍历相应项的子项，找出对应子项并高亮
      if(options.hasOwnProperty(key)){
        if(key === 'pt'){

        }
        $(selector[key]).each(function(index){
          $(this.container).each(function(index){
            $(this).removeClass('active');
            // TODO: 缩短这个条件语句
            if($(this).html()=== options[key]|| $(this).data('sid')=== options[key]){
              $(this).addClass('active');
            }
          });
        });
      }
    });
  };
  $(document).ready(function() {
    filter.init();
    filter.pagination();
  });
  return filter;
});
