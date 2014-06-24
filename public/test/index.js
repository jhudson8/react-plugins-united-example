var jsdom = require('jsdom').jsdom;
var chai = require('chai');
var mocha = require('mocha');
var sinon = require('sinon');
var expect = chai.expect;
global.chai = chai;
global.expect = expect;

var doc = jsdom('');
var window = doc.createWindow();
global.window = window;
global.document = window.document;
global.navigator = window.navigator = {userAgent: ''};
global.jQuery = window.jQuery = require('jquery');
global.Backbone  = window.Backbone = require('backbone');
global._  = window._ = require('underscore');
window.ss = true;


// set up the globals
beforeEach(function() {
  this.stubs = [];
  this.clock = sinon.useFakeTimers();

  this.stub = function(obj, method) {
    var stub = sinon.stub(obj, method);
    this.stubs.push(stub);
    return stub;
  };
});

afterEach(function() {
  this.clock.restore();
  for (var i=0; i<this.stubs.length; i++) {
    this.stubs[i].restore();
  }
});

require('./base.js');
