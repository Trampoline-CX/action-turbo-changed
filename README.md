<p align="center">
  <a href="https://github.com/Trampoline-CX/action-turbo-changed/actions"><img alt="typescript-action status" src="https://github.com/Trampoline-CX/action-turbo-changed/workflows/build-test/badge.svg"></a>
</p>

# `turbo-changed` Github Action

A Github Action making it easy to check if a local workspace changed using [Turborepo](https://turbo.build/).

## Prerequisites

Since this Github Action relies on Turborepo, you'll need to have Turborepo set up in your repository before using this.

:warning: This was tested against a working monorepo using Yarn v3 (with Yarn Workspaces), but as it uses a standard Turborepo command behind the scenes, it should work with any monorepo setup compatible with Turborepo. See the `example/yarn-workspaces` folder for a working setup.

## Disclaimer

This project was bootstraped using [typescript-action](https://github.com/actions/typescript-action).
