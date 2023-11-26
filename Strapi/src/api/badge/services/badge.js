'use strict';

/**
 * badge service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::badge.badge');
