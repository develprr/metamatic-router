/*
The Metamatic Router
Author: Heikki Kupiainen / Metamatic.net
License: Apache 2.0
*/

import {broadcastEvent, connectToState, disconnectFromStores, getState, getStore, updateStore} from 'metamatic';

export const STORE_ROUTER = 'STORE_ROUTER';

const getBrowserPath = () => window.location.pathname;

const getViewPath = () => getBrowserPath().replace(getBasePath(), '');

const addPopStateListener = () => window.onpopstate = (event) => {
  const pushState = event.state;
  pushState && updateStore(STORE_ROUTER, pushState);
}

export const configureBaseRoute = (basePath) => updateStore(STORE_ROUTER, {
  basePath: basePath
});

export const broadcastCurrentUrl = () => broadcastEvent(STORE_ROUTER, getStore(STORE_ROUTER));

const getBasePath = () => getState(STORE_ROUTER, 'basePath') || '';

// Calling redirectTo will set a new browser URL and broadcast a URL change event.
export const redirectTo = (path) => {
  const browserPath = getBasePath() + path;
  const viewPath = path;
  const pushState = {
    browserPath: browserPath,
    viewPath: viewPath
  }
  window.history.pushState(pushState, '', browserPath);
  updateStore(STORE_ROUTER, pushState);
}

export const connectToRouter = (listener, callback) => {
  const browserPath = getBrowserPath();
  const viewPath = getViewPath();
  addPopStateListener();
  updateStore(STORE_ROUTER, {
    browserPath: browserPath,
    viewPath: viewPath
  });
  connectToState(listener, STORE_ROUTER, 'viewPath', callback);
}

export const disconnectFromRouter = (listener) => disconnectFromStores(listener);

export const matchRoute = (pattern, component) => getBrowserPath().match(pattern) && component;
