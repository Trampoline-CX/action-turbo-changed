import { execSync } from 'child_process'
import { join } from 'path'
import { debug, getInput, setFailed } from '@actions/core'
import semver from 'semver'
import { load } from '@npmcli/package-json'

export type TurboVersion = 1 | 2

/**
 * Get the major version of Turborepo used.
 * 1. Prioritize looking at the input passed to the action.
 * 2. If not provided, looks at the package.json of workingDirectory to infer the turbo version from.
 *
 * @returns 1 | 2
 */
export const getTurboMajorVersion = async (
  workingDirectory: string,
): Promise<TurboVersion | false> => {
  let turboMajorVersion: string | undefined = getInput('turbo-major-version', { required: false })
  let major: number
  debug(`Turbo major version from input: ${turboMajorVersion}`)

  if (!turboMajorVersion) {
    debug('Reading package.json to find turbo version')

    const packageJson = await load(workingDirectory)

    turboMajorVersion =
      packageJson.content.devDependencies?.turbo || packageJson.content.dependencies?.turbo
    debug(`Turbo major version from package.json: ${turboMajorVersion}`)

    if (turboMajorVersion === undefined) {
      setFailed(
        `Couldn't find turbo dependency in root package.json. Please provide turbo-major-version as an input to the Github Action.`,
      )
      return false
    }
    major = semver.major(turboMajorVersion)
  } else {
    major = parseInt(turboMajorVersion)
  }

  if (major < 1 || major > 2) {
    setFailed(`Expected turbo major version to be either 1 or 2, detected version ${major}.`)
    return false
  } else {
    debug(`Using Turbo major version: ${major}`)
    return major as TurboVersion
  }
}

export interface GetTurboChangedWorkspacesOptions {
  majorTurboVersion: TurboVersion
  turboTaskName: string
  workspace: string
  from: string
  to: string
  workingDirectory: string
}

export interface ChangedWorkspaces {
  changed: boolean
  affectedWorkspaces: string[]
}

export const getTurboChangedWorkspaces = async ({
  majorTurboVersion,
  turboTaskName,
  workspace,
  from,
  to,
  workingDirectory,
}: GetTurboChangedWorkspacesOptions): Promise<ChangedWorkspaces> => {
  if (majorTurboVersion === 1) {
    const json = execSync(
      `TURBO_TELEMETRY_DISABLED=1 TURBO_TELEMETRY_MESSAGE_DISABLED=1 npx turbo@^1 run ${turboTaskName} --filter="${workspace}...[${from}...${to}]" --dry-run=json`,
      {
        cwd: join(process.cwd(), workingDirectory),
        encoding: 'utf-8',
      },
    )

    debug(`Output from Turborepo: ${json}`)

    const parsedOutput = JSON.parse(json)
    const changed = parsedOutput.packages.includes(workspace)

    return { changed, affectedWorkspaces: parsedOutput.packages }
  } else {
    // Turbo v2
    const json = execSync(
      `TURBO_TELEMETRY_DISABLED=1 TURBO_TELEMETRY_MESSAGE_DISABLED=1 npx turbo@^2 run ${turboTaskName} --filter="${workspace}...[${from}...${to}]" --dry-run=json`,
      {
        cwd: join(process.cwd(), workingDirectory),
        encoding: 'utf-8',
      },
    )

    debug(`Output from Turborepo: ${json}`)

    const parsedOutput = JSON.parse(json)
    const changed = parsedOutput.packages.includes(workspace)

    return { changed, affectedWorkspaces: parsedOutput.packages }
  }
}
