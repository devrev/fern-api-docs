import './main.css'
import '@devrev/marketing-shared-components/dist/cjs/index.css'

import ReactDOM from 'react-dom/client'
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
  
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return
  
  const sidenav = document.querySelector('button.fern-search-bar')
    ?.parentElement as HTMLElement

  const theme = document.documentElement.getAttribute('class')

  // Add theme switch to sidenav
  if (!document.getElementById('theme-switch') && sidenav) {
    const wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'theme-switch')
    sidenav.appendChild(wrapper)
    const root = ReactDOM.createRoot(wrapper)
    root.render(React.createElement(ThemeSwitch))
  }

  // Handle header rendering
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
      document.body.insertAdjacentElement('afterbegin', fernHeaderContainer)
    }

    // Use createRoot for React 18 concurrent mode
    const headerRoot = ReactDOM.createRoot(devrevContentWrapper)
    headerRoot.render(
      React.createElement(Header, {
        ...data.header,
        version: theme === 'dark' ? 'light' : 'dark',
      })
    )
    
    // Once the header component is loaded, make it visible
    fernHeaderContainer.style.display = 'block'
  }

  // Handle footer rendering
  const footerElement = document.getElementById('fern-footer')
  if (footerElement) {
    // Check if footer is already rendered
    if (!footerElement.hasChildNodes()) {
      const footerRoot = ReactDOM.createRoot(footerElement)
      footerRoot.render(React.createElement(Footer, { ...data.footer }))
      
      // Once the footer component is loaded, make it visible
      footerElement.style.display = 'block'
    }
  } else {
    // Create footer if it doesn't exist
    const newFooter = document.createElement('div')
    newFooter.setAttribute('id', 'fern-footer')
    document.body.appendChild(newFooter)
    
    const footerRoot = ReactDOM.createRoot(newFooter)
    footerRoot.render(React.createElement(Footer, { ...data.footer }))
    newFooter.style.display = 'block'
  }
}

// For Next.js App Router compatibility
const initApp = () => {
  if (typeof window !== 'undefined') {
    // Check if the DOM is already loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', async () => {
        console.log('DOMContentLoaded')
        await render()
        setupMutationObserver()
      })
    } else {
      // DOM already loaded, render immediately
      console.log('DOM already loaded')
      render().then(() => setupMutationObserver())
    }
  }
}

const setupMutationObserver = () => {
  let observations = 0
  new MutationObserver(async (mutations, observer) => {
    await render()
    for (const mutation of mutations) {
      if (mutation.target instanceof HTMLElement) {
        const target = mutation.target
        if (target.id === 'fern-header' || target.id === 'fern-footer') {
          if (observations < 3) {
            // react hydration will trigger a mutation event
            observations++
          } else {
            observer.disconnect()
          }
          break
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true })
}

// Initialize the app
initApp()
