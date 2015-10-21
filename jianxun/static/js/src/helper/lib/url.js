export default class Url {

  /**
   * parse the url from string to object
   * @returns { Object } entity of url params object
   */
  static parse() {
    let urlParams;
    (window.onpopstate = function () {
      let match,
          pl     = /\+/g,  // Regex for replacing addition symbol with a space
          search = /([^&=]+)=?([^&]*)/g,
          decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
          query  = window.location.search.substring(1);

      urlParams = {};
      while (match = search.exec(query)){
        urlParams[decode(match[1])] = decode(match[2]);
      }
    })();
    return urlParams;
  }


  /**
   * update the url from the data 
   * @param { Object } data - the data need to be used to update the url 
   * @returns { Object } combine the url and data  
   */
  static update(data) {

    // 正则匹配出当前url中的搜索条件,更新选中条件
    // TODO: 不依赖jquery
    // for(var key in urlParams){
    //   if(data.hasOwnProperty(key) || key === 'error'){
    //     delete urlParams[key];
    //   }
    // }
    // for(var key2 in data){
    //   if(!data[key2]){
    //     delete data[key2];
    //   }
    // }
    let urlParams = this.parse();

    $.each(urlParams,function(key,value){
      if(data.hasOwnProperty(key)){
        delete urlParams[key];
      }
      if(key === 'error'){
        delete urlParams.error;
      }
    });

    $.each(data,function(key, value){
      if(value === ''){
        delete data[key];
      }
    });

    data = $.extend(urlParams,data);

    return data;
  }
};
