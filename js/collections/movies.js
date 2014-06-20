/**
 * Collection used to retrieve a set of movies
 */

var Movie = require('../models/movie');

module.exports = Backbone.Collection.extend({
  model: Movie,

  initialize: function(models, options) {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    _.defaults(this, options);
  },

  url: function() {
    var url = 'http://api.rottentomatoes.com/api/public/v1.0/';
    if (this.searchTerm) {
      url += 'movies.json?' + '&q=' + escape(this.searchTerm) + '&';
    } else {
      var type = this.type;
      if (type === 'opening') {
        url += 'lists/movies/opening.json?';
      } else if (type === 'inTheaters') {
        url += 'lists/movies/in_theaters.json?';
      } else if (type === 'newDVD') {
        url += 'lists/dvds/new_releases.json?';
      }
    }
    url += 'apikey=' + Movie.prototype.API_KEY + '&page_limit=50&callback=?';
    return url;
  },

  parse: function(data) {
    this.total = data.total;
    return data.movies;
  }
});
