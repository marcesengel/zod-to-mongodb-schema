import {
  ZodFirstPartySchemaTypes,
  ZodFirstPartyTypeKind,
  ZodTypeDef,
} from 'zod'

import { MongoSchema } from './MongoSchema'
import parseNumberDef from './defParsers/parseNumberDef'
import parseStringDef from './defParsers/parseStringDef'
import handleUnsupported from './handleUnsupported'

type ZodDef = ZodFirstPartySchemaTypes['_def']

export default function parseDef(def: ZodTypeDef) {
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

export type DefParser<T extends ZodDef> = (def: T) => MongoSchema

type ParserFnByKind = Partial<{
  [Key in ZodFirstPartyTypeKind]: DefParser<Extract<ZodDef, { typeName: Key }>>
}>

const parseFnByKind: ParserFnByKind = {
  [ZodFirstPartyTypeKind.ZodString]: parseStringDef,
  [ZodFirstPartyTypeKind.ZodNumber]: parseNumberDef,
}
