# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.


## Current Prototype Status

This project is a prototype of a Multi-Hazard Risk Identification,
Carrying Capacity Assessment, and Relocation Decision Support System.

The overall system is designed to support multiple hazards. In the
current prototype, the Flood Risk Prediction module has been implemented
as the initial hazard-specific ML module.

The current flood module integrates rainfall data, river discharge data,
geospatial information, and hydrological risk analysis to generate
district-level flood risk visualization for 6-hour, 12-hour, and
24-hour horizons.

The supervised ML models are currently in the pre-training stage.
The prototype currently operates in hydrological proxy mode because
multi-year historical flood-event labels and other required historical
datasets are still being acquired.

The system is intended as a research and decision-support prototype
and does not replace official warnings from IMD, CWC, NDMA, or other
government authorities.