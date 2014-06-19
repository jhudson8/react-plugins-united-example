/** @jsx React.DOM */

/**
 * Show a list of movies by displaying the cover art.  If the "interactive" prop is set,
 * add the "selected" class to the selected movie and "sibling-of-selected" to all other movies and
 * trigger the "selected" event with the movie model as the parameter.  If the movie is clicked again
 * trigger the "deselected" event with the movie model as the parameter.
 */

var MAX = 7,
    BASE_WIDTH = 135,
    INCREMENT_WIDTH = 45,
    INCREMENT_MARGIN = 45,
    Tile = require('./tile');

module.exports = React.createClass({
  // "events" mixin provides support for declarative events
  // see https://github.com/jhudson8/react-events
  // "modelChangeAware" mixins listen for change events on the associated model and re-renders the component
  mixins: ['events', 'modelChangeAware'],

  // this is available because of the "events" mixin (https://github.com/jhudson8/react-events)
  events: {
    // re-render the layout when the window resizes but only every 300 ms rather than on every resize event
    '*debounce(300):window:resize': 'forceUpdate'
  },

  render: function() {
    var props = this.props, children = [], collection = this.getModel(), movie, title, onClick;
    var windowWidth = $(window).width();
    var offset = 0,
        containerMax = props.fullPage ? (windowWidth / INCREMENT_MARGIN - 5) : windowWidth < 480 ? 4 : MAX,
        max = Math.min(collection.length, containerMax);

    for (var i=0; i < max; i++) {
      movie = collection.at(i);
      title = movie.get('title');
      onClick = this.props.interactive ? _.bind(this.onClick(movie, i, offset, max), this) : undefined;

      children.push(<img data-index={i} style={{left: offset + 'px'}} src={movie.get('posters').detailed} alt={title} onClick={onClick}/>);
      offset += INCREMENT_MARGIN;
    }

    var width = BASE_WIDTH + ((max - 1) * INCREMENT_WIDTH);
    return (
      <Tile size="small" style={this.props.style} className="spotlight" title={props.title} icon={props.icon} model={collection}>
        <div style={{width: width}} className='ui image-lib'>
          {children}
        </div>
      </Tile>
    );
  },

  onClick: function(movie, index, offset, max) {
    return function() {
      var el = $(this.getDOMNode()),
          items = el.find('img'),
          current = el.find('.selected');
      if (current.data('index') == index) {
        // remove the current selection
        current.removeClass('selected');
        items.removeClass('sibling-of-selected');
        this.trigger('deselected', movie);
      } else {
        // select another
        current.removeClass('selected');
        items.addClass('sibling-of-selected');
        $(items[index]).addClass('selected').removeClass('sibling-of-selected');
        this.trigger('selected', movie);
      }
    }
  }
});
