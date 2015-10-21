define(['jquery', 'Helper/lib/validate'], function($) {

  $.fn.extend({
    validate: function(callback ) {

      // Checks if instance is already created
      if ( this.data("instance") ) {
        return;
      }

      var $this = this;
      var temp = [];
      $this.find(".validate").each(function (i, el) {
        var $el = $(el);
        /* $el.keyup(function(){
         console.log($el.val());
         }) */
        temp.push(
          {
            name: $el.attr("name"),
            rules: $el.attr("data-rules"),
            display: $el.attr("data-display")
          });
      });
      // console.log(temp);
      // Create FormValidator object
      var validator = new FormValidator($this.attr('id'), temp, function(errors, event) {
        // Clear all error fields
        $this.find(".error").removeClass("error");
        $this.find(".help-block").attr('data-error', errors);
        // Check for errors
        if(errors.length > 0) {
          $.each(errors, function (index, err) {
            // Displays the erros message in the help-block
            var $target = $this
                  .find("*[id='" + err.id + "']")
                  .next(".help-block")
                  .html(err.message);
            // Adds error class to the controlgroup (bootstrap)
            $target.closest(".control-group").removeClass("error").addClass("error");
          });
          return false;
        } else {
          if (typeof callback === "function") {
            callback ($this, event ); //execute callback on form success
          }
        }
      });
      this.data("instance", validator);
    }

  });
});
