// js/views/app.js

  var app = app || {};

  // Create a callback which logs the current auth state
  // function authDataCallback(authData) {
  //   if (authData) {
  //     console.log("User " + authData.uid + " is logged in with " + authData.provider);
  //     this.listenTo(app.Todos, 'all', this.render);
  //   } else {
  //     console.log("User is logged out");
  //   }
  // }

  // // Register the callback to be fired every time auth state changes
  // var ref = new Firebase("https://blinding-torch-1635.firebaseio.com");
  // ref.onAuth(authDataCallback);

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  app.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: '#todoapp',

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template( $('#stats-template').html() ),

    // New
    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'keypress #new-todo': 'createOnEnter',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete',
      'click #login': 'authenticate',
      'click #login': function() {
        Backbone.history.loadUrl();
        return false;
      }
    },

    authenticate: function() {
    var ref = new Firebase("https://blinding-torch-1635.firebaseIO.com");
    ref.onAuth(this.authDataCallback);
    var authData = ref.getAuth();
    if (!authData) {
      ref.authWithOAuthRedirect("google", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          }
        });
      }
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      this.allCheckbox = this.$('#toggle-all')[0];
      this.$input = this.$('#new-todo');
      this.$footer = this.$('#footer');
      this.$main = this.$('#main');

      this.listenTo(app.Todos, 'add', this.addOne);
      this.listenTo(app.Todos, 'reset', this.addAll);
      this.listenTo(app.Todos, 'all', this.render);

      // New
      this.listenTo(app.Todos, 'change:completed', this.filterOne);
      this.listenTo(app.Todos,'filter', this.filterAll);

      // this.updateTodoList();
      // Register the callback to be fired every time auth state changes
      //var ref = new Firebase("https://blinding-torch-1635.firebaseio.com");

    },

  authDataCallback: function(authData) {
    if (authData) {
      console.log(authData.uid);
      // window.uid = authData.uid;
      this.render;
    } else {
      console.log("User is logged out");
    }
  },

  // updateTodoList: function(){
  //   // var ref = new Firebase("https://blinding-torch-1635.firebaseio.com");
  //   // var authData = ref.getAuth();

  //   //Add uid to firebase url
  //   firebaseUrl = "https://blinding-torch-1635.firebaseio.com/" + window.uid;

  //   //Fire a TodoList collection to get data from Firebase
  //   app.Todos = new TodoList([],{ url: "https://blinding-torch-1635.firebaseIO.com/" });

  // },

    // New
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var completed = app.Todos.completed().length;
      var remaining = app.Todos.remaining().length;

      if ( app.Todos.length ) {
        this.$main.show();
        this.$footer.show();

        this.$footer.html(this.statsTemplate({
          completed: completed,
          remaining: remaining
        }));

        this.$('#filters li a')
          .removeClass('selected')
          .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
          .addClass('selected');
      } else {
        this.$main.hide();
        this.$footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function( todo ) {
      var view = new app.TodoView({ model: todo });
      $('#todo-list').append( view.render().el );
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      this.$('#todo-list').html('');
      app.Todos.each(this.addOne, this);
    },

    // New
    filterOne : function (todo) {
      todo.trigger('visible');
    },

    // New
    filterAll : function () {
      app.Todos.each(this.filterOne, this);
    },


    // New
    // Generate the attributes for a new Todo item.
    newAttributes: function() {
      return {
        title: this.$input.val().trim(),
        order: app.Todos.nextOrder(),
        completed: false
      };
    },

    // New
    // If you hit return in the main input field, create new Todo model,
    // persisting it to localStorage.
    createOnEnter: function( event ) {
      if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
        return;
      }

      app.Todos.create( this.newAttributes() );
      this.$input.val('');
    },

    // New
    // Clear all completed todo items, destroying their models.
    clearCompleted: function() {
      _.invoke(app.Todos.completed(), 'destroy');
      return false;
    },

    // New
    toggleAllComplete: function() {
      var completed = this.allCheckbox.checked;

      app.Todos.each(function( todo ) {
        todo.save({
          'completed': completed
        });
      });
    }
  });
