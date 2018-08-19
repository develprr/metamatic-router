/*
  The Metamatic Framework
  Author: Heikki Kupiainen
  License: Apache 2.0
 */

let actionArray = [];
let actionMap = {};
let componentIdCounter = 0;
let actionIdCounter = 0;

const createActionId = (listenerId, eventId) => listenerId + '-' + eventId;

const createAction = (actionId, listenerId, eventId, handler) => ({
  id: actionId,
  listenerId: listenerId,
  eventId: eventId,
  handler: handler
});

const equalActions = (action1, action2) => action1.id === action2.id;

const addAction = (action) => actionArray.push(action);

const getComponentId = (component) => {
  if (component._metamaticId) {
    return component._metamaticId;
  }
  component._metamaticId = generateComponentId();
  return component._metamaticId;
};

const getListenerId = (component) => component.constructor.name === 'String' ? component : getComponentId(component);

const generateComponentId = () => {
  componentIdCounter += 1;
  return componentIdCounter.toString();
};

const generateActionId = () => {
  actionIdCounter += 1;
  return "DEFAULT-" + actionIdCounter;
};

const clone = (object) => {
  try {
    return JSON.parse(JSON.stringify(object));
  } catch (e) {
    return object;
  }
};

const removeAction = (action) => actionArray = actionArray.filter((actionInArray) => actionInArray.id !== action.id);

const replaceAction = (action) => {
  removeAction(action);
  addAction(action);
}


const addNewAction = (actionId, listenerId, eventId, handler) => replaceAction(createAction(actionId, listenerId, eventId, handler));

const containsActionListenerAndEvent = (action, listenerId, eventId) => action.listenerId === listenerId && action.eventId === eventId;

const containsActionListener = (action, listenerId) => action.listenerId === listenerId;

const removeActionsByListenerAndEvent = (listenerId, eventId) => actionArray = actionArray.filter((action) =>
    !containsActionListenerAndEvent(action, listenerId, eventId));


const removeActionsByListener = (listenerId) => actionArray = actionArray.filter((action) => !containsActionListener(action, listenerId));

const mapAction = (action) => {
    const eventId = action.eventId;
    const eventArray = getActionsByEvent(eventId);
    eventArray.push(action);
    actionMap[eventId] = eventArray;
}

const buildActionMap = () => {
  actionMap = {};
  actionArray.map(mapAction);
}

const getActionsByEvent = (eventId) =>  actionMap[eventId] || [];

/*
 Bind listeners to events using handle function:

 handle('SOME-EVENT', (value) => {
    console.log(value);
    ...
 })
 */
export const handle = (eventId, handler) => {
  addNewAction(generateActionId(), 'DEFAULT', eventId, handler);
  buildActionMap();
}

/*
  WHen you want to kill an event, meaning that you don't want any handler to listen for it any more, call unhandle function:

  unhandle('SOME-EVENT');

 */

export const unhandle = (eventId) => {
  removeActionsByListenerAndEvent('DEFAULT', eventId);
  buildActionMap();
}

/*
  Register a component to MetaStore with connect function. This is similar to handle but it should be used to register such components
  as listeners that have a limited lifetime such as React components. You can unregister later listeners that have been added with connect function.

  When connection a React component, preferably call connect function already in the component's constructor.
  Example of connecting single instance React component:

  connect(this, CAR_INFO_CHANGE, (newCarInfo) => this.setState({carInfo: newCarInfo});

 */
export const connect = (componentOrListenerId, eventId, handler) => {
  const listenerId = getListenerId(componentOrListenerId);
  const actionId = createActionId(listenerId, eventId);
  addNewAction(actionId, listenerId, eventId, handler);
  buildActionMap();
}

/*
  If you want to connect a component to listen more than one event from MetaStore, you can use connectAll function instead of repeating many times connect
  call:

  connectAll(this, {
    LOGIN_STATE_CHANGE: (loggedIn) => this.setState({loggedIn}),
    CAR_MODEL_SELECTION_CHANGE: (selectedCarModel) => this.setState({selectedCarModel})
   });
*/


export const connectAll = (componentOrListenerId, handlerMap) => {
  const listenerId = getListenerId(componentOrListenerId);
  Object.keys(handlerMap).map((eventId) => {
    let handler = handlerMap[eventId];
    const actionId = createActionId(listenerId, eventId);
    addNewAction(actionId, listenerId, eventId, handler);
  });
  buildActionMap();
};


/*
  When you have connected a React component to MetaStore, it is important to disconnect the component from MetaStore upon unmounting it.
  It's not allowed to set state of an unmounted component. I f you don't disconnect a React component from MetaStore upon unmounting, the listener
  function won't die along with the compnent and it will erratically try to set state of a "dead" component, which will cause an error.

  Disconnecting a component from MetaStore upon unmounting:

  disconnect(this);

 */

export const disconnect = (componentOrId) => {
  removeActionsByListener(getListenerId(componentOrId));
  buildActionMap();
}

/*
  Dispatch metamatic events everywhere in your app. Pass an eventId and a passenger object to the dispatcher. The event id must be a string
  and the passenger object to be passed alongside the event can be any kind of object or primary type:

  dispatch('SOME-EVENT', anyObject);

  Or if you have defined the event in a constant:

  dispatch('SOME-EVENT', anyObject);
 */
export const dispatch = (eventId, passenger) => getActionsByEvent(eventId).map((action) => action.handler(clone(passenger)));

/*
  Clear all events and listeners with reset function. Mainly needed only for tests and debugging
 */
export const reset = () => {
  actionArray = [];
  actionMap = {};
  componentIdCounter = 0;
  actionIdCounter = 0;
};

/*
  get clone of event dictionary . Mainly needed only for debugging by author
 */
export const getActions = () => [...actionArray];
