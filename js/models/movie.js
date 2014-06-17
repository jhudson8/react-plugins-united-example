module.exports = Backbone.Model.extend({
  url: function() {
    return 'http://api.rottentomatoes.com/api/public/v1.0/movies/' + this.id + '.json?apikey=' + this.API_KEY + '&callback=?';
  },

  API_KEY: 'e8qmctfwccrxahz3s5fgvb7w'
});
