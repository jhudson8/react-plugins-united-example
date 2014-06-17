/** @jsx React.DOM */

Backbone.async.on('async', function(eventName, model, events, options) {
  options.timeout = 3000;
});

var HomeView = require('./views/home');
var Movie = require('./models/movie');
var Movies = require('./collections/movies');
var MovieView = require('./views/movie');
var MovieMasterDetail = require('./views/movie-master-detail');

var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'home': 'home',
    'movies/:type': 'listMovies',
    'movie/:id': 'showMovie',
    'movie/:id/:title': 'showMovie',
    'search/movies/:term': 'searchMovies'
  },

  home: function() {
    var view = new HomeView();
    showView(view);
  },

  showMovie: function(id) {
    var movie = new Movie({id: id});
    var view = new MovieView({model: movie});
    movie.fetch();
    showView(view);
  },

  searchMovies: function(searchTerm) {
    var collection = new Movies(undefined, {searchTerm: searchTerm}),
        view = new MovieMasterDetail({model: collection, title: 'Search: ' + searchTerm});
    collection.fetch();
    collection.on('reset', function() {
      console.log('REEST');
      console.log(collection);
    });
    showView(view);
  },

  listMovies: function(type) {
    var collection, title;
    if (type === 'opening-soon') {
      collection = new Movies(undefined, {type: 'opening'});
      title = 'Opening Soon';
    } else if (type === 'new-dvd') {
      collection = new Movies(undefined, {type: 'newDVD'});
      title = 'New on DVD';
    } else {
      collection = new Movies(undefined, {type: 'inTheatres'});
      title = 'In Theatres Now';
    }
    collection.fetch();
    var view = new MovieMasterDetail({model: collection, title: title});
    showView(view);
  }
});

function showView(view) {
  var el = document.getElementById('page-container');
  React.unmountComponentAtNode(el);
  React.renderComponent(view, el);
}

$(document).ready(function() {
  new Router();
  Backbone.history.start();

  $('#search-form').on('submit', function(event) {
    event.preventDefault();
    var term = $('#search-input').val();
    if (term) {
      Backbone.history.navigate('/search/movies/' + escape(term), true);
    }
  });
});
