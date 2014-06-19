/**
 * Simple container that will render a different component the layout is a mobile device vs. a desktop pc
 */

 module.exports = React.createClass({
  // "events" mixin provides support for declarative events
  // see https://github.com/jhudson8/react-events
  mixins: ['events'],

  events: {
    // re-render the layout when the window resizes but only every 300 ms rather than on every resize event
    '*debounce(300):window:resize': 'forceUpdate'
  },

  render: function() {
    var windowWidth = $(window).width(),
        windowHeight = $(window).height();
    if (windowWidth < 767 || windowHeight <= 480) {
      // assume mobile
      return new (this.props.mobile || this.mobile)(this.props);
    } else {
      // assume non-mobile
      return new (this.props.standard || this.standard)(this.props);
    }
  }
 });
