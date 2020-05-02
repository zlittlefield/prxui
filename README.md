# PRX UI

This is a repo for a common UI for the PRACSYS group at Rutgers University. The UI is built using React, React-Bootstrap for formatting, Three.js, and websockets with the C++ side.

## Preliminaries

Your system needs to have `yarn` installed. Yarn is a dependency management system for web-based projects. This repo has all of the versioned dependencies defined for it, we just need to download them locally once. 
```
cd ui/
yarn install
```
At this point, you should have everything downloaded locally that you need. Think of this like downloading all the needed source files to run locally. 

## Starting UI

After running `yarn install` in the `ui` directory, you should be able to launch the UI with an empty scene. We do this with the `yarn start` command.

```
cd ui/
yarn start
```

This should automatically open up a tab in your browser listening on the correct port to see the web-based UI. What you should see is an empty scene with axes showing the coordinate system on top of a ground plane. At this point, the UI is waiting to receive messages for what geometries to visualize, and where to put them. You can rotate the camera by pressing the `right mouse button` and dragging. You can translate the camera by pressing the `left mouse button` and dragging. `Mouse wheel` zooms in and out. On the left, you should see a panel of buttons for sending play and pause commands to your client program, and buttons for recording video of the graphics canvas.  

## Communicating Geometries

At this point, any program that can use the Websocket protocol can communicate with the UI. In this repo, an example using C++ has been provided in `ws_client_test`.

```
prx
└── helpers
    ├── BUILD
    ├── exec
    │   └── ws_client_test.cc
    ├── json.hh
    ├── ws_client.cc
    └── ws_client.hh
```

The messages are created using the [JSON for Modern C++](https://github.com/nlohmann/json) and then the [Easywsclient](https://github.com/dhbaird/easywsclient) is the Websocket implementation used to actually send the messages. At a high level, the `ws_client_test` works as follows:

1. Provides a set of example functions on how to create different geometry types. 
2. In main, starts by creating a geometry message setting up the geometries in the scene.
3. Creates a websocket, along with corresponding callback functions for sending and receiving data. 
4. Sets up a loop that listens to see if position updates should be paused, otherwise, determines new poses messages that should be sent out. 

The geometry message format is as follows:

```
{
    "geometries": [
	    {
	        "type": "box",
	        "name": "box1",
	        "color": "blue",
	        "dims": [ 1, 1, 1 ]
	    },
	    {
	        "type": "sphere",
	        "name": "ball1",
	        "color": "red",
	        "radius": 0.5
	    },
	    {
	        "type": "cylinder",
	        "name": "cylinder1",
	        "color": "green",
	        "height": 2.0,
	        "radius": 0.5
	    } ],
    "poses": [
	    {
	        "name": "box1",
	        "orientation": [ 0.0, 0.0, 0.0, 1.0 ],
	        "position": [ 0.0, 0.0, 4.0 ]
	    },
	    {
	        "name": "ball1",
	        "orientation": [ 0.0, 0.0, 0.0, 1.0 ],
	        "position": [ 5.0, 0.0, 0.04 ]
	    },
	    {
	        "name": "cylinder1",
	        "orientation": [ 0.0, 0.0, 0.0, 1.0 ],
	        "position": [ 10.0, 0.0, 4.0 ]
	    } ]
}
```

Currently, two high level objects can be sent to the UI. First, is `geometries`. This is where the intrinsic parameters of the objects are defined. The type of object (`box, sphere, cylinder, line`), the object name (must be unique), the color (named color or hexadecimal value string) and the parameters specific to that geometry. These are parameters that are not needed to change over time, but color has been tested to be able to change by sending a new message with the same object name with the updated color. 

The second attribute is `poses`. This is a list consisting of the name of the object, and the position and orientation of that object. The orientation is a quaternion representation (x,y,z,w ordering). 

A message containing these attributes is then serialized into a bson object and sent to the UI, which then deserializes the message and creates all the necessary components. 
