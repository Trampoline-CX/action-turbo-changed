## Get Started

First, you can run `nvm use` to use the recommended Node version (see `.nvmrc`).

Install the dependencies

```bash
$ yarn
```

Build using Typescript and package for distribution

```bash
$ yarn build && yarn package
```

Run the tests :heavy_check_mark:

```bash
$ yarn test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/Trampoline-CX/action-turbo-changed/actions) for runs of this action! :rocket:

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:

```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

### Tag and Release

After testing you can [create a tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest action version.

Process:

1. Update `example-*` workflow files to point to new version
2. `yarn version`
3. Create Github release that points to newly created tag
