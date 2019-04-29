const Joi = require('joi-browser')

module.exports = {
  title: Joi.string().description('the title of the project'),
  artistId: Joi.string().description('the artistId who created this project'),
  viz: Joi.array().items(Joi.string())
}
