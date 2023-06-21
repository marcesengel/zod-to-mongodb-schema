import { ZodDateDef } from 'zod'

import { DefParser } from '../DefParser'
import { MongoSchemaDate } from '../MongoSchema'
import handleUnsupported from '../handleUnsupported'

const parseDateDef: DefParser<ZodDateDef> = (def): MongoSchemaDate => {
  const mongoSchema: MongoSchemaDate = { bsonType: 'date' }
  for (const check of def.checks) {
    handleUnsupported(`Unsupported date check '${check.kind}'.`)
  }

  return mongoSchema
}

export default parseDateDef
