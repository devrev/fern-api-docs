import './main.css'
import '@devrev/marketing-shared-components/dist/cjs/index.css'

import ReactDOM from 'react-dom'

import React from 'react'

import Header from './components/header'
import Footer from './components/footer'
import { ThemeSwitch } from './components/theme-switch'

import { getPageData } from './modules/sanity/utils'

const FERN_CONTENT_WRAPPER_ID = 'fern-header-content-wrapper'
const DEVREV_CONTENT_WRAPPER_ID = 'devrev-header-content-wrapper'

const FERN_HEADER_CONTAINER_ID = 'fern-header'

const render = async () => {
  /*
   * This is a where we try to make async data call.
   */

  const data = await getPageData()
  const sidenav = document.querySelector('button.fern-search-bar')
    ?.parentElement as HTMLElement

  const theme = document.getElementsByTagName('html')[0].getAttribute('class')

  if (!document.getElementById('theme-switch')) {
    const wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'theme-switch')
    sidenav.appendChild(wrapper)
    ReactDOM.render(React.createElement(ThemeSwitch), wrapper)
  }

  const fernHeaderId = document.getElementById(FERN_CONTENT_WRAPPER_ID)
  const devrevHeaderId = document.getElementById(DEVREV_CONTENT_WRAPPER_ID)

  if (!fernHeaderId && !devrevHeaderId) {
    //  Main Container
    const fernHeaderContainer = document.createElement('div')
    fernHeaderContainer.setAttribute('id', FERN_HEADER_CONTAINER_ID)

    //  Fern Header
    const fernContentWrapper = document.createElement('div')
    fernContentWrapper.setAttribute('id', FERN_CONTENT_WRAPPER_ID)

    const devrevContentWrapper = document.createElement('div')
    devrevContentWrapper.setAttribute('id', DEVREV_CONTENT_WRAPPER_ID)

    // Get existing fern-header element and its children
    const mainHeaderWrapper = document.getElementById(FERN_HEADER_CONTAINER_ID)

    if (mainHeaderWrapper) {
      // Move all children to the wrapper
      while (mainHeaderWrapper.firstChild) {
        fernContentWrapper.appendChild(mainHeaderWrapper.firstChild)
      }
    }

    fernHeaderContainer.appendChild(fernContentWrapper)
    fernHeaderContainer.appendChild(devrevContentWrapper)

    // Insert the new container where the original fern-header was
    if (mainHeaderWrapper) {
      mainHeaderWrapper.replaceWith(fernHeaderContainer)
    } else {
      document.body.appendChild(fernHeaderContainer)
    }

    ReactDOM.render(
      React.createElement(Header, {
        ...data.header,
        version: theme == 'dark' ? 'light' : 'dark',
      }),
      devrevContentWrapper,
      () => {
        // Once the header component is loaded, make it visible
        const header = document.getElementById(FERN_HEADER_CONTAINER_ID)
        if (header) header.style.display = 'block'
      }
    )
  }

  ReactDOM.render(
    React.createElement(Footer, { ...data.footer }),
    document.getElementById('fern-footer'),
    () => {
      // Once the footer component is loaded, make it visible
      const footer = document.getElementById('fern-footer')
      if (footer) footer.style.display = 'block'
    },
  )
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
