'use strict';

/**
 * answer router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::answer.answer');
