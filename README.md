# Astro Pintora
This package aims at making an of-the-shelves Astro Component for [Pintora](https://pintorajs.vercel.app/) diagrams.

## Quick start
You can install `astro-pintora` as follows:

```shell
npm install astro-pintora
# OR
yarn add astro-pintora
# OR
pnpn install astro-pintora
```

And use it as follows in a page:
```astro
--- 
import Pintora from 'astro-pintora'
--- 
<Pintora code={`
activityDiagram
  title: Activity Diagram Simple Action
  :Action 1;
  :Action 2;
`}/>
```

## Props
This component accepts three props:
- `code: string`: the Pintora diagram declaration
- `renderOptions?: RenderOptions`: the rest of the [CLIRenderOptions](https://pintorajs.vercel.app/docs/advanced/api-usage/#renderoptions):
  - `devicePixelRatio?: number`: the pixel ratio.
  - `mimeType?: 'image/png' | 'image/jpeg' | 'image/svg+xml'`: specifies the output format. Defaults to `'image/png'`.
  - `backgroundColor?: string`: the background color.
  - `pintoraConfig?: Partial<PintoraConfig>`: the Pintora config object, can be used to override the theme through `pintoraConfig.themeConfig.theme`.
  - `width?: number`: width of the output.

For example, to render an SVG with a transparent background that uses the `dark` theme:

```astro
--- 
import Pintora, { type RenderOptions } from 'astro-pintora'

const renderOptions: RenderOptions = {
  mimeType: 'image/svg+xml',
  backgroundColor: 'transparent',
  pintoraConfig: { themeConfig: { theme: 'dark' } }
}
--- 
<Pintora code={`
activityDiagram
  title: Activity Diagram Simple Action
  :Action 1;
  :Action 2;
`}
renderOptions={renderOptions}/>
```

## Acknowledgments
The structure of the package is inspired by [`astro-diagrams`](https://github.com/JulianCataldo/web-garden/tree/develop/components/Diagram) which aims at providing an equivalent Astro component for Mermaid diagrams.

Many thanks to [@hikerpig](https://github.com/hikerpig) who maintains [Pintora](https://github.com/hikerpig/pintora) for the quick support.
