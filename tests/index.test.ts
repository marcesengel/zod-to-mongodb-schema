import { z } from 'zod'

import zodToMongoSchema, { Options } from '../src'

import testCaseGroups from './testCases'

describe('zod-to-mongodb-schema', () => {
  const zodObjectId = z.custom()
  const options: Options = {
    zodObjectId,
    onUnsupported: 'error',
  }

  for (const { name, testCases } of testCaseGroups) {
    describe(name, () => {
      for (const [name, schema, expected] of testCases) {
        it(name, () => {
          const mongoSchema = zodToMongoSchema(schema, options)

          if (Array.isArray(expected)) {
            if (Array.isArray(expected[0])) {
              for (const [path, value] of expected) {
                expect(mongoSchema).toHaveProperty(path, value)
              }
            } else {
              const [path, value] = expected
              expect(mongoSchema).toHaveProperty(path, value)
            }
          } else {
            expect(mongoSchema).toStrictEqual(expected)
          }
        })
      }
    })
  }
})
