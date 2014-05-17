/** @jsx React.DOM */
$('#loader').hide();

(function() {
// These are the components we are using (see https://github.com/jhudson8/react-semantic-ui)
var Text = rsui.input.Text,
    TextArea = rsui.input.TextArea,
    Checkbox = rsui.input.Checkbox,
    Menu = rsui.layout.Menu,
    Button = rsui.form.Button,
    Table = rsui.layout.Table;

  var App = _.extend({
    Util: {}
  // allow "App" to be the global event bus
  }, Backbone.Events);

  // register App as an available React component event binding (see https://github.com/jhudson8/react-events)
  React.events.handle('app', {
    target: App
  });

  // create a mixin group that includes all mixins we'll use for our top level components (see https://github.com/jhudson8/react-mixin-manager)
  React.mixins.alias('view', 'events', 'modelChangeListener');


  /*****************
   ** UTILITY METHODS
   *****************/
  App.Util.formatDate = function(date) {
    if (!date) {
      return 'when I get around to it';
    }
    return App.Util.parseDate(date).from(moment());
  };

  App.Util.parseDate = function(date) {
    if (date === 'today') {
      return moment();
    } else if (date === 'tomorrow') {
      return moment().add('days', 1);
    } else {
      var day = moment(date, 'M/D', true);
      if (day.isValid()) {
        return day;
      }
    }
  };


  /*****************
   ** MODELS / COLLECTIONS
   *****************/
  var Task = Backbone.Model.extend({
    validate: function(attributes, options) {
      var rtn = [];
      if (!options || !options.allowEmpty) {
        if (!attributes.name) {
            rtn.push({name: 'Please enter the task name'});
        }
      }
      if (attributes.completeBy) {
        var date = App.Util.parseDate(attributes.completeBy);
        if (!date) {
          rtn.push({completeBy: 'Please enter a valid day'});
        } else if (date.isBefore(moment(), 'day')) {
          rtn.push({completeBy: 'Um, you can\'t complete something in the past'});
        }
      }
      if (rtn.length) {
        return rtn;
      }
    },

    isComplete: function() {
      return this.get('completed');
    }
  });

  var Tasks = Backbone.Collection.extend({
    model: Task,

    findIncomplete: function() {
      return this.filter(function(task) {
        return !task.get('completed');
      });
    }
  });


  /******************
   * Static variable references (this example does not have persistance)
   ******************/
      // all registered tasks
  var ALL_TASKS = new Tasks(),
      // all tasks that match the current search token
      FILTERED_TASKS = new Tasks(),
      // the current new tasks that is being edited (only to keep state if we switch tabs)
      NEW_TASK = new Task(),
      // the current search filter token
      searchFilter;

  // keep the filtered tasks in sync with the set of all availablel tasks
  function refreshFilteredTasks() {
    FILTERED_TASKS.reset(ALL_TASKS.filter(function(item) {
      return !searchFilter || item.get('name').indexOf(searchFilter) >= 0;
    }));
  }
  _.each(['add', 'remove', 'reset'], function(event) {
    ALL_TASKS.on(event, refreshFilteredTasks);
  });

  // listen for the search term update event and update the filtered set
  App.on('search', function(term) {
    searchFilter = term;
    refreshFilteredTasks();
  });


  /*****************
   ** COMPONENTS
   *****************/

  // the "Things to do" menul label that shows a dynamic task count flag
  var ToDoLabel = React.createClass({
    mixins: ['modelChangeListener'],
    render: function() {
      var rtn = ['Things to do']
          incomplete = this.props.model.findIncomplete();
      if (incomplete.length) {
        rtn.push(<div className="floating ui red label">{incomplete.length}</div>);
      }
      return <span>{rtn}</span>;
    }
  });

  // component used to create a new task
  var CreateTask = React.createClass({
    mixins: ['view'],
    render: function() {
      var model = this.props.model;
      return (
        <form className="ui form" onSubmit={this.onSubmit}>
          <Text label="Task" model={model} key="name" name="taskName"/>
          <TextArea label="Description" model={model} key="description"/>
          <Text label="Complete by" placeholder="today|tomorrow|mm/dd" model={model} key="completeBy"/>
          <div className="ui large buttons">
            <Button type="submit" className="positive">Save</Button>
            <div className="or"/>
            <Button type="button" onClick={this.onCancel}>Cancel</Button>
          </div>
        </form>
      );
    },
    componentDidMount: function() {
      $(this.getDOMNode()).find('input[name=taskName]').focus();
    },
    onCancel: function() {
      if (confirm('Are you sure you want to cancel?')) {
        this.trigger('cancel');
      }
    },
    onSubmit: function(event) {
      event.preventDefault();
      var model = this.props.model;
      if (model.isValid()) {
        // allow for decoupled task creation
        App.trigger('task:create', model);
      }
    }
  });

  // table cell that is bound to the associated model and will display with a strikethrough if the model is complete
  var CompleteCell = React.createClass({
    mixin: ['modelChangeListener'],
    render: function() {
      return <span className={this.props.model.isComplete() ? 'complete' : 'incomplete'}>{this.props.value}</span>
    }
  });
  function completedCellFactory(value, model) {
    return <CompleteCell model={model} value={value}/>
  }

  // list component that shows the available (filtered) tasks
  var TASK_COLUMNS = [
    {key: 'name', label: 'task', factory: completedCellFactory},
    {key: 'completeBy', label: 'to be finished', factory: completedCellFactory, formatter: App.Util.formatDate},
    {key: 'completed', label: 'complete?', factory: function(value, model) {
      return <Checkbox type="toggle" model={model} key="completed" label="Complete"/>
    }}
  ];
  var ShowTasks = React.createClass({
    mixins: ['view', 'modelChangeListener'],
    render: function() {
      if (FILTERED_TASKS.length) {
        // we've got some tasks to show
        return (
          <div>
            <Table cols={TASK_COLUMNS} entries={FILTERED_TASKS}/>
          </div>
        );
      } else {
        if (ALL_TASKS.length) {
          // no tasks to show because of the filter but there are some tasks
          return <div className="yellow ui message">There are no tasks to see here but you have some if you remove the search filter</div>;
        } else {
          return <div className="yellow ui message">Woohoo!  There is nothing to do here</div>;
        }
      }
    }
  });

  // Main app container with the header menu
  var menuItems = [
    {key: "list", label: <ToDoLabel model={ALL_TASKS}/>, icon: 'inbox'},
    {key: "create", label: "New item...", icon: 'add'}
  ];
  var AppContainer = React.createClass({
    mixins: ['view'],
    events: {
      'app:task:created': 'onTaskCreated',
      'ref:create:cancel': 'onCancel'
    },
    render: function() {
      var child,
          active = this.state && this.state.active || (ALL_TASKS.length ? 'list' : 'create');
      if (active === 'create') {
        child = new CreateTask({ref: 'create', model: NEW_TASK});
      } else {
        child = new ShowTasks({model: FILTERED_TASKS});
      }

      return (
        <div>
          <Menu ref="menu" active={active} items={menuItems} onChange={this.setActive} className="top attached segment">
            <div className="right menu">
              <div className="item">
                <div className="ui icon input">
                  <input type="text" ref="search" placeholder="Search..." onChange={this.onSearchChange}/>
                  <i className="search icon"></i>
                </div>
              </div>
            </div>
          </Menu>

          <div id="page-container" className="ui bottom attached segment">{child}</div>
        </div>
      );
    },
    onCancel: function() {
      // the task wasn't created but we still want to go to the list page
      this.onTaskCreated();
    },
    onTaskCreated: function() {
      this.setActive('list');
      this.refs.menu.setActive('list');
    },
    onSearchChange: function(e) {
      App.trigger('search', e.currentTarget.value);
    },
    setActive: function(data) {
      this.setState({active: data.key || data});
    }
  });

  /*****************
   ** ACTIONS
   *****************/
  function onCreateTask(task) {
    ALL_TASKS.add(task);
    task.set({id: _.uniqueId()});
    App.trigger('task:created', task);
    NEW_TASK = new Task();
  }

  function onDeleteTask(task) {
    ALL_TASKS.remove(task);
    App.trigger('task:deleted', task);
  }

  // App bindings
  App.on('task:create', onCreateTask);
  App.on('task:delete', onDeleteTask);


  // Now, to make it happen
  React.renderComponent(<AppContainer/>, document.getElementById('example'));
})();
