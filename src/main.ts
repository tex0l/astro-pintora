import { createHash } from 'node:crypto'
import { render } from '@pintora/cli'
import type { CLIRenderOptions } from '@pintora/cli/lib/render'
import type { PintoraConfig } from '@pintora/core/lib/config'

type Cache = Record<string, Result>

const cache: Cache = {}

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T

export interface RenderOptions extends Omit<CLIRenderOptions, 'code'> {
  // remove null from the possibilities for clarity
  devicePixelRatio?: number
  // override the mimeType to an enum to avoid typos
  mimeType?: 'image/png' | 'image/jpeg' | 'image/svg+xml'
  // Hack because themeConfig has some deep required properties which have default values already set
  pintoraConfig?: DeepPartial<PintoraConfig>
}

export interface Result {
  type: 'img' | 'svg'
  value: string
}

const generateHash = (input: string): string => {
  const hash = createHash('sha256')
  hash.update(input)
  return hash.digest().toString('hex')
}

let guardian: Promise<{ error: boolean, result: any }> = Promise.resolve({ error: false, result: undefined })

const waterfall = <A extends any[], B> (func: (...a: A) => Promise<B>): (...a: A) => Promise<B> => async (...args: A) => {
  guardian = guardian.then(async () => {
    return await func(...args)
      .then(result => ({ error: false, result }), result => ({ error: true, result }))
  })
  return await guardian.then(async ({ error, result }) => {
    if (error) return await Promise.reject(result)
    else return await Promise.resolve(result)
  })
}

const waterFallenRender = waterfall(render as (opts: CLIRenderOptions) => Promise<string | Buffer>)

export const computeDiagram = async (code: string, renderOptions: RenderOptions): Promise<Result> => {
  const opts = {
    code,
    ...renderOptions
  }

  const result = await waterFallenRender(opts)

  if (result instanceof Buffer) {
    return {
      type: 'img',
      value: `data:${opts.mimeType ?? 'image/png'};base64,${result
        .toString('base64')
        .replace(/-/g, '+')
        .replace(/_/g, '/')}`
    }
  } else {
    return {
      type: 'svg',
      value: result
    }
  }
}

const computeUniqueKey = (code: string, renderOptions: RenderOptions): string =>
  generateHash(
    JSON.stringify({
      code,
      renderOptions
    })
  )

export const cachedComputeDiagram = async (
  code: string,
  renderOptions: RenderOptions
): Promise<Result> => {
  const key = computeUniqueKey(code, renderOptions)
  if (cache[key] === undefined) {
    cache[key] = await computeDiagram(code, renderOptions)
  }
  return cache[key]
}
