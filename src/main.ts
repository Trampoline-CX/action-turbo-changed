import { execSync } from 'child_process'
import { getInput, debug, setFailed, setOutput } from '@actions/core'
import * as github from '@actions/github'

const run = async (): Promise<void> => {
  try {
    // Get Inputs
    const workspace = getInput('workspace', { required: true })
    const from = getInput('from', { required: true })
    const to = getInput('to') || getDefaultTo()

    debug(`Inputs: ${JSON.stringify({ workspace, from, to })}`)

    const buffer = execSync(
      `npx turbo run build --filter="${workspace}...[${from}...${to}]" --dry-run=json`,
    )

    const json = buffer.toString('utf-8')

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

/**
 * Get the current commit of the head branch on a `pull_request` event.
 * For a push event, it will be the current commit of the current branch.
 */
const getDefaultTo = (): string =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  github.context.eventName === 'pull_request' ? (github.context as any).base_ref : 'HEAD'

void run()
