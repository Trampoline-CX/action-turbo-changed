import { execSync } from 'child_process'
import { join } from 'path'
import { getInput, debug, setFailed, setOutput } from '@actions/core'

const run = async (): Promise<void> => {
  try {
    // Get Inputs
    const workspace = getInput('workspace', { required: true })
    const from = getInput('from', { required: true })
    const to = getInput('to', { required: true })
    const workingDirectory = getInput('working-directory', { required: true })

    debug(`Inputs: ${JSON.stringify({ workspace, from, to, workingDirectory })}`)

    const json = await execSync(
      `npx turbo run build --filter="${workspace}...[${from}...${to}]" --dry-run=json`,
      {
        cwd: join(process.cwd(), workingDirectory),
        encoding: 'utf-8',
      },
    )

    debug(`Output from Turborepo: ${json}`)

    const parsedOutput = JSON.parse(json)
    const changed = parsedOutput.packages.includes(workspace)

    setOutput('changed', changed)
  } catch (error) {
    if (error instanceof Error || typeof error === 'string') {
      setFailed(error)
    } else {
      setFailed('Unknown error occured.')
    }
  }
}

void run()
