import { ZodTypeAny, z } from 'zod'

export type TestCase = [
  string,
  ZodTypeAny,
  Record<string, unknown> | [string, any] | [string, any][],
]
export type TestCaseGroup = { name: string; testCases: TestCase[] }

const testCases: TestCaseGroup[] = [
  {
    name: 'z.string()',
    testCases: [
      ['', z.string(), { bsonType: 'string' }],
      ['.nullable()', z.string().nullable(), { bsonType: ['string', 'null'] }],
      [
        '.email()',
        z.string().email(),
        [
          'pattern',
          /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i,
        ],
      ],
      ['.min(5)', z.string().min(5), ['minLength', 5]],
      ['.max(5)', z.string().max(5), ['maxLength', 5]],
      [
        '.length(5)',
        z.string().length(5),
        [
          ['minLength', 5],
          ['maxLength', 5],
        ],
      ],
    ],
  },
  {
    name: 'z.number()',
    testCases: [
      ['', z.number(), { bsonType: 'double' }],
      ['.int()', z.number().int(), { bsonType: 'long' }],
      ['.gt(5)', z.number().gt(5), ['exclusiveMinimum', 5]],
      ['.gte(5)', z.number().gte(5), ['minimum', 5]],
      ['.lt(5)', z.number().lt(5), ['exclusiveMaximum', 5]],
      ['.lte(5)', z.number().lte(5), ['maximum', 5]],
      ['.multipleOf(5)', z.number().multipleOf(5), ['multipleOf', 5]],
      [
        '.finite()',
        z.number().finite(),
        { bsonType: 'double', not: { enum: [-Infinity, Infinity] } },
      ],
    ],
  },
  {
    name: 'z.boolean()',
    testCases: [['', z.boolean(), { bsonType: 'bool' }]],
  },
  {
    name: 'z.date()',
    testCases: [['', z.date(), { bsonType: 'date' }]],
  },
  { name: 'z.null()', testCases: [['', z.null(), { bsonType: 'null' }]] },
  {
    name: 'z.object()',
    testCases: [
      [
        'empty',
        z.object({}),
        { bsonType: 'object', additionalProperties: false },
      ],
      ['.strict()', z.object({}).strict(), ['additionalProperties', false]],
      ['.passthrough()', z.object({}).passthrough(), { bsonType: 'object' }],
      [
        '({ number: z.number() })',
        z.object({ number: z.number() }),
        [
          ['properties', { number: { bsonType: 'double' } }],
          ['required', ['number']],
        ],
      ],
      [
        '({ number: z.number().optional() })',
        z.object({ number: z.number().optional() }),
        {
          bsonType: 'object',
          properties: { number: { bsonType: 'double' } },
          additionalProperties: false,
        },
      ],
    ],
  },
  {
    name: 'z.array()',
    testCases: [
      [
        'z.array(z.number())',
        z.array(z.number()),
        { bsonType: 'array', items: { bsonType: 'double' } },
      ],
      [
        'z.array(z.number()).min(5)',
        z.array(z.number()).min(5),
        ['minItems', 5],
      ],
      [
        'z.array(z.number()).max(5)',
        z.array(z.number()).max(5),
        ['maxItems', 5],
      ],
    ],
  },
]

export default testCases
