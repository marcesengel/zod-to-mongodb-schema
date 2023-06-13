import { getOptions } from './options'

export default function handleUnsupported(message: string) {
  const { onUnsupported } = getOptions()

  switch (onUnsupported) {
    case 'error':
      throw new Error(message)

    case 'warn':
      console.warn(message)
  }
}
