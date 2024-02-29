# Changelog

## [0.0.3-3] - 2024-02-29
- Expose the waterfall object to sync renders with whatever has to have a clean env

## [0.0.3-2] - 2024-02-29
- Added a waterfall to prevent parallel runs

## [0.0.3-1] - 2024-02-29
- Reverted change as it does not work in build mode... Attempt to update @pintora/cli to 0.7.2 which cleans up the patches to global it makes.

## [0.0.3-0] - 2024-02-27
- Run Pintora in a fork by default to have a completely separate JS scope because of https://github.com/hikerpig/pintora/issues/215 and https://github.com/hikerpig/pintora/issues/237. To opt-out, you can add the attribute `fork={false}` to the Pintora component, however if during one run the `fork` attribute is set to false, the global scope will be polluted.

## [0.0.2] - 2024-01-24
- Added a homepage in the package.json [#2](https://github.com/tex0l/astro-pintora/pull/2), thanks [@stereobooster](https://github.com/stereobooster).
- Updated dependencies.
- Updated peer dependency version for Astro to accept `^3.0.0 || ^4.0.0`.

## [0.0.1] - 2023-12-13
First version
