react-plugins-united-example
============================

Example project to demonstrate several react and backbone plugins working together.

[View the example application](http://jhudson8.github.io/react-plugins-united-example/index.html)

This app uses [React](http://facebook.github.io/react/) and [Backbone](http://backbonejs.org/) as well as the plugins listed below with API integration to [Rotten Tomatoes](http://www.rottentomatoes.com/)


Plugins Demonstrated
============================

react-mixin-manager
------------
[https://github.com/jhudson8/react-mixin-manager]

React mixin registration manager which allows mixins to have dependencies

react-events
------------
[https://github.com/jhudson8/react-events]

Declarative managed event bindings for react components

react-backbone
------------
[https://github.com/jhudson8/react-backbone]

Backbone-aware mixins for React

backbone-async-event
------------
[https://github.com/jhudson8/backbone-async-event]

Simple Backbone plugin which introduces event based ajax request monitoring

gulp-web-modules
------------
[https://github.com/jhudson8/gulp-web-modules]

This not an application plugin but rather the build tool used to run a dev server and generate the deployable artifacts


From 0 to Install
===========================
```
npm install -g gulp
git clone git@github.com:jhudson8/react-plugins-united-example.git
cd react-plugins-united-example
npm install
bower install
gulp wr (or gulp watchrun)
```
browse to [http://localhost:8080](http://localhost:8080)
