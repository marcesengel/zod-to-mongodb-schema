# Zod to MongoDB schema

Converts [Zod schemas](https://zod.dev/) to [MongoDB validation schemas](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema).
Inspired by [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema),
but became a separate package as the overlap between what MongoDB uses and Draft 7
was deemed to little.

## Usage

```ts
import { z } from 'zod'
import zodToMongoSchema from 'zod-to-mongodb-schema'
import { ObjectId } from 'wherever' // bson, mongodb, mongoose...

// should also check for typeof value, as isValid also accepts for example numbers
const zodObjectId = z.custom<ObjectId | string>(value => ObjectId.isValid(value))

const userSchema = z.object({
  _id: zodObjectId,
  name: z.string().min(3),
  dateOfBirth: z.date(),
})

const mongoUserSchema = zodToMongoSchema(userSchema, { zodObjectId })
```

with `mongoUserSchema` being
```json
// TODO: insert result
```

## Options

| Name | Required | Type | Description |
| ---- | -------- | ---- | ----------- |
| `zodObjectId` | Yes | `ZodAnyType` | The zod schema you use to validate object ids (for example `z.custom<ObjectId | string>(value => ...)`). This is used to detect ObjectIds in your schema by doing a strict equality check (`===`). |
| `onUnsupported` | No (default: `'warn'`) | `'error'` or `'warn'` or `'no-op'` | How to handle unsupported validations (see below). |

## Supported validators

For each supported validator, all modifiers which can be implemented in MongoDB are supported (for example `z.string().email()` is supported by using the RegEx used by `zod` itself).

Not that unsupported validators can be used in your schema, they will result in `{}`. If you'd like to receive errors when you're using unsupported validators, see the options above.

| Zod | Supported | Remarks |
| --- | --------- | ------- |
| `string()` | &#9989; | - |
| `number()` | &#9989; | Uses `bsonType: 'long'` for `.int()`. |
| `object()` | &#9989; | Sets `additionalProperties: false` unless `.passthrough()` is specified. |
| `bigint()` | &#10060; | The MongoDB driver doesn't support (de-)serializing `BigInt`. |
| `boolean()` | &#9989; | - |
| `date()` | &#9989; | `min` and `max` not supported by MongoDB. |
| `undefined()` | &#10060; | [Flagged as deprecated.](https://www.mongodb.com/docs/manual/reference/bson-types/) |
| `void()` | &#10060; | See above. |
| `null()` | &#9989; | - |
| `array()` | &#9989; | - |
| `union()` | WIP | - |
| `discriminatedUnion()` | WIP | - |
| `intersection()` | WIP | - |
| `tuple()` | WIP | - |
| `record()` | WIP | - |
| `literal()` | WIP | - |
| `enum()` | &#9989; | Credit @exsjabe! |
| `nativeEnum()` | WIP | - |
| `map()` | &#10060; | See `bigint()`. |
| `set()` | &#10060; | See `bigint()`. |
| `lazy()` | WIP | - |
| `promise()` | &#10060; | - |
| `nan()` | WIP | Might be possible by using `bsonType: 'double'` with `enum: [ NaN ]` but I have no idea how to serialize `NaN`. |
| `never()` | WIP | - |
| `preprocess()` | WIP | No-op. |
| `refine()` | WIP | No-op. |
| `transform()` | WIP | No-op. |
| `function()` | WIP | No validation besides it being a function. |
| `symbol()` | &#10060; | See `undefined()`. |

