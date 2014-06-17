/** @jsx React.DOM */

var INDEX_MAP = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'],
    MAX = 7,
    BASE_WIDTH = 135,
    INCREMENT_WIDTH = 45,
    INCREMENT_MARGIN = 45,
    Tile = require('./tile');

module.exports = React.createClass({
  mixins: ['events', 'modelChangeAware'],
  events: {
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
          current = el.find('.current');
      if (current.data('index') == index) {
        // remove the current selection
        current.removeClass('current');
        items.removeClass('selected');

        this.trigger('deselected', movie);
      } else {
        el.find('.previous').removeClass('previous');
        el.find('.next').removeClass('next');
        current.removeClass('current');

        var prevLeft = ((index-1) * INCREMENT_MARGIN ) - 15;
        var nextLeft = ((index+1) * (INCREMENT_MARGIN)) + 15;
        if (index > 0) {
          $(items[index-1]).addClass('previous');
        }
        if (index < max - 1) {
          $(items[index+1]).addClass('next');
        }
        items.addClass('selected');
        $(items[index]).addClass('current').removeClass('selected');

        this.trigger('selected', movie);
      }
    }
  }
});
