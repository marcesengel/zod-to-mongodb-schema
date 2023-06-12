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

## Configuration

| Name | Required | Type | Description |
| ---- | -------- | ---- | ----------- |
| `zodObjectId` | Yes | `ZodAnyType` | The zod schema you use to validate object ids (for example `z.custom<ObjectId | string>(value => ...)`). This is used to detect ObjectIds in your schema by doing a strict equality check (`===`). |
| `onUnsupported` | No (default: `warn`) | `'error' | 'warn' | 'no-op'` | How to handle unsupported validations (see below). |

## Supported validators

All the common validators are supported, f.e. `z.string().max(n)`. Some more uncommon
ones lack support (think of `z.string().emoji()`) - however these will simply result
in no-ops and either an error, warning log or nothing at all depending on configuration.
