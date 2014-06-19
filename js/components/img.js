/** @jsx React.DOM */

/**
 * Image wrapper that will display a loading indicator until the image has been loaded.
 * 
 * This is a very abnormal component
 * because we want React to truly load a new component when the source changes and it won't alwyas do that because of
 * the virtual DOM dif strategy.  In this instance, we are performing initialization code in render so it happens correctly.
 * We use the state to keep us from doing init logic multiple times
 */
 module.exports = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var src = this.props.src;

    // React won't always get initial state here and we need to makek sure the image is loaded
    if (this.state.loaded === src) {
      return this.transferPropsTo(React.DOM.img());
    } else {
      if (this.state.loading !== src) {
        this.state.loading = src;
        var img = new Image();
        img.addEventListener('load', _.bind(function() {
          if (this.isMounted()) {
            this.setState({
              loaded: src,
              loading: false
            });
          } else if (this.state) {
            this.state.loaded = src;
            this.state.loading = false;
          }
        }, this));
        img.src = src; 
      }

      return (<div className="ui active large pad-top"><i className="huge icon loading"/><br/>Loading image...</div>);
    }
  }
 });
