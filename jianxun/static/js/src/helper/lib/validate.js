// 动态检测：
// 给每个确定的区域进行实时正则检测，及时报错
define('validate', function() {
  var defaults = {
    messages: {
      required: '%s 不能为空.',
      matches: '%s 和 %s 不一致.',
      valid_email: '%s 必须是一个正确格式的邮箱地址',
      valid_telephone: '请输入正确的手机号.',
      valid_name: '只能包含字母，数字和下划线.',
      valid_university: '请输入正确的学校名称.',
      valid_password: '密码必须包含数字和字母',
      valid_website: '网址格式错误',
      min_length: '%s 长度至少需要 %s 位',
      max_length: '%s 长度不能超过 %s 位.',
      exact_length: '%s 长度只能是 %s 位',
      less_than: 'The %s field must contain a number less than %s.',
      alpha: 'The %s field must only contain alphabetical characters.',
      alpha_numeric: '%s 只能包含数字',
      alpha_dash: 'The %s field must only contain alpha-numeric characters, underscores, and dashes.',
      numeric: 'The %s field must contain only numbers.',
      integer: '%s 只能是整数.',
      decimal: 'The %s field must contain a decimal number.',
      is_natural: 'The %s field must contain only positive numbers.',
      is_natural_no_zero: 'The %s field must contain a number greater than zero.',
      valid_ip: 'The %s field must contain a valid IP.',
      valid_base64: 'The %s field must contain a base64 string.',
      valid_credit_card: 'The %s field must contain a valid credit card number.',
      is_file_type: 'The %s field must contain only %s files.',
      valid_url: 'The %s field must contain a valid URL.',
      greater_than_date: 'The %s field must contain a more recent date than %s.',
      less_than_date: 'The %s field must contain an older date than %s.',
      greater_than_or_equal_date: 'The %s field must contain a date that\'s at least as recent as %s.',
      less_than_or_equal_date: 'The %s field must contain a date that\'s %s or older.'
    },
    callback: function(errors) {

    }
  };

  /*
   * Define the regular expressions that will be used
   */

  // 检测是否为正常的条件，比较奇葩的是min_length[12], matches[password]
  var ruleRegex = /^(.+?)\[(.+)\]$/,
      numericRegex = /^[0-9]+$/,
      integerRegex = /^\-?[0-9]+$/,
      decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
      // emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i ,
      telephoneRegex = /^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/,
      passwordRegex = /^(?![a-zA-z]+$)(?!\d+$)/i,
      websiteRegex = /^((https|http|ftp|rtsp|mms):\/\/){1}/,
      // nameRegex = /^[a-zA-Z0-9_\-]+$/i,
      nameRegex = /^[\u4e00-\u9fa5]{1,8}$|^[\dA-Za-z_]{1,20}$/,
      universityRegex = /^[\u4e00-\u9fa5]{0,30}$|^[\dA-Za-z]{1,20}$/,
      // 匹配中文长度不超过8位或者20个字节
      alphaRegex = /^[a-z]+$/i,
      alphaNumericRegex = /^[a-z0-9]+$/i,
      alphaDashRegex = /^[a-z0-9_\-]+$/i,
      naturalRegex = /^[0-9]+$/i,
      naturalNoZeroRegex = /^[1-9][0-9]*$/i,
      ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
      base64Regex = /[^a-zA-Z0-9\/\+=]/i,
      numericDashRegex = /^[\d\-\s]+$/,
      urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
      dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;
  /*
   * The exposed public object to validate a form:
   *
   * @param formNameOrNode - String - The name attribute of the form (i.e. <form name="myForm"></form>) or node of the form element
   * @param fields - Array - [{
   *     name: The name of the element (i.e. <input name="myField" />)
   *     display: 'Field Name'
   *     rules: required|matches[password_confirm]
   * }]
   * @param callback - Function - The callback after validation has been performed.
   *     @argument errors - An array of validation errors
   *     @argument event - The javascript event
   */

  var FormValidator = function(formNameOrNode, fields, callback) {

    this.callback = callback || defaults.callback;
    this.errors = [];
    this.fields = {};
    this.form = this._formByNameOrNode(formNameOrNode) || {};
    this.messages = {};
    this.handlers = {};
    this.conditionals = {};

    for (var i = 0, fieldLength = fields.length; i < fieldLength; i++) {
      var field = fields[i];
      // If passed in incorrectly, we need to skip the field.
      if ((!field.name && !field.names) || !field.rules) {
        continue;
      }

      /*
       * Build the master fields array that has all the information needed to validate
       */
      var element = this.form[field.name], that = this;
      // console.log(element);
      if (element && element !== undefined) {
        field.id = attributeValue(element, 'id');
        field.element = element;
        field.type = (element.length > 0) ? element[0].type : element.type;
        field.checked = attributeValue(element, 'checked');
        field.element.onkeyup = function(e){
          // console.log(e.keyCode);
          this.value = attributeValue(this.element, 'value');
          // this.element.nextElementSibling.dataset.error = that._validateField(this);
          // 实时显示错误
          /* console.log(this.value); */
          // this.element.parentNode.lastChild.previousSibling.innerHTML = that._validateField(this);
        }.bind(field);
        // console.log('jiale');

        field.element.onblur = function(e){
          console.log('blur');
          this.value = attributeValue(this.element, 'value');
          /* console.log('jiale');
             console.log(this.value); */
          this.element.parentNode.lastChild.previousSibling.innerHTML = that._validateField(this);
        }.bind(field);
        field.element.onfocus = function(e){
          // console.log('focus');
          // $(this.element).closest('.input-field').find('.help-block').html('');
          this.element.parentNode.lastChild.previousSibling.innerHTML = '';
        }.bind(field);

      this._addField(field, field.name);
      }
    }
    // attach an event callback when user input


    /*
     * Attach an event callback for the form submission
     */

      var _onsubmit = this.form.onsubmit;

          this.form.onsubmit = (function(that) {
            return function(evt) {
              try {
                return that._validateForm(evt) && (_onsubmit === undefined || _onsubmit());
              } catch(e) {}
            };
          })(this);
    },

      attributeValue = function (element, attributeName) {
        var i;

        if ((element.length > 0) && (element[0].type === 'radio' || element[0].type === 'checkbox')) {
          for (i = 0, elementLength = element.length; i < elementLength; i++) {
            if (element[i].checked) {
              return element[i][attributeName];
            }
          }
          return;
        }

        return element[attributeName];
      };

  /*
   * @public
   * Sets a custom message for one of the rules
   */

  FormValidator.prototype.setMessage = function(rule, message) {
    this.messages[rule] = message;

    // return this for chaining
    return this;
  };

  /*
   * @public
   * Registers a callback for a custom rule (i.e. callback_username_check)
   */

  FormValidator.prototype.registerCallback = function(name, handler) {
    if (name && typeof name === 'string' && handler && typeof handler === 'function') {
      this.handlers[name] = handler;
    }

    // return this for chaining
    return this;
  };

  /*
   * @public
   * Registers a conditional for a custom 'depends' rule
   */

  FormValidator.prototype.registerConditional = function(name, conditional) {
    if (name && typeof name === 'string' && conditional && typeof conditional === 'function') {
      this.conditionals[name] = conditional;
    }

    // return this for chaining
    return this;
  };

  /*
   * @private
   * Determines if a form dom node was passed in or just a string representing the form name
   */

  FormValidator.prototype._formByNameOrNode = function(formNameOrNode) {
    return (typeof formNameOrNode === 'object') ? formNameOrNode : document.forms[formNameOrNode];
  };

  /*
   * @private
   * Adds a file to the master fields array
   */

  FormValidator.prototype._addField = function(field, nameValue)  {
    this.fields[nameValue] = {
      name: nameValue,
      display: field.display || nameValue,
      rules: field.rules,
      depends: field.depends,
      id: null,
      element: null,
      type: null,
      value: null,
      checked: null
    };

  };

  /*
   * @private
   * Runs the validation when the form is submitted.
   */

  FormValidator.prototype._validateForm = function(evt) {
    this.errors = [];

    for (var key in this.fields) {
      if (this.fields.hasOwnProperty(key)) {
        var field = this.fields[key] || {},
            element = this.form[field.name];

        if (element && element !== undefined) {
          field.id = attributeValue(element, 'id');
          field.element = element;
          field.type = (element.length > 0) ? element[0].type : element.type;
          field.value = attributeValue(element, 'value');
          field.checked = attributeValue(element, 'checked');

          /*
           * Run through the rules for each field.
           * If the field has a depends conditional, only validate the field
           * if it passes the custom function
           */

          if (field.depends && typeof field.depends === "function") {
            if (field.depends.call(this, field)) {
              this._validateField(field);
            }
          } else if (field.depends && typeof field.depends === "string" && this.conditionals[field.depends]) {
            if (this.conditionals[field.depends].call(this,field)) {
              this._validateField(field);
            }
          } else {
            this._validateField(field);
          }
        }
      }
    }

    if (typeof this.callback === 'function') {
      this.callback(this.errors, evt);
    }

    if (this.errors.length > 0) {
      if (evt && evt.preventDefault) {
        evt.preventDefault();
      } else if (event) {
        // IE uses the global event variable
        event.returnValue = false;
      }
    }

    return true;
  };

  /*
   * @private
   * Looks at the fields value and evaluates it against the given rules
   */

  FormValidator.prototype._validateField = function(field) {
    var rules = field.rules.split('|'),
        indexOfRequired = field.rules.indexOf('required'),
        isEmpty = (!field.value || field.value === '' || field.value === undefined);
    /*
     * Run through the rules and execute the validation methods as needed
     */

    for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
      var method = rules[i],
          param = null,
          failed = false,
          // 检测是否是空
          parts = ruleRegex.exec(method);
      /*
       * If this field is not required and the value is empty, continue on to the next rule unless it's a callback.
       * This ensures that a callback will always be called but other rules will be skipped.
       */

      if (indexOfRequired === -1 && method.indexOf('!callback_') === -1 && isEmpty) {
        continue;
      }

      /*
       * If the rule has a parameter (i.e. matches[param]) split it out
       * 或者是 min_length[10]
       */
      // ["jiale[12]", "jiale", "12"]
      // 其中第一个匹配的是全部，第二个参数也就是method,第三个是param
      if (parts) {
        method = parts[1];
        param = parts[2];
      }

      if (method.charAt(0) === '!') {
        method = method.substring(1, method.length);
      }

      /*
       * If the hook is defined, run it to find any validation errors
       */
      // hook是一堆定义好的检测相应正则匹配的函数
      if (typeof this._hooks[method] === 'function') {
        if (!this._hooks[method].apply(this, [field, param])) {
          failed = true;
        }
      } else if (method.substring(0, 9) === 'callback_') {
        // Custom method. Execute the handler if it was registered
        // 自定义的检测函数
        method = method.substring(9, method.length);

        if (typeof this.handlers[method] === 'function') {
          if (this.handlers[method].apply(this, [field.value, param, field]) === false) {
            failed = true;
          }
        }
      }

      /*
       * If the hook failed, add a message to the errors array
       */

      if (failed) {
        // Make sure we have a message for this rule
        var source = this.messages[field.name + '.' + method] || this.messages[method] || defaults.messages[method],
            message = 'An error has occurred with the ' + field.display + ' field.';

        if (source) {
          message = source.replace('%s', field.display);

          if (param) {
            message = message.replace('%s', (this.fields[param]) ? this.fields[param].display : param);
          }
        }
        this.errors.push({
          id: field.id,
          element: field.element,
          name: field.name,
          message: message,
          rule: method
        });

        // Break out so as to not spam with validation errors (i.e. required and valid_email)
        break;
      }
    }
    return message ? message : '';
  };

  /**
   * private function _getValidDate: helper function to convert a string date to a Date object
   * @param date (String) must be in format yyyy-mm-dd or use keyword: today
   * @returns {Date} returns false if invalid
   */
  FormValidator.prototype._getValidDate = function(date) {
    if (!date.match('today') && !date.match(dateRegex)) {
      return false;
    }

    var validDate = new Date(),
        validDateArray;

    if (!date.match('today')) {
      validDateArray = date.split('-');
      validDate.setFullYear(validDateArray[0]);
      validDate.setMonth(validDateArray[1] - 1);
      validDate.setDate(validDateArray[2]);
    }
    return validDate;
  };

  /*
   * @private
   * Object containing all of the validation hooks
   */

  FormValidator.prototype._hooks = {
    required: function(field) {
      var value = field.value;

      if ((field.type === 'checkbox') || (field.type === 'radio')) {
        return (field.checked === true);
      }

      return (value !== null && value !== '');
    },

    "default": function(field, defaultName){
      return field.value !== defaultName;
    },

    matches: function(field, matchName) {
      var el = this.form[matchName];

      if (el) {
        return field.value === el.value;
      }

      return false;
    },

    valid_email: function(field) {
      return emailRegex.test(field.value);
    },
    valid_password: function(field) {
      return passwordRegex.test(field.value);
    },
    valid_website: function(field) {
      return websiteRegex.test(field.value);
    },
    // 自定义的姓名格式检测
    valid_name: function(field) {
      return nameRegex.test(field.value);
    },

    valid_university: function(field) {
      return universityRegex.test(field.value);
    },

    valid_telephone: function(field) {
      return telephoneRegex.test(field.value);
    },

    valid_emails: function(field) {
      var result = field.value.split(/\s*,\s*/g);

      for (var i = 0, resultLength = result.length; i < resultLength; i++) {
        if (!emailRegex.test(result[i])) {
          return false;
        }
      }

      return true;
    },

    min_length: function(field, length) {
      if (!numericRegex.test(length)) {
        return false;
      }

      return (field.value.length >= parseInt(length, 10));
    },

    max_length: function(field, length) {
      if (!numericRegex.test(length)) {
        return false;
      }

      return (field.value.length <= parseInt(length, 10));
    },

    exact_length: function(field, length) {
      if (!numericRegex.test(length)) {
        return false;
      }

      return (field.value.length === parseInt(length, 10));
    },

    greater_than: function(field, param) {
      if (!decimalRegex.test(field.value)) {
        return false;
      }

      return (parseFloat(field.value) > parseFloat(param));
    },

    less_than: function(field, param) {
      if (!decimalRegex.test(field.value)) {
        return false;
      }

      return (parseFloat(field.value) < parseFloat(param));
    },

    alpha: function(field) {
      return (alphaRegex.test(field.value));
    },

    alpha_numeric: function(field) {
      return (alphaNumericRegex.test(field.value));
    },

    alpha_dash: function(field) {
      return (alphaDashRegex.test(field.value));
    },

    numeric: function(field) {
      return (numericRegex.test(field.value));
    },

    integer: function(field) {
      return (integerRegex.test(field.value));
    },

    decimal: function(field) {
      return (decimalRegex.test(field.value));
    },

    is_natural: function(field) {
      return (naturalRegex.test(field.value));
    },

    is_natural_no_zero: function(field) {
      return (naturalNoZeroRegex.test(field.value));
    },

    valid_ip: function(field) {
      return (ipRegex.test(field.value));
    },

    valid_base64: function(field) {
      return (base64Regex.test(field.value));
    },

    valid_url: function(field) {
      return (urlRegex.test(field.value));
    },

    valid_credit_card: function(field){
      // Luhn Check Code from https://gist.github.com/4075533
      // accept only digits, dashes or spaces
      if (!numericDashRegex.test(field.value)) return false;

      // The Luhn Algorithm. It's so pretty.
      var nCheck = 0, nDigit = 0, bEven = false;
      var strippedField = field.value.replace(/\D/g, "");

      for (var n = strippedField.length - 1; n >= 0; n--) {
        var cDigit = strippedField.charAt(n);
        nDigit = parseInt(cDigit, 10);
        if (bEven) {
          if ((nDigit *= 2) > 9) nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
      }

      return (nCheck % 10) === 0;
    },

    is_file_type: function(field,type) {
      if (field.type !== 'file') {
        return true;
      }

      var ext = field.value.substr((field.value.lastIndexOf('.') + 1)),
          typeArray = type.split(','),
          inArray = false,
          i = 0,
          len = typeArray.length;

      for (i; i < len; i++) {
        if (ext == typeArray[i]) inArray = true;
      }

      return inArray;
    },

    greater_than_date: function (field, date) {
      var enteredDate = this._getValidDate(field.value),
          validDate = this._getValidDate(date);

      if (!validDate || !enteredDate) {
        return false;
      }

      return enteredDate > validDate;
    },

    less_than_date: function (field, date) {
      var enteredDate = this._getValidDate(field.value),
          validDate = this._getValidDate(date);

      if (!validDate || !enteredDate) {
        return false;
      }

      return enteredDate < validDate;
    },

    greater_than_or_equal_date: function (field, date) {
      var enteredDate = this._getValidDate(field.value),
          validDate = this._getValidDate(date);

      if (!validDate || !enteredDate) {
        return false;
      }

      return enteredDate >= validDate;
    },

    less_than_or_equal_date: function (field, date) {
      var enteredDate = this._getValidDate(field.value),
          validDate = this._getValidDate(date);

      if (!validDate || !enteredDate) {
        return false;
      }

      return enteredDate <= validDate;
    }
  };

  window.FormValidator = FormValidator;

});
