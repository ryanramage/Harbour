const Joi = require('joi-browser')

module.exports = {
  about: Joi.object().keys({
    autostart: Joi.boolean().description('init and then run start function on load'),
    tuningKnobs: Joi.number().description('how many knobs for external tuning')
  }),
  init: Joi.func().arity(4),
  start: Joi.func().arity(0),
  stop: Joi.func().arity(0)
}
