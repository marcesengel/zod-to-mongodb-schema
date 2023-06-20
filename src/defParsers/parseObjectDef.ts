import { ZodObjectDef } from 'zod'

import { MongoSchemaObject } from '../MongoSchema'
import parseDef, { DefParser } from '../parseDef'

const parseObjectDef: DefParser<ZodObjectDef> = (def) => {
  const mongoSchema: MongoSchemaObject = {
    bsonType: 'object',
  }

  for (const [key, prop] of Object.entries(def.shape())) {
    const isOptional = prop.isOptional()
    const propSchema = parseDef(
      isOptional ? prop._def.innerSchema._def : prop._def,
    )
    if (propSchema) {
      if (!mongoSchema.properties) {
        mongoSchema.properties = {}
      }

      mongoSchema.properties[key] = propSchema

      if (!isOptional) {
        if (!mongoSchema.required) {
          mongoSchema.required = []
        }

        mongoSchema.required.push(key)
      }
    }
  }

  return mongoSchema
}

export default parseObjectDef
