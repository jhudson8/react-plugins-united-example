/** @jsx React.DOM */

module.exports = React.createClass({
  mixins: ['modelAsyncAware'],

  render: function() {

    if (this.state.loading) {
      return <div className="fillout"><i className="huge loading icon"/></div>;
    } else {
      return this.props.children;
    }
  }
});
