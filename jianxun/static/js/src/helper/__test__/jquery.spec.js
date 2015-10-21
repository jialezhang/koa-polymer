describe('just test for jquery ', () => {

  jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';
  // jasmine.getFixtures().fixturesPath = '../jianxun/static/javascript/fixture';

  let $ = $j; 
  loadFixtures('faq.html');

  it('test for jquery', function() {
    // $().destroyWin('window'); // jquery 1.3.2
    expect($('#window')).not.toBeInDOM(); // $j = jquery 2.1.1
  });

  it('test for checked', () => {
    expect($('<input type="checkbox" checked="checked"/>')).toBeChecked();
  });
  
  // failed
  // it('test for focus', () => {
  //   expect($('<input type="text" />').focus()).toBeFocused();
  // });

  it('test for match', () => {
    expect($('<span></span>').addClass('js-something')).toBeMatchedBy('.js-something');
  });
});
