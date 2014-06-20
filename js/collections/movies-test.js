var Movies = require('./movies');

describe('movies', function() {

  it('should load movies by search term', function() {
    var movie = new Movies(undefined, {searchTerm: 'foo'});
    expect(movie.url()).to.eql('http://api.rottentomatoes.com/api/public/v1.0/movies.json?&q=foo&apikey=e8qmctfwccrxahz3s5fgvb7w&page_limit=50&callback=?');
  });

  it('should load movies for "New DVDs"', function() {
    var movie = new Movies(undefined, {type: 'newDVD'});
    expect(movie.url()).to.eql('http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/new_releases.json?apikey=e8qmctfwccrxahz3s5fgvb7w&page_limit=50&callback=?');
  });

  it('should load movies for "In Theaters"', function() {
    var movie = new Movies(undefined, {type: 'inTheaters'});
    expect(movie.url()).to.eql('http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=e8qmctfwccrxahz3s5fgvb7w&page_limit=50&callback=?');
  });

  it('should load movies for "Opening Soon"', function() {
    var movie = new Movies(undefined, {type: 'opening'});
    expect(movie.url()).to.eql('http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?apikey=e8qmctfwccrxahz3s5fgvb7w&page_limit=50&callback=?');
  });
});
