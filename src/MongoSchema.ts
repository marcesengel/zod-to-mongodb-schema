export type MongoSchemaBase<TType extends BsonType, TValue = never> = {
  bsonType: TType
  title?: string
  description?: string
  allOf?: MongoSchema[]
  anyOf?: MongoSchema[]
  enum?: TValue[]
  not?: MongoSchema
  oneOf?: MongoSchema[]
}

export type MongoSchemaNumber = MongoSchemaBase<
  'double' | 'int' | 'long' | 'decimal',
  number
> & {
  minimum?: number
  exclusiveMinimum?: number
  maximum?: number
  exclusiveMaximum?: number
  multipleOf?: number
}

export type MongoSchemaString = MongoSchemaBase<'string', string> & {
  minLength?: number
  maxLength?: number
  pattern?: RegExp
}

export type MongoSchemaObject = MongoSchemaBase<'object'> & {
  /** Defaults to `true` */
  additionalProperties?: boolean | MongoSchema
  dependencies?: Record<string, string[]>
  minProperties?: number
  maxProperties?: number
  patternProperties?: Record<string, MongoSchema>
  properties?: Record<string, MongoSchema>
  required?: string[]
}

export type MongoSchemaArray = MongoSchemaBase<'array'> & {
  additionalItems?: boolean | MongoSchema
  items?: MongoSchema | MongoSchema[]
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
}

export type MongoSchemaDate = MongoSchemaBase<'date'>
export type MongoSchemaObjectId = MongoSchemaBase<'objectId'>
export type MongoSchemaBool = MongoSchemaBase<'bool', boolean>

// do this Pick to cascade renaming of bsonType if need be
export type MongoSchemaNull = Pick<MongoSchemaBase<'null'>, 'bsonType'>

export type MongoSchemaAbstract = Omit<MongoSchemaBase<BsonType>, 'bsonType'>

export type MongoSchema =
  | MongoSchemaNumber
  | MongoSchemaString
  | MongoSchemaObject
  | MongoSchemaArray
  | MongoSchemaDate
  | MongoSchemaObjectId
  | MongoSchemaBool
  | MongoSchemaNull
  | MongoSchemaAbstract

// see https://www.mongodb.com/docs/manual/reference/operator/query/type/#std-label-document-type-available-types
export type BsonType =
  | 'double'
  | 'int'
  | 'long'
  | 'decimal'
  | 'string'
  | 'object'
  | 'array'
  | 'binData'
  | 'objectId'
  | 'bool'
  | 'date'
  | 'null'
  | 'regex'
  | 'javascript'
  | 'timestamp'
