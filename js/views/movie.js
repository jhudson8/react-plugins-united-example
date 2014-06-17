/** @jsx React.DOM */

module.exports = React.createClass({
  mixins: ['modelAsyncAware'],

  render: function() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    } else {
      var model = this.getModel();
      return (
        <div className="pad-all">
          <h2>{model.get('title')}</h2>
        </div>
      );
    }
  }
});
