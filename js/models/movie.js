/**
 * Simiple model contining movie details
 */

module.exports = Backbone.Model.extend({
  url: function() {
    return 'http://api.rottentomatoes.com/api/public/v1.0/movies/' + this.id + '.json?apikey=' + this.API_KEY + '&callback=?';
  },

  // don't be a jerk.  I put this out to help others see how to use the react plugins with react in something more than a todo app
  API_KEY: 'e8qmctfwccrxahz3s5fgvb7w'
});
