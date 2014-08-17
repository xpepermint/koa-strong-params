'use strict';

/**
 * Module dependencies.
 */

let _ = require('lodash');

/**
 * Returns cloned object with extends functionality.
 *
 * @param {object}
 * @return {object}
 * @api private
 */

function strongify(o) {

  /**
   * Cloning object.
   */

  var params = _.clone(o);

  /**
   * Returns all object data.
   *
   * @return {object}
   * @api public
   */

  params.all = function() {
    return params = _.omit(params, ['all', 'only', 'except', 'require', 'merge']);
  }

  /**
   * Returns only listed object keys.
   *
   * @return {object}
   * @api public
   */

  params.only = function() {
    return params = _.pick(params, _.flatten(arguments));
  }

  /**
   * Returns all object keys except those listed.
   *
   * @return {object}
   * @api public
   */

  params.except = function() {
    params = _.omit(params, _.flatten(arguments));
    return params = params.all(params);
  }

  /**
   * Returns a sub-object or throws an error if the requested key does not
   * exist. This is usefull when working with nested data (e.g. user[name]).
   *
   * @return {object}
   * @api public
   */

  params.require = function(key) {
    if (Object.keys(params).indexOf(key) == -1) throw new Error('param `'+key+'` required');
    if (typeof params[key] != 'object') throw new Error('param `'+key+'` is not an object');
    return params = strongify(params[key]);
  }

  /**
   * Returns params with merged data.
   *
   * @return {object}
   * @api public
   */

  params.merge = function(data) {
    return params = _.merge(params, data);
  }

  /**
   * Return object.
   */

  return params;
}

/**
 * Koa middleware for strong params.
 *
 * @return {generator}
 * @api public
 */

module.exports = function() {
  return function *(next) {

    /**
     * Params data.
     */

    let _params;

    /**
     * Params `getter` and `setter`.
     */

    Object.defineProperty(this, 'params', {

      /**
       * Returns an extended data object of merged context params.
       *
       * @return {object}
       * @api public
       */

      get: function() {
        return _.clone(_params);
      },

      /**
       * Replaces the default params data.
       *
       * @param {object}
       * @api public
       */

      set: function(o) {
        _params = strongify(o);
      }
    });

    /*
     * Populating params.
     *
     * NOTE: Use the `koa-qs` module to enable nested query string objects. To
     * enable body params, which are usually received over `post` or `put`
     * method, use `koa-bodyparser` middleware.
     */

    this.params = _.merge({}, this.request.body, this.query);

    /*
     * Next middleware.
     */

    yield next;
  };
};
