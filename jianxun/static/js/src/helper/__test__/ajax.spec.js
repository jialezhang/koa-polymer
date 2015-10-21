describe("mocking ajax", function() {

  describe("suite wide usage", function() {

    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("specifying response when you need it", function() {
      var doneFn = jasmine.createSpy("success");
      // let console = null;
      // let doneFn = spyOn(console, 'log');

      jasmine.Ajax.stubRequest('/some/url').andReturn({
        "status": 200, 
        "contentType": 'text/plain',
        "responseText": 'Hello from the world'
      });

      $.ajax({
        url: '/some/url'
      })
        .done((responseText) => {
          doneFn(responseText);
        })
        .fail(function() {
          console.log( "error" );
        })
        .always(function() {
          console.log( "complete" );
        });

      expect(doneFn).toHaveBeenCalledWith('Hello from the world');
      
    });

  });
});
