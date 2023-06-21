import { ZodStringDef } from 'zod'

import { DefParser } from '../DefParser'
import { MongoSchemaString } from '../MongoSchema'
import handleUnsupported from '../handleUnsupported'

const parseStringDef: DefParser<ZodStringDef> = (def): MongoSchemaString => {
  const mongoSchema: MongoSchemaString = { bsonType: 'string' }
  if (!def.checks) {
    return mongoSchema
  }

  for (const check of def.checks) {
    switch (check.kind) {
      case 'min':
        mongoSchema.minLength = check.value
        break

      case 'max':
        mongoSchema.maxLength = check.value
        break

      case 'length':
        mongoSchema.minLength = check.value
        mongoSchema.maxLength = check.value
        break

      case 'email':
        assignPattern(mongoSchema, emailRegEx)
        break

      case 'regex':
        assignPattern(mongoSchema, check.regex)
        break

      case 'url':
        assignPattern(mongoSchema, urlRegEx)
        break

      case 'uuid':
        assignPattern(mongoSchema, uuidRegEx)
        break

      case 'cuid':
        assignPattern(mongoSchema, cuidRegEx)
        break

      case 'cuid2':
        assignPattern(mongoSchema, cuid2RegEx)
        break

      case 'ulid':
        assignPattern(mongoSchema, ulidRegEx)
        break

      case 'emoji':
        assignPattern(mongoSchema, emojiRegEx)
        break

      case 'trim':
        assignPattern(mongoSchema, trimRegEx)
        break

      case 'datetime':
        assignPattern(mongoSchema, datetimeRegex(check))
        break

      case 'ip': {
        switch (check.version) {
          case undefined:
            assignPattern(mongoSchema, ipRegEx)
            break

          case 'v4':
            assignPattern(mongoSchema, ipv4RegEx)
            break

          case 'v6':
            assignPattern(mongoSchema, ipv6RegEx)
            break
        }

        break
      }

      default:
        handleUnsupported(
          `String check '${check.kind}' not supported. Please manually add a RegExp if needed.`,
        )
    }
  }

  return mongoSchema
}

export default parseStringDef

function assignPattern(mongoSchema: MongoSchemaString, pattern: RegExp) {
  if (mongoSchema.pattern) {
    throw new Error('Tried to apply multiple patterns to string schema.')
  }

  mongoSchema.pattern = pattern
}

// taken from https://github.com/colinhacks/zod/blob/master/src/types.ts#L541
const cuidRegEx = /^c[^\s-]{8,}$/i
const cuid2RegEx = /^[a-z][a-z0-9]*$/
const ulidRegEx = /[0-9A-HJKMNP-TV-Z]{26}/
const uuidRegEx =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i

const emailRegEx =
  /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i

const emojiRegEx = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u

const ipv4RegEx =
  /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/
const ipv6RegEx =
  /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/
const ipRegEx = new RegExp(ipv4RegEx.source + '|' + ipv6RegEx.source)

const datetimeRegex = (args: { precision: number | null; offset: boolean }) => {
  if (args.precision) {
    if (args.offset) {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`,
      )
    } else {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`,
      )
    }
  } else if (args.precision === 0) {
    if (args.offset) {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$`,
      )
    } else {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`)
    }
  } else {
    if (args.offset) {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$`,
      )
    } else {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`,
      )
    }
  }
}

// taken from https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
const urlRegEx =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i

const trimRegEx = /^$|^[^\s]$|^[^\s].*[^\s]$/
