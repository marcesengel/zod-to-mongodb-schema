import { ZodTypeAny } from 'zod'

type MongoSchema = { bsonType: 'string' }

export default function zodToMongoDbSchema(zodSchema: ZodTypeAny): MongoSchema {
  return {
    bsonType: 'string',
  }
}
