import './main.css'
import '@devrev/marketing-shared-components/dist/cjs/index.css'

import ReactDOM from 'react-dom'

import React from 'react'

import Header from './components/header'
import Footer from './components/footer'

import { getPageData } from './modules/sanity/utils'

const render = async () => {
  const data = await getPageData()

  ReactDOM.render(
    React.createElement(Header, { ...data?.header }),
    document.getElementById('fern-header'),
  )
  ReactDOM.render(
    React.createElement(Footer, { ...data?.footer }),
    document.getElementById('fern-footer'),
  )
}

let observations = 0
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded')
  void render()
  new MutationObserver((e, o) => {
    void render()
    for (const item of e) {
      if (item.target instanceof HTMLElement) {
        const target = item.target
        if (target.id === 'fern-header' || target.id === 'fern-footer') {
          if (observations < 3) {
            // react hydration will trigger a mutation event
            observations++
          } else {
            o.disconnect()
          }
          break
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true })
})
