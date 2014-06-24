 var gulp = require('gulp'),
        gwm = require('gulp-web-modules'),
        gwmLib = require('gwm-lib'),
        gwmIf = require('gwm-if'),
        uglify = require('gwm-uglify');

gwm({
  browserify: {
    transform: ['reactify']
  },

  plugins: [
    gwmLib({
      base: [
        {dev: 'underscore.js', prod: 'underscore.min.js', includeIf: '!window.ss'},
        {dev: 'bower:jquery', prod: 'bower:jquery/dist/jquery.min.js', includeIf: '!window.ss'},
        {dev: 'backbone.js', prod: 'backbone.min.js', includeIf: '!window.ss'},
        {dev: 'semantic.js', prod: 'semantic.min.js'},
        {dev: 'react.js', prod: 'react.min.js'},
        {dev: 'bower:/backbone-async-event/backbone-async-event.js', prod: 'bower:/backbone-async-event/backbone-async-event.min.js'},
        {dev: 'bower:react-mixin-manager/react-mixin-manager.js', prod: 'bower:react-mixin-manager/react-mixin-manager.min.js'},
        {dev: 'bower:/react-events/react-events.js', prod: 'bower:/react-events/react-events.min.js'},
        {dev: 'bower:/react-backbone/react-backbone.js', prod: 'bower:/react-backbone/react-backbone.min.js'}
      ]
    }),
    gwmIf(uglify(), 'prod')
  ]
}).injectTasks(gulp);
