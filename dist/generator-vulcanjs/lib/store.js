'use strict';

var Redux = require('redux');
var logger = require('redux-node-logger');
var reducers = require('./reducers');
var filter = require('./filters').filter;
var common = require('./common');

var store = {};

function init(savedState) {
  if (process.env.VULCANJS_SEE_REDUX_LOGS) {
    store = Redux.createStore(reducers, savedState, Redux.applyMiddleware(logger()));
  } else {
    store = Redux.createStore(reducers, savedState);
  }
  return store;
}

function is(checkType) {
  function vulcan() {
    return !!store.getState().isVulcan;
  }

  function packageExists(packageName) {
    var filteredPackageName = filter('packageName', packageName);
    return !!store.getState().packages[filteredPackageName];
  }

  function modelExists(packageName, modelName) {
    var filteredModelName = filter('modelName', modelName);
    return packageExists(packageName) && !!store.getState().packages[packageName].models[filteredModelName];
  }

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  switch (checkType) {
    case 'packageExists':
      return packageExists.apply(undefined, args);
    case 'modelExists':
      return modelExists.apply(undefined, args);
    case 'vulcan':
      return vulcan.apply(undefined, args);
    default:
      return undefined;
  }
}

function get(checkType) {
  function reactExtension() {
    return store.getState().reactExtension;
  }

  function packageNames() {
    var packages = store.getState().packages;
    var packageNamesToGet = Object.keys(packages);
    return packageNamesToGet.sort(common.alphabeticalSort);
  }

  function getPackage(packageName) {
    return store.getState().packages[packageName];
  }

  function modelNames(packageName) {
    var thePackage = getPackage(packageName);
    var models = is('packageExists', packageName) ? thePackage.models : {};
    var modelNamesToGet = Object.keys(models);
    return modelNamesToGet.sort(common.alphabeticalSort);
  }

  function packageNamesWithNumModels() {
    var packageNamesList = packageNames();
    var packageNamesWithModels = packageNamesList.map(function (packageName) {
      return {
        name: packageName,
        numModels: modelNames(packageName).length
      };
    });
    return packageNamesWithModels;
  }

  function storyBookSetupStatus() {
    return store.getState().storyBook.setupStatus;
  }

  function routeNames(packageName) {
    var thePackage = getPackage(packageName);
    var theRoutes = thePackage.routes;
    var routeNamesToGet = Object.keys(theRoutes);
    return routeNamesToGet.sort(common.alphabeticalSort);
  }

  function getRoutes(packageName) {
    var thePackage = getPackage(packageName);
    var theRoutes = thePackage.routes;
    return routeNames(packageName).map(function (routeName) {
      return {
        name: routeName,
        content: theRoutes[routeName]
      };
    });
  }

  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  switch (checkType) {
    case 'reactExtension':
      return reactExtension.apply(undefined, args);
    case 'packageNames':
      return packageNames.apply(undefined, args);
    case 'modelNames':
      return modelNames.apply(undefined, args);
    case 'routeNames':
      return routeNames.apply(undefined, args);
    case 'package':
      return getPackage.apply(undefined, args);
    case 'routes':
      return getRoutes.apply(undefined, args);
    case 'storyBookSetupStatus':
      return storyBookSetupStatus.apply(undefined, args);
    case 'packageNamesWithNumModels':
      return packageNamesWithNumModels.apply(undefined, args);
    default:
      return undefined;
  }
}

function num(checkType) {
  function routes(packageName) {
    var routeNames = get('routeNames', packageName);
    return routeNames.length;
  }

  function models(packageName) {
    var modelNames = get('modelNames', packageName);
    return modelNames.length;
  }

  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  switch (checkType) {
    case 'routes':
      return routes.apply(undefined, args);
    case 'models':
      return models.apply(undefined, args);
    default:
      return undefined;
  }
}

function has(checkType) {
  function nonZeroPackages() {
    var packageNames = get('packageNames');
    return Object.keys(packageNames).length > 0;
  }

  function nonZeroModelsInPackage(packageName) {
    if (!this._isPackageExists(packageName)) return false;
    var thePackage = this._getPackage(packageName);
    var modelNames = Object.keys(thePackage.models);
    return modelNames.length > 0;
  }

  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  switch (checkType) {
    case 'nonZeroModelsInPackage':
      return nonZeroModelsInPackage.apply(undefined, args);
    case 'nonZeroPackages':
      return nonZeroPackages.apply(undefined, args);
    default:
      return undefined;
  }
}

module.exports = {
  init: init,
  is: is,
  has: has,
  get: get,
  num: num
};
