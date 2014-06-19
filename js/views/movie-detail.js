/** @jsx React.DOM */

/**
 * Show the details of a specific movie.
 */

var Loader = require('../components/loading-spinner'),
    Img = require('../components/img');

module.exports = React.createClass({
  // "modelAware" exposes simple getModel/setModel methods to the component (models can be set using the "model" prop)
  // see https://github.com/jhudson8/react-backbone
  mixins: ['modelAware'],

  render: function() {
    var model = this.getModel();
    return (
      <Loader model={model}>
        <Body model={model}/>
      </Loader>
    );
  }
});

var Body = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var movie = this.getModel();
    console.log(movie);

    return (
      <div className="movie-detail two column stackable ui grid">
        <div className="column eleven wide">
          <div className="ui segment">
              <h2>{movie.get('title')}</h2>
              <div className="synopsis">{movie.get('synopsis')}</div>

              <Section title="Review">{movie.get('critics_consensus')}</Section>

              <Section title="Cast">{_.map(movie.get('abridged_cast'), function(member) {return member.name;}).join(', ')}</Section>
            </div>
        </div>
        <div className="column five wide">
          <div className="ui segment center">
            <Img src={movie.get('posters').original} alt={movie.get('title')} className="ui image"/>
          </div>
        </div>
      </div>
    );
  }
});


var Section = React.createClass({
  render: function() {
    return (
      <section>
        <h3>{this.props.title}</h3>
        {this.props.children}
      </section>
    );
  }
});
