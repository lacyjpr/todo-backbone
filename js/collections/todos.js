// js/collections/todos.js

  var app = app || {};

  // Todo Collection
  // ---------------

  // Get the uid of the user so we can save data on a per user basis
    var ref = new Firebase("https://blinding-torch-1635.firebaseio.com");
    var authData = ref.getAuth();

    if (authData) {
      var uid = authData.uid;
      console.log("uid " + uid);
      app.Todos = new Firebase("https://blinding-torch-1635.firebaseIO.com/" + uid);
    } else {
      console.log("uid " + undefined);
    }


  // The collection of todos is backed by firebase instead of localstorage
  var TodoList = Backbone.Firebase.Collection.extend({

    // Reference to this collection's model.
    model: app.Todo,

    // Save all of the todos to firebase
    url: "https://blinding-torch-1635.firebaseIO.com/" + uid,

    // Filter down the list of all todo items that are finished.
    completed: function() {
      return this.filter(function( todo ) {
        return todo.get('completed');
      });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply( this, this.completed() );
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if ( !this.length ) {
        return 1;
      }
      return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: function( todo ) {
      return todo.get('order');
    }
  });


  // Create our global collection of **Todos**.
  app.Todos = new TodoList();
