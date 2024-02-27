import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve, join, dirname } from 'node:path'
import type { CLIRenderOptions } from '@pintora/cli/lib/render'
export default async function render (opts: CLIRenderOptions, forkProcess: boolean): Promise<Buffer | string> {
  if (!forkProcess) return await (await import('@pintora/cli')).render(opts)

  return await new Promise((__resolve, __reject) => {
    let consumed = false
    const _resolve = (result: Buffer | string) => {
      if (!consumed) {
        consumed = true
        subProcess.removeAllListeners()
        clearTimeout(cleanup)
        __resolve(result)
      }
    }

    const _reject = (error: Error) => {
      if (!consumed) {
        consumed = true
        subProcess.removeAllListeners()
        clearTimeout(cleanup)
        __reject(error)
      }
    }

    const dir = dirname(fileURLToPath(import.meta.url))
    const workerFilePath = resolve(join(dir, 'nonPollutingPintoraRender.cjs'))

    const subProcess = fork(workerFilePath)
    subProcess.once('message', ({ result, success }: { result: { data: string, encoding: 'utf8' | 'base64' } | Error, success: boolean }) => {
      subProcess.removeAllListeners()
      clearTimeout(cleanup)

      if (success) {
        try {
          const { data, encoding } = result as { data: string, encoding: 'utf8' | 'base64' }
          if (encoding === 'base64') _resolve(Buffer.from(data, 'base64'))
          else if (encoding === 'utf8') _resolve(data)
          else _reject(new Error(`Encoding ${encoding} from child process is unknown`))
        } catch (error) {
          if (error instanceof Error) _reject(error)
          else _reject(new Error(`Unknown error happened: ${error}`))
        }
      } else {
        if (result instanceof Error) _reject(result)
        else _reject(new Error(`Unknown remote error happened: ${result}`))
      }
    })
    subProcess.once('error', error => {
      _reject(error)
    })
    subProcess.once('exit', (code) => {
      _reject(new Error(`Worker stopped with exit code ${code}`))
    })
    subProcess.send(JSON.stringify(opts))
    const cleanup = setTimeout(() => {
      subProcess.removeAllListeners()
      clearTimeout(cleanup)
      if (!subProcess.killed) subProcess.kill()
      _reject(new Error('Timeout'))
    }, 1500)
  })
}
