import { ZodFirstPartyTypeKind, ZodTypeDef } from 'zod'

import { DefParser, ZodDef } from './DefParser'
import { MongoSchema, MongoSchemaBool } from './MongoSchema'
import parseDateDef from './defParsers/parseDateDef'
import parseNullableDef from './defParsers/parseNullableDef'
import parseNumberDef from './defParsers/parseNumberDef'
import parseObjectDef from './defParsers/parseObjectDef'
import parseStringDef from './defParsers/parseStringDef'
import handleUnsupported from './handleUnsupported'

export default function parseDef(def: ZodTypeDef): MongoSchema | undefined {
  if (!isZodFirstPartyDef(def)) {
    handleUnsupported('Only first party zod types are supported.')
    return
  }

  const parse = parseFnByKind[def.typeName]
  if (!parse) {
    handleUnsupported(`'${def.typeName}' not supported.`)
    return
  }

  return parse(def as any)
}

function isZodFirstPartyDef(def: ZodTypeDef): def is ZodDef {
  return 'typeName' in def && (def.typeName as string) in ZodFirstPartyTypeKind
}

type ParserFnByKind = Partial<{
  [Key in ZodFirstPartyTypeKind]: DefParser<Extract<ZodDef, { typeName: Key }>>
}>

const parseFnByKind: ParserFnByKind = {
  [ZodFirstPartyTypeKind.ZodString]: parseStringDef,
  [ZodFirstPartyTypeKind.ZodNumber]: parseNumberDef,
  [ZodFirstPartyTypeKind.ZodObject]: parseObjectDef,
  [ZodFirstPartyTypeKind.ZodBoolean]: (): MongoSchemaBool => ({
    bsonType: 'bool',
  }),
  [ZodFirstPartyTypeKind.ZodDate]: parseDateDef,
  [ZodFirstPartyTypeKind.ZodNullable]: parseNullableDef,
}
