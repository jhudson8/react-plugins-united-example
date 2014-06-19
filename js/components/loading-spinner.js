/** @jsx React.DOM */

/**
 * If the bound Model/Collection is currently performing an ajax request (fetch), show the loading spinner
 * instead of the nested content
 */

module.exports = React.createClass({
  // "modelAsyncAware" will set state.loading=true if the model is currently performing any ajax activity
  // see https://github.com/jhudson8/react-backbone
  mixins: ['modelAsyncAware'],

  render: function() {
    if (this.state.loading) {
      return <div className="ui segment loading"><i className="huge loading icon"/></div>;
    } else {
      return this.props.children;
    }
  }
});
