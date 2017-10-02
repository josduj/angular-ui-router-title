angular-ui-router-title
=========================

AngularJS module for updating browser title/history based on the current ui-router state.

This is fork of [nonplus/angular-ui-router-title](https://github.com/nonplus/angular-ui-router-title) with modifications to make it work with ui-router 1.0+.


Motivation
----------

Using ui-router states with `url` configurations enables browser history support and bookmarking of application state.
It is important that the title in the browser history/bookmark represent the application state so that the user can tell
where she's navigating to.

The module sets the `document.title` to the value of the `$title` variable or, if configured, to the value returned by a `documentTitle(title)` callback.
The browser sets bookmark and browser history text based on the `document.title`.


Installing the Module
---------------------

In your page add:
```html
  <script src="angular-ui-router-title.js"></script>
```


Loading the Module
------------------

This module declares itself as `ui.router.title`, so it can be declared as a dependency of your application as normal:

```javascript
var app = angular.module('myApp', ['ng', 'ui.router.title']);
```


Specifying the $title in the state definition
---------------------------------------------

A state defines its title by declaring a `$title` value in its `resolve` block.
It's a good idea for the `$title` to include information from the current state,
so it may need to inject the `$stateParam` or another value that was resolved from them.

```javascript
$stateProvider
  .state('home', {
    ...
    resolve: {
      // Constant title
      $title: function() { return 'Home'; }
    }
  })
  .state('about', {
    url: '/about',
    ...
    resolve: {
      // Constant title
      $title: function() { return 'About'; }
    }
  })
  .state('contacts', {
    url: '/contacts',
    ...
    resolve: {
      // List of contacts
      contacts: ['Contacts', function(Contacts) {
        // Use Contacts service to retrieve list
        return Contacts.query();
      }],
      // Dynamic title showing number of contacts
      $title: ['contacts', function(contacts) {
        return 'Contacts (' + contacts.length + ')';
      }]
    }
  })
  .state('contact', {
    url: '/contact/:contactId',
    ...
    resolve: {
      // Single contact
      contact: ['Contacts', '$stateParams', function(Contacts, $stateParams) {
        // Use Contacts service to retrieve a contact
        return Contacts.get({ id: $stateParams.contactId });
      }],
      // Dynamic title showing the name of contact
      $title: ['contact', function(contact) {
        return contact.name;
      }]
    }
  })
  .state('contact.edit', {
    url: '/edit',
    ...
    resolve: {
      // Dynamic title appending to parent state's title
      $title: ['$title', function($title) {
        return $title + " (edit)";
      }]
    }
  })
```


Configuring a custom document.title
-----------------------------------

Customization of the `document.title` can be achieved via the `$titleProvier.documentTitle`
callback specification.

```javascript
angular.module('myApp', ['ng', 'ui.router.title'])
  .config(function($titleProvider) {
    $titleProvider.documentTitle(function(title) {
      return title ? title + " - My Application" : "My Application";
    });
  });
```


Using the $title in a header
----------------------------

The `$title` property contains the resolve title and can be used, for example, to set the contents of an `<h1>` tag.

```html
  <h1 ng-bind="($title || 'Home') + ' - My Application'">My Application</h1>
```


Copyright & License
-------------------

Copyright 2015 Stepan Riha. All Rights Reserved.

This may be redistributed under the MIT licence. For the full license terms, see the LICENSE file which
should be alongside this readme.
