import _ from 'Vendor/underscore/underscore';

export default class Helper {

  /**
   * generate unique width unmber and letter
   * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
   * @returns { String } the unique id
   */
  static guid() {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    return (function() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    })();
  }
};
