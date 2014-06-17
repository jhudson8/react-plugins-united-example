/** @jsx React.DOM */

var MovieTile = require('../components/movie-tile'),
    MovieView = require('./movie-detail'),
    MobileMasterDetail = require('./mobile-movie-master-detail');

module.exports = React.createClass({
  mixins: ['events', 'modelAsyncAware'],
  events: {
    '*debounce(300):window:resize': 'forceUpdate',
    'ref:movies:selected': function(movie) {
      this.setState({selectedMovie: movie});
    },
    'ref:movies:deselected': function(movie) {
      this.setState({selectedMovie: undefined});
    },
  },

  getInitialState: function() {
    return {};
  },

  render: function() {
    var movie = this.state.selectedMovie,
        collection = this.getModel(),
        children = [];
    var windowWidth = $(window).width();
    if (windowWidth < 480) {
      return new MobileMasterDetail({model: collection, title: this.props.title});
    }

    if (movie) {
      children.push(
        <MovieView model={movie}/>
      );
    } else {
      children.push(<i className='massive video icon'></i>);
      if (!this.state.loading) {
        children.push(React.DOM.br(), React.DOM.br());
        if (collection.length) {
          children.push('Select a movie to see details');
        } else {
          children.push('No movies were found');
        }
      }
      children = [<p>{children}</p>];
    }

    var movieTile = new MovieTile({ref: 'movies', model: collection, style: {margin: 'auto'}, fullPage: true, interactive: true});
    return (
      <div className="movie-master-detail">
        <div className="body">
          <h2>{this.props.title}</h2>
          {children}
        </div>
        <div className="movie-tile-container">{movieTile}</div>
      </div>
    );
  }
});
