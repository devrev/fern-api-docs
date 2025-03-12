// import './main.css'
import '@devrev/marketing-shared-components/dist/cjs/index.css'

import ReactDOM from 'react-dom/client'

// import React, { useEffect, useState } from 'react'

import Header from './components/header'
import Footer from './components/footer'
import { ThemeSwitch } from './components/theme-switch'

import { getPageData } from './modules/sanity/utils'

// const FERN_CONTENT_WRAPPER_ID = 'fern-header-content-wrapper'
// const DEVREV_CONTENT_WRAPPER_ID = 'devrev-header-content-wrapper'

const FERN_HEADER_CONTAINER_ID = 'fern-header'

const render = async () => {
  /*
   * This is a where we try to make async data call.
   */

  const data = await getPageData()
  const sidenav = document.querySelector('button.fern-search-bar')
    ?.parentElement as HTMLElement

  const theme = document.getElementsByTagName('html')[0].getAttribute('class')

  // Add theme switch to the sidebar
  if (!document.getElementById('theme-switch') && sidenav) {
    const wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'theme-switch')
    sidenav.appendChild(wrapper)
    const root = ReactDOM.createRoot(wrapper)
    root.render(<ThemeSwitch />)
  }

  // Handle header rendering
  const headerElement = document.getElementById(FERN_HEADER_CONTAINER_ID)
  if (headerElement) {
    // Clear existing content
    headerElement.innerHTML = ''
    
    // Create root and render Header component
    const headerRoot = ReactDOM.createRoot(headerElement)
    headerRoot.render(
      <Header
        {...data.header}
        version={theme === 'dark' ? 'light' : 'dark'}
      />
    )
    
    // Make header visible
    headerElement.style.display = 'block'
  }

  // Handle footer rendering
  const footerElement = document.getElementById('fern-footer')
  if (footerElement) {
    // Clear existing content
    footerElement.innerHTML = ''
    
    // Create root and render Footer component
    const footerRoot = ReactDOM.createRoot(footerElement)
    footerRoot.render(<Footer {...data.footer} />)
    
    // Make footer visible
    footerElement.style.display = 'block'
  }
}

// Function to check if document is ready
const documentReady = () => {
  return new Promise<void>((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve())
    } else {
      resolve()
    }
  })
}

// Initialize the app
const init = async () => {
  await documentReady()
  console.log('Document ready, initializing app')
  await render()

  // Set up observer to handle dynamic content changes
  const observer = new MutationObserver(async (mutations) => {
    const shouldRerender = mutations.some(mutation => {
      if (mutation.target instanceof HTMLElement) {
        const target = mutation.target
        return target.id === FERN_HEADER_CONTAINER_ID || target.id === 'fern-footer' || 
               document.getElementById(FERN_HEADER_CONTAINER_ID) === null ||
               document.getElementById('fern-footer') === null
      }
      return false
    })

    if (shouldRerender) {
      await render()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

// Start the app
if (typeof window !== 'undefined') {
  init()
}