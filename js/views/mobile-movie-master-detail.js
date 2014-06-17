/** @jsx React.DOM */

var Loader = require('../components/loading-spinner');

module.exports = React.createClass({
  mixins: ['modelAware'],
  render: function() {
    var model = this.getModel();
    return (
      <div>
        <h2>{this.props.title}</h2>
        <Loader model={model}>
          <Children model={model}/>
        </Loader>
      </div>
    );
  }
});

var Children = React.createClass({
  mixins: ['events', 'modelAware'],
  render: function() {
    var collection = this.getModel();
    var children = collection.map(function(model) {
      return <div><div className="movie-thumb"><img src={model.get('posters').thumbnail}/></div><div className="movie-description">{model.get('title')}</div></div>
    });
    return (
      <div className="mobile-movie-list">
        {children}
      </div>
    );
  }
});
