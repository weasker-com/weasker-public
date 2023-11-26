'use strict';

/**
 * interview service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::interview.interview');
