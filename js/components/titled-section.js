module.exports = React.createClass({
  render: function() {
    return (
      <section className="ui">
        <h3 className="header item">{this.props.title}</h3>
        <div className="attached top">
          {this.props.children}
        </div>
      </section>
    );
  }
});
