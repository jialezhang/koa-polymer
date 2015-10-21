import Helper from 'Helper/helper';
import 'UI/dropdown';

const ARROW = $('<div class="arrow-container"><i class="arrow arrow-down"></i></div>');

class Select {
  static initial() {
    
  }
}

$.fn.jx_select = function (callback) {
  // console.log($(this).children());
  // console.log($(this).parent().find('.dropdown-content'));
  // 检测是否已经存在被包裹的wrapper 
  if($(this).parent().find('.dropdown-content').length) {
    return ;
  }
  
  $(this).each(function(){
    let $select = $(this);

    // Tear down structure if Select needs to be rebuilt
    let  lastID = $select.data('select-id');
    if (lastID) {
      $select.parent().find('i').remove();
      $select.parent().find('input').remove();
     // 删除$select的父元素  
      $select.unwrap();
      $('ul#select-options-'+lastID).remove();
    }

    // If destroying the select, remove the selelct-id and reset it to it's uninitialized state.
    if(callback === 'destroy') {
      $select.data('select-id', null).removeClass('initialized');
      return;
    }

    let uniqueID = Helper.guid(), label;
    let wrapper = $('<div class="select-wrapper"></div>');
    // 由于选择类的需要，如果改为class,在渲染选择项的时候会有麻烦
    // wrapper.addClass($select.attr('class'));
    wrapper.attr('data-origin', ($select.attr('class')));
    let options = $('<ul id="select-options-' + uniqueID+'" class="dropdown-content select-dropdown"></ul>');
    let selectOptions = $select.children('option');
    // console.log(options.first());
    if ($select.find('option:selected') !== undefined) {
      label = $select.find('option:selected');
    }
    else {
      label = options.first();
    }

    let $newSelect = $('<input type="text" class="select-dropdown" readonly="true" ' + (($select.is(':disabled')) ? 'disabled' : '')
                       + ' data-activates="select-options-' + uniqueID +'" value="'+ label.html() +'"/>');
    $select.data('select-id', uniqueID);
    // Create Dropdown structure
    selectOptions.each(function () {
      // Add disabled attr if disabled
      if($(this).is(':disabled')){
        return ;
      } else {
        // 将原本options中的data-类属性复制到新的的span中
        // console.log($(this).getAttributes());
        let babyEle = $('<span>' + $(this).html() + '</span>');
        babyEle.attr($(this).getAttributes());
        let babyEleContainer = $('<li>');
        if($(this).is(':selected')) {
          babyEleContainer.addClass('selected');
        }
        // console.log(babyEle);
        babyEleContainer.append(babyEle);
        options.append(babyEleContainer);
      }
    });

    options.find('li').each(function (i) {
      let $curr_select = $select;
      $(this).click(function () {
        // Check if option element is disabled
        if (!$(this).hasClass('disabled')) {
          $curr_select.find('option').eq(i).prop('selected', true);
          options.find('li').removeClass('selected');
          $(this).addClass('selected');

          // Trigger onchange() event
          $curr_select.trigger('change');
          $curr_select.siblings('input.select-dropdown').val($(this).text());
          if (typeof callback !== 'undefined') callback();
          $newSelect.trigger('close');
        }
      });
    });

    // Wrap Elements
    $select.wrap(wrapper);
    // Add Select Display Element
    let dropIcon = $('<div class="arrow-container"><i class="arrow arrow-down"></i></div>');
    if ( $select.is(':disabled') )

      dropIcon.addClass('disabled');


    let labelData = label.data();
    $select.before($newSelect);

    $newSelect.before(dropIcon);

    $newSelect.data(labelData);

    // 小箭头触发事件
    dropIcon.click((e) => {
      // console.log($newSelect);
      if(options.hasClass('active')) {
        $newSelect.trigger('close');
      } else {
        $newSelect.trigger('open');
      }
    });

    $('body').append(options);
    // Check if section element is disabled
    if (!$select.is(':disabled')) {
      $newSelect.dropdown({"hover": false});
    }

    // Copy tabindex
    if ($select.attr('tabindex')) {
      $($newSelect[0]).attr('tabindex', $select.attr('tabindex'));
    }

    $select.addClass('initialized');

    let activateOption = function(collection, newOption) {
      collection.find('li.active').removeClass('active');
      $(newOption).addClass('active');
      // collection.scrollTo(newOption);
    };

    $newSelect.on('focus', function(){
      $(this).trigger('open');
      label = $(this).val();
      let selectedOption = options.find('li').filter(function() {
        return $(this).text().toLowerCase() === label.toLowerCase();
      })[0];
      activateOption(options, selectedOption);
    });

    $newSelect.on('blur', function(){
      $(this).trigger('close');
    });

    // Make option as selected and scroll to selected position
    // Allow user to search by typing
    // this array is cleared after 1 second
    let filterQuery = [];

    let onKeyDown = function(event){
      // TAB - switch to another input
      if(event.which == 9){
        $newSelect.trigger('close');
        return;
      }

      // ARROW DOWN WHEN SELECT IS CLOSED - open select options
      if(event.which == 40 && !options.is(":visible")){
        $newSelect.trigger('open');
        return;
      }

      // ENTER WHEN SELECT IS CLOSED - submit form
      if(event.which == 13 && !options.is(":visible")){
        return
      }

      event.preventDefault();

      // CASE WHEN USER TYPE LETTERS
      let letter = String.fromCharCode(event.which).toLowerCase();

      if (letter){
        filterQuery.push(letter);

        let string = filterQuery.join("");

        let newOption = options.find('li').filter(function() {
          return $(this).text().toLowerCase().indexOf(string) === 0;
        })[0];

        if(newOption){
          activateOption(options, newOption);
        }
      }

      // ENTER - select option and close when select options are opened
      if(event.which == 13){
        let activeOption = options.find('li.active:not(.disabled)')[0];
        if(activeOption){
          $(activeOption).trigger('click');
          $newSelect.trigger('close');
        }
      }

      // ARROW DOWN - move to next not disabled option
      if(event.which == 40){
        let newOption = options.find('li.active').next('li:not(.disabled)')[0];
        if(newOption){
          activateOption(options, newOption);
        }
      }

      // ESC - close options
      if(event.which == 27){
        $newSelect.trigger('close');
      }

      // ARROW UP - move to previous not disabled option
      if(event.which == 38){
        let newOption = options.find('li.active').prev('li:not(.disabled)')[0];
        if(newOption){
          activateOption(options, newOption);
        }
      }

      // Automaticaly clean filter query so user can search again by starting letters
      setTimeout(function(){filterQuery = []}, 1000);
    };

    $newSelect.on('keydown', onKeyDown);
  });
};

