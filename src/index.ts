import { ZodTypeAny } from 'zod'

import { MongoSchema } from './MongoSchema'

export default function zodToMongoDbSchema(zodSchema: ZodTypeAny): MongoSchema {
  return {
    bsonType: 'string',
  }
}
