var _ = require('lodash')
var strongify = require('../strongify')

/**
 * Koa middleware for strong params.
 *
 * @return {generator}
 * @api public
 */

module.exports = function () {
  return function *(next) {

    /**
     * Params data.
     */

    var _params

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

      get: function () {
        return _.clone(_params)
      },

      /**
       * Replaces the default params data.
       *
       * @param {object}
       * @api public
       */

      set: function (o) {
        _params = strongify(o)
      }
    })

    /*
     * Populating params.
     *
     * NOTE: Use the `koa-qs` module to enable nested query string objects. To
     * enable body params, which are usually received over `post` or `put`
     * method, use `koa-bodyparser` middleware.
     */

    this.params = _.merge({}, this.request.body, this.query)

    /*
     * Next middleware.
     */

    yield next
  }
}
