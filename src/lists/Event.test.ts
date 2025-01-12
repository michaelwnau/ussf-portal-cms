import { KeystoneContext } from '@keystone-6/core/types'
import type { EventCreateInput } from '.keystone/types'

import { configTestEnv } from '../testHelpers'

describe('Event schema', () => {
  let adminContext: KeystoneContext
  let userContext: KeystoneContext
  let sudoContext: KeystoneContext

  let testEvent: EventCreateInput
  let testEventId: string

  const resetEvents = async () => {
    // Seed events
    const adminUser = await sudoContext.query.User.findOne({
      where: {
        userId: 'admin@example.com',
      },
      query: 'id',
    })

    testEvent = {
      operation: 'update',
      itemListKey: 'User',
      itemId: 'cl2jag6ia0821lya8ux05zgtp',
      inputData: '{"name": "Test User"}',
      resolvedData:
        '{"name": "Test User", "updatedBy": {"connect": {"id": "cl2jag6ia0820lya8eesp4xgd"}}}',
      changedData:
        '{"id": "cl2jag6ia0821lya8ux05zgtp", "name": "Test User", "syncedAt": "2022-04-28T17:36:59.118Z", "createdAt": "2022-04-28T17:36:59.118Z", "updatedAt": "2022-04-28T17:36:59.159Z", "updatedById": "cl2jag6ia0820lya8eesp4xgd"}',
      originalItem:
        '{"id": "cl2jag6ia0821lya8ux05zgtp", "name": "User 1", "userId": "user1@example.com", "isAdmin": false, "syncedAt": "2022-04-28T17:36:59.118Z", "createdAt": "2022-04-28T17:36:59.118Z", "isEnabled": true, "updatedAt": "2022-04-28T17:36:59.122Z", "createdById": null, "updatedById": null}',
      item: '{"id": "cl2jag6ia0821lya8ux05zgtp", "name": "Test User", "userId": "user1@example.com", "isAdmin": false, "syncedAt": "2022-04-28T17:36:59.118Z", "createdAt": "2022-04-28T17:36:59.118Z", "isEnabled": true, "updatedAt": "2022-04-28T17:36:59.159Z", "createdById": null, "updatedById": "cl2jag6ia0820lya8eesp4xgd"}',
      actor: {
        connect: {
          id: adminUser.id,
        },
      },
    }

    const createdEvent = await sudoContext.query.Event.createOne({
      data: testEvent,
      query: 'id',
    })

    testEventId = createdEvent.id
  }

  beforeAll(async () => {
    const context = await configTestEnv()
    adminContext = context.adminContext
    userContext = context.userContext
    sudoContext = context.sudoContext

    await resetEvents()
  })

  describe('as an admin user', () => {
    it('can view all events', async () => {
      const events = await adminContext.query.Event.findMany({
        query:
          'id operation itemListKey itemId item actor  { userId } inputData resolvedData changedData originalItem updatedAt createdAt',
      })

      expect(events).toHaveLength(1)

      expect(events[0]).toMatchObject({
        ...testEvent,
        actor: {
          userId: 'admin@example.com',
        },
      })
    })

    it('cannot create an event', async () => {
      expect(
        adminContext.query.Event.createOne({
          data: testEvent,
        })
      ).rejects.toThrow('Access denied: You cannot create that Event')
    })

    it('cannot modify an event', async () => {
      expect(
        adminContext.query.Event.updateOne({
          where: {
            id: testEventId,
          },
          data: {
            itemListKey: 'SomethingElse',
          },
        })
      ).rejects.toThrow(
        'Access denied: You cannot update that Event - it may not exist'
      )
    })

    it('cannot delete an event', async () => {
      expect(
        adminContext.query.Event.deleteOne({
          where: {
            id: testEventId,
          },
        })
      ).rejects.toThrow(
        'Access denied: You cannot delete that Event - it may not exist'
      )
    })
  })

  describe('as a non-admin user user', () => {
    it('cannot view any events', async () => {
      const data = await userContext.query.Event.findMany({
        query:
          'id operation itemListKey itemId item actor  { userId } inputData resolvedData changedData originalItem updatedAt createdAt',
      })

      expect(data).toHaveLength(0)
    })

    it('cannot create an event', async () => {
      expect(
        userContext.query.Event.createOne({
          data: testEvent,
        })
      ).rejects.toThrow('Access denied: You cannot create that Event')
    })

    it('cannot modify an event', async () => {
      expect(
        userContext.query.Event.updateOne({
          where: {
            id: testEventId,
          },
          data: {
            itemListKey: 'SomethingElse',
          },
        })
      ).rejects.toThrow(
        'Access denied: You cannot update that Event - it may not exist'
      )
    })

    it('cannot delete an event', async () => {
      expect(
        userContext.query.Event.deleteOne({
          where: {
            id: testEventId,
          },
        })
      ).rejects.toThrow(
        'Access denied: You cannot delete that Event - it may not exist'
      )
    })
  })
})
