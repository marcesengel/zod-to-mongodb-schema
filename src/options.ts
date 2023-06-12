import { ZodTypeAny } from 'zod'

export type Options = {
  zodObjectId: ZodTypeAny
  onUnsupported?: 'error' | 'warn' | 'no-op'
}

/** @internal */
export type ResolvedOptions = Required<Options>

let _options: ResolvedOptions | null = null

/** @internal */
export function setOptions(options: Options) {
  _options = {
    onUnsupported: 'warn',
    ...options,
  }
}

/** @internal */
export function getOptions(): ResolvedOptions {
  if (!_options) {
    throw new Error('Tried to get options without setting them first')
  }

  return _options
}

/**
 * Clear options to allow for GCing.
 * @internal */
export function clearOptions() {
  _options = null
}
