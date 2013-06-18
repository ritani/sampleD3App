This is a sample of a D3 animation on a backbone client application with a node server. 

Please note that the data is fake.

## The Client

The client is a Backbone app with 2 views, the main app view and the D3 Animation view. There is one collection and one model to support data from the server. When the client loads, it will do a fetch(REST) of the data from the server. From there, it starts the router and upon it's initialization, the main view is created. Then the first route(and only - D3 Animation) is created and rendered in the main view. View events are used for controlling action from the user, such as clicking the play button or a circle.

The D3 Animation view has a collection of data objects. First it renders the scaffolding template. Then it renders a chart. Finally, it loads the data into d3 and renders the graph.

RequireJS is used for organizing the code. jQuery is used for DOM manipulation. Underscore is used as a general purpose library.

Bower is used to organize and install 3rd party vendor code.

### Limitations

* Template compilation is client side
* Stop will reset the year position back to the first year
* Flickering data table when clicking on the bubbles (needs styling to prevent)
* No listeners on the change of data

### Future Improvements

* Pre-compiled templates
* Use a font for icons (Font awesome perhaps).
* Style!
* Websockets for live update of the data
* Listen for data changes and update the chart accordingly
* Create a reusable Motion Chart widget with better integration, including putting more of the html creating in a template.


## The Server

The server serves static files and a has small REST API for retrieving data. The data is read from a JSON file. PushState is setup for the client, though this client only has one route.

### Future Improvements

* Use a database for the data
* Add routes for dealing with data (CRUD)
* Add websocket support.


## Getting it all to work

* Install xCode 4.x.x

* Install xCode Command Line Tools

* Install homebrew

* brew install node

* brew install npm

* sudo npm install -g bower 

* cd client

* bower install

* npm start




Copyright 2013 - Rashad Itani