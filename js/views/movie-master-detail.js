/** @jsx React.DOM */

/**
 * Show a list of movies with a title.  When a movie is selected, display the specific movie content
 */

var MovieTile = require('../components/movie-tile'),
    MovieView = require('./movie-detail'),
    MobileMasterDetail = require('./mobile-movie-master-detail');

module.exports = React.createClass({
  // "events" mixin provides support for declarative events
  // see https://github.com/jhudson8/react-events
  // "modelAsyncAware" will set state.loading=true if the model is currently performing any ajax activity
  // see https://github.com/jhudson8/react-backbone
  mixins: ['events', 'modelAsyncAware'],

  // this is available because of the "events" mixin (https://github.com/jhudson8/react-events)
  events: {
    // re-render the layout when the window resizes but only every 300 ms rather than on every resize event
    '*debounce(300):window:resize': 'forceUpdate',

    // listen for the "selected" event on the component identified by the ref prop value of "movies"
    'ref:movies:selected': function(movie) {
      this.setState({selectedMovie: movie});
    },

    // listen for the "deselected" event on the component identified by the ref prop value of "movies
    'ref:movies:deselected': function(movie) {
      this.setState({selectedMovie: undefined});
    },
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
