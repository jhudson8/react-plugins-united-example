/** @jsx React.DOM */

module.exports = React.createClass({
  // "modelAsyncAware" will set state.loading=true if the model is currently performing any ajax activity
  // see https://github.com/jhudson8/react-backbone
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
