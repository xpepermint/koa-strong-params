/**
 * Module dependencies.
 */

var _ = require('lodash')

/**
 * Returns cloned object with extends functionality.
 *
 * @param {object}
 * @return {object}
 * @api private
 */

var strongify = function (o) {

  /**
   * Cloning object.
   */

  var params = _.clone(o)

  /**
   * Returns all object data.
   *
   * @return {object}
   * @api public
   */

  params.all = function () {
    params = _.omit(params, ['all', 'permit', 'only', 'except', 'require', 'merge'])
    return params
  }

  /**
   * Returns only listed object keys.
   *
   * @return {object}
   * @api public
   */

  params.permit = params.only = function () {
    params = _.pick(params, _.flatten(arguments))
    return params
  }

  /**
   * Returns all object keys except those listed.
   *
   * @return {object}
   * @api public
   */

  params.except = function () {
    params = _.omit(params, _.flatten(arguments))
    params = params.all(params)
    return params
  }

  /**
   * Returns a sub-object or throws an error if the requested key does not
   * exist. This is usefull when working with nested data (e.g. user[name]).
   *
   * @return {object}
   * @api public
   */

  params.require = function (key) {
    if (Object.keys(params).indexOf(key) === -1) throw new Error('param `' + key + '` required')
    if (typeof params[key] !== 'object') throw new Error('param `' + key + '` is not an object')
    params = strongify(params[key])
    return params
  }

  /**
   * Returns params with merged data.
   *
   * @return {object}
   * @api public
   */

  params.merge = function (data) {
    params = _.merge(params, data)
    return params
  }

  /**
   * Return object.
   */

  return params
}

module.exports = strongify
