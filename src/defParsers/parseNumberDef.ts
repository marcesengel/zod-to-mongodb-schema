import { ZodNumberDef } from 'zod'

import { DefParser } from '../DefParser'
import { MongoSchema, MongoSchemaNumber } from '../MongoSchema'

const parseNumberDef: DefParser<ZodNumberDef> = (def): MongoSchemaNumber => {
  const mongoSchema: MongoSchemaNumber = {
    bsonType: 'double',
  }

  if (!def.checks) {
    return mongoSchema
  }

  for (const check of def.checks) {
    switch (check.kind) {
      case 'int':
        mongoSchema.bsonType = 'long'
        break

      case 'min': {
        if (check.inclusive) {
          mongoSchema.minimum = check.value
        } else {
          mongoSchema.exclusiveMinimum = check.value
        }

        break
      }

      case 'max': {
        if (check.inclusive) {
          mongoSchema.maximum = check.value
        } else {
          mongoSchema.exclusiveMaximum = check.value
        }

        break
      }

      case 'multipleOf':
        mongoSchema.multipleOf = check.value
        break

      case 'finite':
        mongoSchema.not = {
          enum: [-Infinity, Infinity],
        } as MongoSchema
        break
    }
  }

  return mongoSchema
}

export default parseNumberDef
