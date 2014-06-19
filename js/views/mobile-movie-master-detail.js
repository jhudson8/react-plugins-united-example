/** @jsx React.DOM */

/**
 * Movie list page specific for a mobile device.  Currently it is just a list and clicking on an item won't
 * do anything but that is intended to change in the future.
 */

var Loader = require('../components/loading-spinner');

module.exports = React.createClass({
  // "modelAware" exposes simple getModel/setModel methods to the component (models can be set using the "model" prop)
  // see https://github.com/jhudson8/react-backbone
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
  mixins: ['modelAware'],

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
