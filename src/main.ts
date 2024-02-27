import { createHash } from 'node:crypto'
import render from './nonPollutingPintoraRenderCaller'
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

export const computeDiagram = async (code: string, renderOptions: RenderOptions, forkProcess: boolean): Promise<Result> => {
  const opts = {
    code,
    ...renderOptions
  }

  const result = await render(opts, forkProcess)

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
  renderOptions: RenderOptions,
  forkProcess: boolean
): Promise<Result> => {
  const key = computeUniqueKey(code, renderOptions)
  if (cache[key] === undefined) {
    cache[key] = await computeDiagram(code, renderOptions, forkProcess)
  }
  return cache[key]
}
