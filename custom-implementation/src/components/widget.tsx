const PLUG_URL = 'https://plug-platform.devrev.ai/static/plug.js'
const PLUG_ID = 'don:core:dvrv-us-1:devo/0:plug_setting/1'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugSDK: any
  }
}

export const PLuG = () => {
  return (
    <script
      src={PLUG_URL}
      onLoad={() => {
        window?.plugSDK?.init?.({
          app_id: PLUG_ID,
        })
      }}
      defer
      async
      data-nscript="lazyOnload"
    />
  )
}

export default PLuG
