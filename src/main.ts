import { execSync } from 'child_process'
import { join } from 'path'
import { getInput, debug, setFailed, setOutput } from '@actions/core'
import { promises } from 'fs'
import semver from 'semver'
import { getTurboChangedWorkspaces, getTurboMajorVersion } from './turbo-helpers'

const run = async (): Promise<void> => {
  try {
    // Get Inputs
    const workspace = getInput('workspace', { required: true })
    const from = getInput('from', { required: true })
    const to = getInput('to', { required: true })
    const workingDirectory = getInput('working-directory', { required: true })
    const turboTaskName = getInput('turbo-task-name', { required: true })

    const majorTurboVersion = getTurboMajorVersion(workingDirectory)

    if (!majorTurboVersion) return // Means that getting the version failed and threw an error

    debug(`Inputs: ${JSON.stringify({ workspace, from, to, workingDirectory, turboTaskName })}`)

    const { changed, affectedWorkspaces } = await getTurboChangedWorkspaces({
      majorTurboVersion,
      workspace,
      from,
      to,
      workingDirectory,
      turboTaskName,
    })

    setOutput('changed', changed)
    setOutput('affectedWorkspaces', affectedWorkspaces)
  } catch (error) {
    if (error instanceof Error || typeof error === 'string') {
      setFailed(error)
    } else {
      setFailed('Unknown error occured.')
    }
  }
}

void run()
