/** @jsx React.DOM */

/**
 * Main entry point of the application.  This is where we set up the Backbone router and
 * do some global init and bindings
 */

// set a global timeout for all ajax activity
Backbone.async.on('async', function(eventName, model, events, options) {
  options.timeout = 3000;
});

var HomeView = require('./views/home');
var Movie = require('./models/movie');
var Movies = require('./collections/movies');
var MovieView = require('./views/movie-detail');
var MovieMasterDetail = require('./views/movie-master-detail');

// initialze the Backbone router
var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'home': 'home',
    'movies/:type': 'listMovies',
    'movie/:id': 'showMovie',
    'movie/:id/:title': 'showMovie',
    'search/movies/:term': 'searchMovies'
  },

  // show the home page
  home: function() {
    var view = new HomeView();
    showView(view);
  },

  // show details for a specific movie
  showMovie: function(id) {
    var movie = new Movie({id: id});
    movie.fetch();
    var view = new MovieView({model: movie});
    showView(view);
  },

  // search for movies by a specific search term
  searchMovies: function(searchTerm) {
    var collection = new Movies(undefined, {searchTerm: searchTerm}),
        view = new MovieMasterDetail({model: collection, title: 'Search: ' + searchTerm});
    collection.fetch();
    showView(view);
  },

  // list movies of a certain type.  type keywords are (opening|newDVD|inTheaters)
  listMovies: function(type) {
    var collection, title;
    if (type === 'opening-soon') {
      collection = new Movies(undefined, {type: 'opening'});
      title = 'Opening Soon';
    } else if (type === 'new-dvd') {
      collection = new Movies(undefined, {type: 'newDVD'});
      title = 'New on DVD';
    } else {
      collection = new Movies(undefined, {type: 'inTheaters'});
      title = 'In Theaters Now';
    }
    collection.fetch();
    var view = new MovieMasterDetail({model: collection, title: title});
    showView(view);
  }
});

// utility method to show a view as the main page
function showView(view) {
  var el = document.getElementById('page-container');
  React.unmountComponentAtNode(el);
  React.renderComponent(view, el);
}

// initialize when the document is ready
$(document).ready(function() {
  new Router();
  Backbone.history.start();

  // when the search term is entered, kick off the search routing
  $('#search-form').on('submit', function(event) {
    event.preventDefault();
    var term = $('#search-input').val();
    if (term) {
      Backbone.history.navigate('/search/movies/' + escape(term), true);
    }
  });
});
