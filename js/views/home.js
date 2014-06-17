/** @jsx React.DOM */

var Movies = require('../collections/movies');
var MovieTile = require('../components/movie-tile');
var Tile = require('../components/tile');

module.exports = React.createClass({
  getInitialState: function() {
    var openingSoon = new Movies(undefined, {type: 'opening'});
    var inTheatres = new Movies(undefined, {type: 'inTheatres'});
    var newDVD = new Movies(undefined, {type: 'newDVD'});
    openingSoon.fetch();
    inTheatres.fetch();
    newDVD.fetch();

    return {
      openingSoon: openingSoon,
      inTheatres: inTheatres,
      newDVD: newDVD
    };
  },

  render: function() {
    var state = this.state;
    var sections = [
      {id: 'inTheatres', title: 'In Theatres', icon: 'video', href: 'movies/in-theaters'},
      {id: 'openingSoon', title: 'Opening Soon', icon: 'calendar', href: 'movies/opening-soon'},
      {id: 'newDVD', title: 'New on DVD', icon: 'play sign', href: 'movies/new-dvd'}
    ];
    var movieTiles = _.map(sections, function(section) {
      var route = function() {
        Backbone.history.navigate(section.href, true);
      };
      return <div onClick={route}> <MovieTile model={state[section.id]} title={section.title} icon={section.icon}/> </div>;
    });

    return (
      <div>
        <div className="ui three column stackable grid segment-container">
          <div className="column eight wide pad-top">
            {movieTiles}
          </div>

          <div className="column eight wide pad-top">
            <Tile size="small" title="Your Music" icon="headphones">
              <i className="massive icon headphones"></i>
            </Tile>
            <Tile size="small" title="Your Books" icon="book">
              <i className="massive icon book"></i>
            </Tile>
          </div>
        </div>
      </div>
    );
  }
});
