/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { seedRevokeUsers, seedGrantUsers } = require('../database/seed')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    async 'db:seed:revokeusers'() {
      try {
        await seedRevokeUsers()
        console.log('Database seeded with users whose access should be revoked')
      } catch (e) {
        console.log(e)
      }
      return null
    },
    async 'db:seed:grantusers'() {
      try {
        await seedGrantUsers()
        console.log('Database seeded with users whose access should be granted')
      } catch (e) {
        console.log(e)
      }
      return null
    },
  })
}