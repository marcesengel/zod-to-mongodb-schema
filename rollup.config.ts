import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { RollupOptions } from 'rollup'

const bundle: RollupOptions = {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
    },
    {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].mjs',
      sourcemap: true,
      preserveModules: true,
    },
  ],
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
  ],
  external: ['graphql'],
}

export default bundle
