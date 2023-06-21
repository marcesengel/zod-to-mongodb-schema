import { ZodArrayDef } from 'zod'

import { DefParser } from '../DefParser'
import { MongoSchemaArray } from '../MongoSchema'
import parseDef from '../parseDef'

const parseArrayDef: DefParser<ZodArrayDef> = (def): MongoSchemaArray => {
  const mongoSchema: MongoSchemaArray = {
    bsonType: 'array',
    items: parseDef(def.type._def),
  }

  if (def.minLength) {
    mongoSchema.minItems = def.minLength.value
  }

  if (def.maxLength) {
    mongoSchema.maxItems = def.maxLength.value
  }

  return mongoSchema
}

export default parseArrayDef
