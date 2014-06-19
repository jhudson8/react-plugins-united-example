/** @jsx React.DOM */



var MovieTile = require('../components/movie-tile'),
    MovieView = require('./movie-detail'),
    Loader = require('../components/loading-spinner'),
    ResponsiveContainer = require('../components/responsive-container');

// export a simple wrapper that will use different component implementations based on the device form factor
module.exports = React.createClass({
  render: function() {
    return new ResponsiveContainer(_.defaults({
      // class definitions are below
      standard: Standard,
      mobile: Mobile
    }, this.props));
  }
});


/**
 * Show a list of movies with a title.  When a movie is selected, display the specific movie content
 */
var Standard = React.createClass({
  // "events" mixin provides support for declarative events
  // see https://github.com/jhudson8/react-events
  // "modelAsyncAware" will set state.loading=true if the model is currently performing any ajax activity
  // see https://github.com/jhudson8/react-backbone
  mixins: ['events', 'modelAsyncAware'],

  // this is available because of the "events" mixin (https://github.com/jhudson8/react-events)
  events: {
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
          if (!collection.hadFetchError) {
            children.push('No movies were found');
          }
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


/**
 * Movie list page specific for a mobile device.
 */
var Mobile = React.createClass({
  mixins: ['modelAsyncAware'],

  render: function() {
    var collection = this.getModel(),
        children = collection.map(function(model) {
          return (
            <a className="link-item" href={'#movie/' + model.id}>
              <div className="movie-thumb">
                <img src={model.get('posters').thumbnail}/>
              </div>
              <div className="movie-description">
                {model.get('title')}
              </div>
            </a>
          );
        });
    return (
      <div>
        <h2>{this.props.title}</h2>
        <Loader model={collection}>
          <div className="mobile-movie-list">
            {children}
          </div>
        </Loader>
      </div>
    );
  }
});
