'use client'

import React, { useEffect } from 'react'

const PLUG_URL = 'https://plug-platform.devrev.ai/static/plug.js'
const PLUG_SESSION_RECORDING = true

const PLuG = () => {
  useEffect(() => {
    if ((window as any).plugSDK) {
       (window as any).plugSDK?.init?.({
        app_id: process.env.PLUG_APP_ID,
        enable_session_recording: PLUG_SESSION_RECORDING,
      })
    }
  }, [])

  return process.env.PLUG_APP_ID ? (
    <script type="text/javascript" id="plug-platform" src={PLUG_URL} />
  ) : null
}

export default PLuG
