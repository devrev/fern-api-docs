import './main.css'
import '@devrev/marketing-shared-components/dist/cjs/index.css'

import ReactDOM from 'react-dom'

import React from 'react'

import Header from './components/header'
import Footer from './components/footer'
import { ThemeSwitch } from './components/theme-switch'

import { getPageData } from './modules/sanity/utils'

const render = async () => {
  /*
   * This is a where we try to make async data call.
   */

  const data = await getPageData()
  // const search = document.querySelector('button.fern-search-bar')
  const sidenav = document.querySelector('button.fern-search-bar')
    ?.parentElement as HTMLElement

  ReactDOM.render(
    React.createElement(Header, { ...data.header }),
    document.getElementById('fern-header'),
    () => {
      // Once the header component is loaded, make it visible
      const header = document.getElementById('fern-header')
      if (header) header.style.display = 'block'
    },
  )
  ReactDOM.render(
    React.createElement(Footer, { ...data.footer }),
    document.getElementById('fern-footer'),
    () => {
      // Once the footer component is loaded, make it visible
      const footer = document.getElementById('fern-footer')
      if (footer) footer.style.display = 'block'
    },
  )

  // console.log('sibling', search, search?.parentNode)
  ReactDOM.createPortal(React.createElement(ThemeSwitch), sidenav)
}

let observations = 0
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOMContentLoaded')
  await render()
  new MutationObserver(async (e, o) => {
    await render()
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
