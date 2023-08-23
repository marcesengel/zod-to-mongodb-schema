import { type ZodEnumDef } from 'zod'

import { type DefParser } from '../DefParser'
import { type MongoSchema } from '../MongoSchema'

const parseEnumDef: DefParser<ZodEnumDef> = (def): MongoSchema => {
  return {
    bsonType: 'string',
    enum: def.values,
  }
}

export default parseEnumDef
