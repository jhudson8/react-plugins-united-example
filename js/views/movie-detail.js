/** @jsx React.DOM */

/**
 * Show the details of a specific movie.
 */

var Loader = require('../components/loading-spinner');

module.exports = React.createClass({
  // "modelAware" exposes simple getModel/setModel methods to the component (models can be set using the "model" prop)
  // see https://github.com/jhudson8/react-backbone
  mixins: ['modelAware'],

  render: function() {
    var props = this.props,
        movie = this.getModel();

    return (
      <Loader model={movie}>
        <div className="movie-details">
          <table><tr>
            <td className="poster">
              <img src={movie.get('posters').detailed} alt={movie.get('title')} className="poster"/>
            </td>
            <td className="body">
              <h2>{movie.get('title')}</h2>
              <div className="synopsis">{movie.get('synopsis')}</div>

              <Section title="Review">{movie.get('critics_consensus')}</Section>

              <Section title="Cast">{_.map(movie.get('abridged_cast'), function(member) {return member.name;}).join(', ')}</Section>
            </td>
          </tr></table>
        </div>
      </Loader>
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
