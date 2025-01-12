import { KeystoneContext } from '@keystone-6/core/types'

import { configTestEnv, testUsers } from '../testHelpers'

describe('User schema', () => {
  let adminContext: KeystoneContext
  let userContext: KeystoneContext

  // Set up test environment, seed data, and return contexts
  beforeAll(async () => ({ adminContext, userContext } = await configTestEnv()))

  describe('as an admin user', () => {
    it('can view all users', async () => {
      const data = await adminContext.query.User.findMany({
        query: 'id name role userId isAdmin isEnabled',
      })

      expect(data).toHaveLength(4)
      testUsers.forEach((user) => {
        expect(data).toContainEqual({
          id: expect.any(String),
          ...user,
        })
      })
    })

    it('can update itself', async () => {
      const data = await adminContext.query.User.updateOne({
        where: { userId: 'admin@example.com' },
        data: {
          name: 'Admin New Name',
        },
        query: 'id name role userId isAdmin isEnabled',
      })

      expect(data).toMatchObject({
        id: expect.any(String),
        ...testUsers[0],
        name: 'Admin New Name',
      })
    })

    it('can update other users', async () => {
      let data = await adminContext.query.User.updateOne({
        where: { userId: 'user1@example.com' },
        data: {
          name: 'Test User 1 New Name',
          role: 'Author',
          isEnabled: false,
        },
        query: 'id name role userId isAdmin isEnabled',
      })

      expect(data).toMatchObject({
        id: expect.any(String),
        ...testUsers[1],
        name: 'Test User 1 New Name',
        role: 'Author',
        isEnabled: false,
      })

      data = await adminContext.query.User.updateOne({
        where: { userId: 'user1@example.com' },
        data: {
          name: 'User 1',
          role: 'User',
          isEnabled: true,
          userId: 'updated',
        },
        query: 'id name role userId isAdmin isEnabled',
      })

      expect(data).toMatchObject({
        id: expect.any(String),
        ...testUsers[1],
        name: 'User 1',
        role: 'User',
        isEnabled: true,
        userId: 'updated',
      })

      // Change userId back so we can use it in other tests
      data = await adminContext.query.User.updateOne({
        where: { userId: 'updated' },
        data: {
          name: 'User 1',
          role: 'User',
          isEnabled: true,
          userId: 'user1@example.com',
        },
        query: 'id name role userId isAdmin isEnabled',
      })

      expect(data).toMatchObject({
        id: expect.any(String),
        ...testUsers[1],
        name: 'User 1',
        role: 'User',
        isEnabled: true,
        userId: 'user1@example.com',
      })
    })

    it('cannot update the isAdmin field', async () => {
      expect(
        adminContext.query.User.updateOne({
          where: { userId: 'user1@example.com' },
          data: {
            isAdmin: true,
          },
          query: 'id name role userId isAdmin isEnabled',
        })
      ).rejects.toThrow(
        'Access denied: You cannot update that User - you cannot update the fields ["isAdmin"]'
      )
    })

    it('cannot delete users', async () => {
      expect(
        adminContext.query.User.deleteOne({
          where: {
            userId: 'user1@example.com',
          },
        })
      ).rejects.toThrow(
        'Access denied: You cannot delete that User - it may not exist'
      )
    })

    it('can create users', async () => {
      const data = await adminContext.query.User.createOne({
        data: {
          name: 'Created By Admin',
          userId: 'createdByAdmin',
          isAdmin: false,
          isEnabled: true,
        },
        query: 'id name role userId isAdmin isEnabled',
      })

      expect(data).toMatchObject({
        id: expect.any(String),
        name: 'Created By Admin',
        userId: 'createdByAdmin',
        isAdmin: false,
        isEnabled: true,
      })
    })
  })

  describe('as a non admin user', () => {
    it('can only view themselves', async () => {
      const data = await userContext.query.User.findMany({
        query: 'id name role userId isAdmin isEnabled',
      })

      expect(data).toHaveLength(1)
      expect(data[0]).toMatchObject({
        id: expect.any(String),
        ...testUsers[1],
      })
    })

    it('cannot query other users', async () => {
      const data = await userContext.query.User.findOne({
        where: { userId: 'admin@example.com' },
        query: 'id name role userId isAdmin',
      })

      expect(data).toBe(null)
    })

    it('can update itself', async () => {
      let data = await userContext.query.User.updateOne({
        where: { userId: 'user1@example.com' },
        data: {
          name: 'User 1 New Name',
        },
        query: 'id name role userId isAdmin isEnabled',
      })

      expect(data).toMatchObject({
        id: expect.any(String),
        ...testUsers[1],
        name: 'User 1 New Name',
      })

      data = await userContext.query.User.updateOne({
        where: { userId: 'user1@example.com' },
        data: {
          name: 'User 1',
        },
        query: 'id name role userId isAdmin isEnabled',
      })

      expect(data).toMatchObject({
        id: expect.any(String),
        ...testUsers[1],
        name: 'User 1',
      })
    })

    it('cannot update other users', async () => {
      expect(
        userContext.query.User.updateOne({
          where: { userId: 'admin@example.com' },
          data: {
            name: 'Admin User New Name',
          },
          query: 'id name role userId isAdmin isEnabled',
        })
      ).rejects.toThrow(
        'Access denied: You cannot update that User - it may not exist'
      )
    })

    it('cannot update the role field', async () => {
      expect(
        userContext.query.User.updateOne({
          where: { userId: 'user1@example.com' },
          data: {
            role: 'Manager',
          },
          query: 'id name role userId isAdmin isEnabled',
        })
      ).rejects.toThrow(
        'Access denied: You cannot update that User - you cannot update the fields ["role"]'
      )
    })

    it('cannot update the userId field', async () => {
      expect(
        userContext.query.User.updateOne({
          where: { userId: 'user1@example.com' },
          data: {
            userId: 'testUser1',
          },
          query: 'id name userId isAdmin isEnabled',
        })
      ).rejects.toThrow(
        'Access denied: You cannot update that User - you cannot update the fields ["userId"]'
      )
    })

    it('cannot update the isAdmin field', async () => {
      expect(
        userContext.query.User.updateOne({
          where: { userId: 'user1@example.com' },
          data: {
            isAdmin: true,
          },
          query: 'id name userId isAdmin isEnabled',
        })
      ).rejects.toThrow(
        'Access denied: You cannot update that User - you cannot update the fields ["isAdmin"]'
      )
    })

    it('cannot update the isEnabled field', async () => {
      expect(
        userContext.query.User.updateOne({
          where: { userId: 'user1@example.com' },
          data: {
            isEnabled: true,
          },
          query: 'id name userId isAdmin isEnabled',
        })
      ).rejects.toThrow(
        'Access denied: You cannot update that User - you cannot update the fields ["isEnabled"]'
      )
    })

    it('cannot create users', async () => {
      expect(
        userContext.query.User.createOne({
          data: {
            name: 'Test User 2',
            userId: 'testUser2',
            isAdmin: false,
            isEnabled: true,
          },
        })
      ).rejects.toThrow('Access denied: You cannot create that User')
    })

    it('cannot delete users', async () => {
      expect(
        userContext.query.User.deleteOne({
          where: {
            userId: 'user1@example.com',
          },
        })
      ).rejects.toThrow(
        'Access denied: You cannot delete that User - it may not exist'
      )
    })
  })
})
