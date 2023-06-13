import { ZodTypeAny } from 'zod'

import { MongoSchema } from './MongoSchema'
import { Options, clearOptions, setOptions } from './options'
import parseDef from './parseDef'

export default function zodToMongoDbSchema(
  zodSchema: ZodTypeAny,
  options: Options,
): MongoSchema {
  // don't want to pass around the options object
  setOptions(options)

  try {
    const mongoSchema = parseDef(zodSchema._def)
    if (!mongoSchema) {
      throw new Error('Root type not supported.')
    }

    return mongoSchema
  } finally {
    clearOptions()
  }
}

export type { Options } from './options'
