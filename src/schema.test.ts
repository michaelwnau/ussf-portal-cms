import { setupTestRunner } from '@keystone-6/core/testing'
import { config } from '@keystone-6/core'

import { lists } from './schema'

describe('Keystone schema', () => {
  const testConfig = config({
    db: { provider: 'sqlite', url: 'file:./test-cms.db' },
    lists,
  })

  const runner = setupTestRunner({ config: testConfig })

  describe('Users', () => {
    it('can create a user', () => {
      runner(async ({ context }) => {
        const user = await context.query.User.createOne({
          data: {
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'testuserpassword',
          },
          query: 'id name email',
        })

        expect(user).toMatchObject({
          id: expect.any(String),
          name: 'Test User',
          email: 'testuser@example.com',
        })
      })
    })
  })
})
