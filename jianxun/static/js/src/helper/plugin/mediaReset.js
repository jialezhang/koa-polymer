document.createElement( "picture" );

$(document).ready(function() {
  /* 定义一个最小屏幕高度 */
  /* 568---5S, 736 --6P  */
  let minScreenHeight  = 560, maxScreenHeight = 740;
  let midScreenWidth = 481;
  let  setHeight = () => {
    let windowHeight = $(window).innerHeight(),
        windowWidth = $(window).innerWidth();
    /* console.log(windowWidth);
       console.log(windowHeight); */
    if(windowWidth < midScreenWidth && minScreenHeight  < windowHeight <  maxScreenHeight) {
      $('.dist-content').each(function() {
        if(!$(this).find('.faq-title').length) {
          $(this).css('height', windowHeight);
        }
      })
    }
  };

  setHeight();

  $(window).resize(function() {
    setHeight();
  });
});
