module.exports = ViewHandler;

var app = require('../app');
var hbs = require('hbs');
var shortid = require('shortid');
var fs = require('fs');
var os = require('os');
var ifaces = os.networkInterfaces();
var moment = require('moment');

var staticVersion = shortid.generate();
function ViewHandler(){}

ViewHandler.initializeGlobalVars = function(){
    hbs.localsAsTemplateData(app);
    app.locals.staticVersion = staticVersion;
    app.locals.isProduction = ( app.get('env') === 'production' );
    return true;
};

ViewHandler.initializeHelpers = function(){
    console.log("came in helpers");
    hbs.registerHelper('ifCond', function (argv1, argv2, options) {
        if (argv1 === argv2)
            return options.fn(this);
        return options.inverse(this);
    });

    hbs.registerHelper('unlessCond', function (argv1, argv2, options) {
        if (argv1 !== argv2)
            return options.fn(this);
        return options.inverse(this);
    });
    hbs.registerHelper('uppercase', function(args){
        return args.toUpperCase();
    });

    hbs.registerHelper('ifAndUndefined', function (argv1, argv2, options){
        if (argv1 && (argv2 === undefined))
            return options.fn(this);
        return options.inverse(this);
    });

    hbs.registerHelper("evaluateJavascriptValue", function (val) {
        if (val === undefined)
            return "null";
        return val;
    });

    hbs.registerHelper("forTopicCards", function(index_count,block) {
        if(parseInt(index_count)=== 0){
            return block.fn(this);}
    });

    hbs.registerHelper("forBlogCards", function(index_count,block) {
        if(parseInt(index_count)=== 6){
            return block.fn(this);}
    });

    hbs.registerHelper("greaterThan",function(index1, index2, options){
        if(index1>index2){
            return options.fn(this);
        }
    });

    hbs.registerHelper("lesserThan",function(index1, index2, options){
        if(index1<index2){
            return options.fn(this);
        }
    });

    hbs.registerHelper("breaklines", function(text) {
        text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
        return text;
    });

    hbs.registerHelper("fetchFirstWord", function(text){
      if(text && text != undefined)
        return text.split(' ', 2)[0];
        else return "";
    });

    hbs.registerHelper("fetchString", function( string_identifier, language ){
      switch( language ){
        case "english" : return ENGLISH_LANGUAGE_STRING_CONSTANTS[string_identifier];
        default: return ENGLISH_LANGUAGE_STRING_CONSTANTS[string_identifier];
      }
    });

    hbs.registerHelper("fetchHeaderMenu", function(string_identifier){
      // console.log(HEADER_SECOND_ROW_URLS[string_identifier]);
      return HEADER_SECOND_ROW_URLS[string_identifier];
    });

    hbs.registerHelper("ifModThree", function(index, number, options){
      if(index % 3 == number)
        return options.fn(this);
      return options.inverse(this);
    });

    hbs.registerHelper("formatTime", function(time){
        format = "DD - MMM - YYYY";
        return moment(time).format(format);
    });

    hbs.registerHelper("getTime", function(time){
        return time.getTime();
    });

    hbs.registerHelper("truncate", function(string, length) {

      var len = parseInt(length);
      if(string.length > len) {
        return string.substr(0, len) + "...";
      }
      return string;
    });

    return true;
};

ViewHandler.initializePartials = function(){

    // TODO convert this to promise style recursion
    var partialsDirectory = __dirname + '/../views/partials';
    // var min_css_directory = __dirname + '/../public/stylesheets';
    registerCustomPathPartials(partialsDirectory);
    // registerCssCustomPathPartials(min_css_directory);

    function registerCustomPathPartials(objectPath) {

        if (!objectPath || objectPath.length == 0)
            return;

        if (fs.lstatSync(objectPath).isFile()) {

            var matches = /^.*(partials\/)([^.]+)\.hbs$/.exec(objectPath);
            if (!matches) {
                return;
            }
            var completeName = matches[2];
            completeName = completeName.replace(/[ +-\/]/g, "_");
            completeName = ( "partial_" + completeName );
            var partialTemplate = fs.readFileSync(objectPath, 'utf8');
            hbs.registerPartial(completeName, partialTemplate);
            //console.log( "Partial Registered: ", completeName );
        }

        if (fs.lstatSync(objectPath).isDirectory()) {

            var fileNames = fs.readdirSync(objectPath);
            fileNames.forEach(function (fileName) {
                registerCustomPathPartials(objectPath + '/' + fileName);
            });
        }
    }

    function registerCssCustomPathPartials(objectPath) {
        // console.log("objectPath: ", objectPath);

        if (!objectPath || objectPath.length == 0)
            return;

        if (fs.lstatSync(objectPath).isFile()) {

            if( /.*\.css/.test( objectPath ) ){

                var filePathArr = objectPath.split("public/stylesheets/");
                var relativeFilePath = filePathArr[ filePathArr.length - 1 ];
                // console.log("relativeFilePath: ", relativeFilePath);

                var completeName = relativeFilePath;
                // console.log("completeName: ", completeName);
                completeName = completeName.replace(/[ +-\/.]/g, "_");
                completeName = ( "stylesheet_" + completeName );
                var partialTemplate = fs.readFileSync(objectPath, 'utf8');
                hbs.registerPartial(completeName, partialTemplate);
                // console.log( "Partial Registered: ", completeName );
            }

        }

        if (fs.lstatSync(objectPath).isDirectory()) {

            var fileNames = fs.readdirSync(objectPath);
            fileNames.forEach(function (fileName) {
                registerCssCustomPathPartials(objectPath + '/' + fileName);
            });
        }
    }

    return true;
};

ViewHandler.renderViewWithParams = function( requestParams, res, options ){
        var view = options.view;
        delete options.view;

        res.render( view, requestParams, function( err, html ){
            if(err)
                console.log("Got err", err);
            res.send(html);
        });
    
};
