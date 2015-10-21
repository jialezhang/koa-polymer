var path = require('path');
var fs = require('fs');
var walk = require('walk');
var changeCase = require('change-case');
var minify = require('html-minifier').minify;
var ROOT_PATH = path.resolve(__dirname, 'source');
var DIST_PATH = path.resolve(__dirname, 'dist');

var WALK_OPTIONS = {
  followLinks: false
};

var walker = walk.walk(ROOT_PATH, WALK_OPTIONS);
var templateContent = fs.writeFile('template.js', 'export const FillInTemplate = {};', function(err) {
}); 

walker.on('file', function(root, fileState, next) {
  var fileName = fileState.name.split('.')[0];
  var fileFullName = path.resolve(root, fileState.name);
  var distPath = root.replace('source', 'dist');
  var fileVariable = changeCase.camelCase(fileName);
  console.log(distPath);

  fs.stat(distPath, function(err, state) {
    if(!state) {
      fs.mkdir(distPath, function() {
      });
    };
  });

  var fileContent = fs.readFile(fileFullName, 'utf8', function(err, data) {
    if(err) console.log(err);
    // var fileVariableData = data.replace(/>\s+</g,'><'); 
    var fileVariableData = minify(data, {
      collapseWhitespace: true
    });
    var completeContent  = 'export const ' + fileVariable + "= '" + fileVariableData  + "';"; 
    fs.writeFile(distPath + '/' + fileName + '.js', completeContent, function(err) {
      if(err) throw err;
      console.log(fileName + '.js 执行成功');
     });
  }); 
  next();
});