$.fn.jx_simpleSelect = function() {
  let uniqueID = Helper.guid(); 
  let $select = $(this);

  let wrapper = $('<div class="select-wrapper"></div>');
  // 由于选择类的需要，如果改为class,在渲染选择项的时候会有麻烦
  wrapper.attr('data-origin', ($select.attr('class')));

  let label = $select.children('li.selected');
// 删除disabled的选项 
  $select.children('li.disabled').remove();
  
  let $newSelect = $('<input type="text" class="select-dropdown" readonly="true" ' + ' data-activates="select-options-' + uniqueID +'" value="'+ label.html() +'"/>');
  let mainClass = $select.children('li[diyishuai]');

  if(mainClass.length) {
    let mainClassContent = mainClass.find('span').html().trim();
    let subClass = mainClass.find('li[diyishuai]');
    // 呈现的内容
    let subClassDisplayContent = '';
    // 写入的内容
    let subClassRawContent = '';
    if(subClass.length) {
      subClassRawContent = subClass.find('span').html().trim(); 
      subClassDisplayContent = ' - ' + subClass.find('span').html().trim();
    }
    $newSelect.val(mainClassContent +  subClassDisplayContent);
    $newSelect.data('main-class', mainClassContent).data('sub-class', subClassRawContent);
  }

  $select.attr('id', 'select-options-' + uniqueID).addClass('dropdown-content select-dropdown');

  // Wrap Elements
  $select.wrap(wrapper);

  $select.before($newSelect);

  $newSelect.before(ARROW);

  $newSelect.dropdown({"hover": false});

  $select.children('li').each(function() {

    if(!$(this).children('ul').length) {
      $(this).click(function() {
        // e.preventDefault();
        $newSelect.val($(this).find('span').html());
      });
    }

    $(this).find('li').click(function(){
      let mainClassification = $(this).closest('.position-item').find('span').html().trim();
      let subClassification = $(this).find('span').html().trim();

      $newSelect.data('main-class', mainClassification).data('sub-class', subClassification);
      $newSelect.val( mainClassification + ' - ' + subClassification );
                             // console.log($(this).html());
    }); 
  });
}
