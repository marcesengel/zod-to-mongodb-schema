import { ZodFirstPartySchemaTypes } from 'zod'

import type { MongoSchema } from './MongoSchema'

export type ZodDef = ZodFirstPartySchemaTypes['_def']
export type DefParser<T extends ZodDef> = (def: T) => MongoSchema | undefined
