/*
The Metamatic Router
Author: Heikki Kupiainen / Metamatic.net
License: Apache 2.0
*/

import {updateStore} from '@metamatic.net/metamatic-core';
import {connectToState} from '../index';

export const STORE_ROUTER = 'STORE_ROUTER';

export const configureBaseRoute = (basePath) => updateStore(STORE_ROUTER, {
  basePath: basePath
});

export const broadcastCurrentUrl = () => broadcastEvent(STORE_ROUTER, getStore(STORE_ROUTER));

const getBasePath = () => getState(STORE_ROUTER, 'basePath') || '';

// Calling redirectTo will set a new browser URL and broadcast a URL change event.
export const redirectTo = (path) => {
  const browserPath = getBasePath() + path;
  const viewPath =  path;
  window.history.pushState({}, '', browserPath);
  updateStore(STORE_ROUTER, {
    browserPath: browserPath,
    viewPath: viewPath
  });
}

export const connectToRouter = (listener, callback) => {
  const browserPath = getBrowserPath();
  const viewPath = getViewPath();
  updateStore(STORE_ROUTER, {
    browserPath: browserPath,
    viewPath: viewPath
  });
  connectToState(listener, STORE_ROUTER, 'viewPath', callback);
}

const getBrowserPath = () => window.location.pathname;

const getViewPath = () => getBrowserPath().replace(getBasePath(), '');

export const matchRoute = (pattern, component) => getBrowserPath().match(pattern) && component;


