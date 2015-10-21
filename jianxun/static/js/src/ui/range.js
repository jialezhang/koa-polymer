$.fn.jx_range = function () {
  // input range
  var s = document.createElement('style'),
      // r = document.querySelector('input[type=range]'),
      r = this,
      prefs = ['webkit-slider-runnable', 'moz-range'];

  document.body.appendChild(s);

  var getTrackStyleStr = function(el, val) {
    var str = '', len = prefs.length;

    for(var i = 0; i < len; i++) {
      str += '.jx input[type=range]::-' + prefs[i] +
        '-track{background-size:' + val + '}';
    }
    return str;
  };

  var getTipStyleStr = function(el, val) {
    var str = '.jx input[type=range] /deep/ #thumb:before{content:"' +
          val + '%"}';

    return str;
  };

  var getValStr = function(el, p) {
    var min = el.min || 0,
        p = p || el.value,
        perc = (el.max) ? ~~(100*(p - min)/(el.max - min)) : p,
        val = perc + '% 100%,100% 100%, 100% 100%';

    return val;
  };

  this.on('input', function() {
    s.textContent = getTrackStyleStr(this, getValStr(this));
    s.textContent += getTipStyleStr(this, this.value);
  });
};
