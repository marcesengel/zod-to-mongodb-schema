import { ZodTypeAny } from 'zod'

import { MongoSchema } from './MongoSchema'
import { Options, clearOptions, setOptions } from './options'

export default function zodToMongoDbSchema(
  zodSchema: ZodTypeAny,
  options: Options,
): MongoSchema {
  // don't want to pass around the options object
  setOptions(options)

  try {
    return {
      bsonType: 'string',
    }
  } finally {
    clearOptions()
  }
}
