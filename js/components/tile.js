/** @jsx React.DOM */

/**
 * Reusable titled section for the home page
 */

var Loader = require('./loading-spinner');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var props = this.props,
        icon = props.icon,
        model = this.getModel();

    var headerChildren = [];
    if (icon) {
      headerChildren.push(<i className={'icon ' + icon}></i>);
    }
    if (props.title) {
      headerChildren.push(this.props.title);
    }

    var children = [];
    if (headerChildren.length) {
      children.push(<h3 className="header item">{headerChildren}</h3>);
    }
    children.push(
      <div className="body">
        <Loader model={model}>
          <div className="attached top">
            {this.props.children}
          </div>
        </Loader>
      </div>
    );

    return (
      <section className={'ui segment tile ' + (this.props.size || 'natural') + (' ' + this.props.className || '')}>
        {children}
      </section>
    );
  }
});
