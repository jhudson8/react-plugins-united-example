/** @jsx React.DOM */
$('#loader').hide();

(function() {

// These are the components we are using (see https://github.com/jhudson8/react-semantic-ui)
var Text = rsui.input.Text,
    TextArea = rsui.input.TextArea,
    Checkbox = rsui.input.Checkbox,
    Menu = rsui.layout.Menu,
    Button = rsui.form.Button,
    Table = rsui.layout.Table,
    Loader = rsui.layout.Loader;


  /////////////////////////////
  // BASE APPLICATION SETUP
  /////////////////////////////

  var App = _.extend({
    Util: {}
  // allow "App" to be the global event bus
  }, Backbone.Events);

  // register App as an available React component event binding (see https://github.com/jhudson8/react-events)
  React.events.handle('app', {
    target: App
  });

  // create a mixin group that includes all mixins we'll use for our top level components (see https://github.com/jhudson8/react-mixin-manager)
  React.mixins.alias('view', 'events');

  // allow App to listen to all model async events (see https://github.com/jhudson8/backbone-async-event)
  Backbone.asyncHandler = App;


  /////////////////////////////
  // FAKE OUT SOME SERVICE ENDPOINTS
  /////////////////////////////

  // (see https://github.com/jhudson8/backbone-async-event)
  var taskDataHelper = {
    get: function(callback) {
      return JSON.parse(localStorage.getItem('tasks') || '[]');
    },
    set: function(list) {
      localStorage.setItem('tasks', JSON.stringify(list || [])); 
    }
  };
  var responseHandlers = {
    'read:tasks': taskDataHelper.get,
    'create:task': function(model) {
      var id = _.uniqueId(),
          attr = model.attributes,
          current = taskDataHelper.get(),
          created = new Date().getTime(),
          tasks = taskDataHelper.get();

      model.set({id: created, created: created}, {silent: true});
      tasks.push(model.attributes);
      taskDataHelper.set(tasks);
      return tasks;
    },
    'update:task/.*': function(model) {
      var tasks = taskDataHelper.get().map(function(task) {
        if (task.id === model.id) {
          task.completed = model.attributes.completed;
        }
        return task;
      });
      taskDataHelper.set(tasks);
      return tasks;
    },
    'update:tasks': function(tasks) {
      var toSet = _.pluck(tasks.models, 'attributes');
      taskDataHelper.set(toSet);
    }
  };
  App.on('async', function(event, model, lifecycle, options) {
    var pathKey = event + ':' + _.result(model, 'url');
    // bypass the actual server call
    options.intercept = function() {
      var handler;
      _.each(responseHandlers, function(_handler, pattern) {
        var regex = new RegExp(pattern);
        if (!handler && pathKey.match(pattern)) {
          handler = _handler;
        }
      });
      if (!handler) {
        throw "unknown handler: " + pathKey;
      }
      var response = handler(model);
      // simulate some latency
      setTimeout(function() {
        options.success(response);
      }, 1000);
    };
  });


  /////////////////////////////
  // UTILITY METHODS
  /////////////////////////////

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


  /////////////////////////////
  // MODELS / COLLECTIONS
  /////////////////////////////

  /**
   * Single task model
   */
  var Task = Backbone.Model.extend({
    url: function() {
      return 'task' + (this.id ? ('/' + this.id) : '');
    },
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
    },

    findByQuery: function(query) {
      return this.filter(function(item) {
        return !query || item.get('name').indexOf(query) >= 0;
      });
    }
  });

  /**
   * Collection of tasks
   */
  var Tasks = Backbone.Collection.extend({
    url: 'tasks',
    model: Task,

    initialize: function() {
      // trigger change on the collection when models change
      var self = this;
      this.on('add', function(model) {
        model.on('change', function() {
          self.trigger('change', model);
          self.triggerIncomplete();
        });
        this.triggerIncomplete();
      }, this);
    },

    findIncomplete: function() {
      return this.filter(function(task) {
        return !task.get('completed');
      });
    },

    removeComplete: function() {
      this.reset(this.filter(function(model) {
        return !model.get('completed');
      }));
    },

    findFiltered: function(term) {
      return this.filter(function(task) {
        return !term || task.get('name').indexOf(term) >= 0;
      });
    },

    save: function() {
      this.sync('update', this);
      this.triggerIncomplete();
    },

    triggerIncomplete: function() {
      var incomplete = this.findIncomplete();
      App.incomplete = incomplete;
      App.trigger('incomplete:change', incomplete);
    }
  });
  Tasks.areAnyComplete = function(models) {
    return !!_.findWhere(_.pluck(models, 'attributes'), {completed: true});
  };


  /////////////////////////////
  // COMPONENTS
  /////////////////////////////

  /**
   * Overview page
   */
  var Overview = React.createClass({
    render: function() {
      return (
        <div>
          <h2>Another ToDo Example</h2>
          <p>
            This is an example to demonstrate <a href="http://facebook.github.io/react/">React</a> with a set of plugins that work very well together but can be used individually.
            <ul>
              <li><a href="https://github.com/jhudson8/react-mixin-manager">react-mixin-manager</a>: React mixin registration manager which allows mixins to have dependencies</li>
              <li><a href="https://github.com/jhudson8/react-events">react-events</a>: Declarative managed event bindings for react components</li>
              <li><a href="https://github.com/jhudson8/react-backbone">react-backbone</a>: <a href="http://backbonejs.org/">Backbone</a>-aware mixins for React </li>
              <li><a href="https://github.com/jhudson8/backbone-async-event">backbone-async-event</a>: Simple <a href="http://backbonejs.org/">Backbone</a>- plugin that emits specific events when ajax requests are made</li>
              <li><a href="https://github.com/jhudson8/react-semantic-ui">react-semantic-ui</a>: <a href="http://semantic-ui.com/">Semantic UI</a> React components</li>
            </ul>
          </p>

          <a target="source" href="https://github.com/jhudson8/react-plugins-united-example/blob/gh-pages/js/main.js">View source code</a>

          <p>
            <strong>Note:</strong>: a lag is simulated to demonstrate backbone model ajax event capturing (<a href="https://github.com/jhudson8/backbone-async-event">backbone-async-event</a>)
          </p>
        </div>
      );
    }
  });

  /**
   * the "Things to do" menul label that shows a dynamic task count flag
   */
  var ToDoLabel = React.createClass({
    mixins: ['modelChangeListener', 'events'],
    events: {
      'app:incomplete:change': 'onIncompleteChange'
    },
    render: function() {
      var rtn = ['Things to do'],
          incomplete = App.incomplete || [];
      if (incomplete.length) {
        rtn.push(<div className="floating ui red label">{incomplete.length}</div>);
      }
      return <span>{rtn}</span>;
    },
    onIncompleteChange: function() {
      this.forceUpdate();
    }
  });

  /**
   * create a new task component
   */
  var CreateTask = React.createClass({
    mixins: ['view', 'triggerWith', 'modelAsyncListener'],
    render: function() {
      var model = this.getModel();
      return (
        <form className="ui form" onSubmit={this.onSubmit}>
          <Text label="Task" model={model} key="name" name="taskName"/>
          <TextArea label="Description" model={model} key="description"/>
          <Text label="Complete by" placeholder="today|tomorrow|mm/dd" model={model} key="completeBy"/>
          <div className="ui large buttons">
            <Button type="submit" className="positive" loadOn="create" model={model}>Save</Button>
            <div className="or"/>
            <Button type="button" onClick={this.triggerWith('cancel')}>Cancel</Button>
          </div>
        </form>
      );
    },
    componentDidMount: function() {
      $(this.getDOMNode()).find('input[name=taskName]').focus();
    },
    onSubmit: function(event) {
      event.preventDefault();
      var model = this.getModel();
      if (model.isValid()) {
        // allow for decoupled task creation
        this.trigger('save', model);
      }
    }
  });

  /**
   * table cell that is bound to the associated model and will display with a strikethrough if the model is complete
   */
  var CompleteCell = React.createClass({
    mixins: ['modelChangeListener'],
    render: function() {
      return <span className={this.getModel().isComplete() ? 'complete' : 'incomplete'}>{this.props.value}</span>
    }
  });
  // and factory to quickly produce the CompleteCell
  function completedCellFactory(value, model) {
    return <CompleteCell model={model} value={value}/>
  }

  /**
   * list component that shows the available (filtered) tasks
   */
  var TASK_COLUMNS = [
    {key: 'name', label: 'task', factory: completedCellFactory},
    {key: 'completeBy', label: 'to be finished', factory: completedCellFactory, formatter: App.Util.formatDate},
    {key: 'completed', label: 'complete?', factory: function(value, model) {
      return <Checkbox type="toggle" model={model} key="completed" label="Complete?" onChange={function() {model.save();}}/>
    }}
  ];
  var ShowTasks = React.createClass({
    mixins: ['view', 'modelLoadOn', 'triggerWith'],
    events: {
      'app:search': 'doUpdate',
      'model:change': 'doUpdate'
    },
    render: function() {
      var rtn,
          tasks = this.getModel(),
          filteredTasks = tasks.findFiltered(App.searchTerm),
          anyComplete = Tasks.areAnyComplete(filteredTasks);
      if (filteredTasks.length) {
        // we've got some tasks to show
        var children = [<Table className="task-list" cols={TASK_COLUMNS} entries={filteredTasks}/>];
        if (anyComplete) {
          children.push(
            <Button className="circular negative tiny" icon="remove" onClick={this.triggerWith('remove-completed')}>Remove completed tasks</Button>
          );
        }
        rtn = <div>{children}</div>;
      } else {
        if (tasks.length) {
          // no tasks to show because of the filter but there are some tasks
          rtn = <div className="yellow ui message">There are no tasks to see here but you have some if you remove the search filter</div>;
        } else {
          rtn = <div className="yellow ui message">Woohoo!  There is nothing to do here</div>;
        }
      }

      return new Loader({loading: this.state && this.state.loading}, rtn);
    },
    doUpdate: function() {
      this.forceUpdate();
    }
  });

  /**
   * Main app container with the header menu
   */
  var menuItems = [
    {key: "overview", label: 'Overview', href: '#overview'},
    {key: "list", label: <ToDoLabel/>, icon: 'inbox', href: '#list'},
    {key: "create", label: "New item...", icon: 'add', href: '#create'}
  ];
  var AppContainer = React.createClass({
    mixins: ['view'],
    events: {
      'app:task:created': 'onTaskCreated',
      'ref:create:cancel': 'onCancel'
    },
    render: function() {
      return (
        <div>
          <Menu ref="menu" active={this.props.menuKey} items={menuItems} onChange={this.setActive} className="top attached segment">
            <div className="right menu">
              <div className="item">
                <div className="ui icon input">
                  <input type="text" ref="search" placeholder="Search..." onChange={this.onSearchChange}/>
                  <i className="search icon"></i>
                </div>
              </div>
            </div>
          </Menu>

          <div id="page-container" className="ui bottom attached segment">{this.props.children}</div>
        </div>
      );
    },
    onSearchChange: function(e) {
      App.trigger('search', e.currentTarget.value);
    }
  });


  /////////////////////////////
  // ROUTER
  /////////////////////////////

  var savedCreateTask;
  var Router = Backbone.Router.extend({
    routes: {
      '': 'overview',
      'overview': 'overview',
      'list': 'list',
      'create': 'create'
    },

    overview: function() {
      this.showView('overview', new Overview());
    },

    list: function() {
      var tasks = new Tasks();
      tasks.fetch();
      var view = new ShowTasks({model: tasks, loadOn: 'read', updateOn: ['reset', 'change'] });
      view.on('remove-completed', function() {
        tasks.removeComplete();
        tasks.save();
        this.list();
      }, this);
      this.showView('list', view);
    },

    create: function() {
      var task = savedCreateTask || new Task(),
          createTaskView = new CreateTask({model: task});
      createTaskView.on('save', function(task) {
        task.save({}, {
          success: function() {
            Backbone.history.navigate('list', true);
          }
        });
      });
      createTaskView.on('cancel', function() {
        if (confirm('are you sure you want to cancel?')) {
          savedCreateTask = undefined;
          Backbone.history.navigate('list', true);
        }
      });
      this.showView('create', createTaskView);
    },

    showView: function(menuKey, view) {
      var el = $('#example')[0];
      React.unmountComponentAtNode(el);

      // create the page container with the correct menu key
      var container = <AppContainer menuKey={menuKey}>{view}</AppContainer>;
      React.renderComponent(container, el);
    }
  });
  new Router();

  // listen for the search term update event and update the filtered set
  App.on('search', function(term) {
    App.searchTerm = term;
  });

  // Now, to make it happen
  $(document).ready(function() {
    Backbone.history.start();
    // load the tasks to see the menu item indicator
    new Tasks().fetch();
  });

})();
