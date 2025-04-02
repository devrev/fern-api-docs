# DevRev Docs

Merging a change in this repository will update the following clients:

- [API Docs](https://developer.devrev.ai)

This repository contains

- DevRev's `Public` OpenAPI spec & `Beta` OpenAPI spec
- Fern configuration

## API definition

The API Definition contains an OpenAPI specification adapted to be compatible with Fern. The specs are in `/fern/apis`.

To make sure that the definition is valid, you can use the Fern CLI.

```bash
npm install -g fern-api # Installs CLI
fern check # Checks if the definition is valid
```

## Generators

Generators read in your API Definition and output artifacts (the TypeScript SDK Generator) and are tracked in [generators.yml](./fern/api/generators.yml).

To trigger the generators run:

```bash
# publish generated files
fern generate --version <version>
```

## Run a local instance

In the root of this repository:
```
cd custom-implementation/ && npm i && npm run build && cd ..
fern docs dev
```

### Troubleshooting

If you run into errors, you can add the ` --log-level debug` flag to get more information.
