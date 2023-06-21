import { ZodNullableDef } from 'zod'

import { DefParser } from '../DefParser'
import handleUnsupported from '../handleUnsupported'
import parseDef from '../parseDef'

const parseNullableDef: DefParser<ZodNullableDef> = (def) => {
  const nestedSchema = parseDef(def.innerType._def)
  if (!nestedSchema) {
    return
  }

  if ('bsonType' in nestedSchema) {
    // bsonType being an array implies [ x, 'null' ] due to typings
    if (Array.isArray(nestedSchema.bsonType)) {
      return nestedSchema
    }

    nestedSchema.bsonType = [nestedSchema.bsonType, 'null'] as any
  } /* else if ('anyOf' in nestedSchema && nestedSchema.anyOf) {
      nestedSchema.anyOf.push({ bsonType: 'null' })
    } else if ('oneOf' in nestedSchema && nestedSchema.oneOf) {
      nestedSchema.oneOf.push({ bsonType: 'null' })
    } else if ('enum' in nestedSchema && nestedSchema.enum) {
      nestedSchema.enum.push(null)
    } */ else {
    handleUnsupported(
      "Can't find correct place to apply ZodNullable to nested schema.",
    )
  }

  return nestedSchema
}

export default parseNullableDef
