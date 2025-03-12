import './main.css'
import '@devrev/marketing-shared-components/dist/cjs/index.css'

import ReactDOM from 'react-dom/client'
import React from 'react'

import Header from './components/header'
import Footer from './components/footer'
import { ThemeSwitch } from './components/theme-switch'

const FERN_CONTENT_WRAPPER_ID = 'fern-header-content-wrapper'
const DEVREV_CONTENT_WRAPPER_ID = 'devrev-header-content-wrapper'
const FERN_HEADER_CONTAINER_ID = 'fern-header'

const render = async () => {
  console.log('Starting render function')
  /*
   * This is a where we try to make async data call.
   */
  const data = { header: {}, footer: {} } // Default empty data object
  console.log('Page data fetched:', data ? 'success' : 'failed')
  
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.log('Not in browser environment, exiting render')
    return
  }
  
  console.log('Looking for sidenav element')
  const sidenav = document.querySelector('button.fern-search-bar')
    ?.parentElement as HTMLElement
  console.log('Sidenav found:', sidenav ? 'yes' : 'no')

  const theme = document.documentElement.getAttribute('class')
  console.log('Current theme:', theme)

  // Add theme switch to sidenav
  if (!document.getElementById('theme-switch') && sidenav) {
    console.log('Adding theme switch to sidenav')
    const wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'theme-switch')
    sidenav.appendChild(wrapper)
    const root = ReactDOM.createRoot(wrapper)
    root.render(React.createElement(ThemeSwitch))
    console.log('Theme switch added')
  } else {
    console.log('Theme switch already exists or sidenav not found')
  }

  // Find the existing Fern header
  console.log('Looking for Fern header')
  const existingFernHeader = document.getElementById(FERN_HEADER_CONTAINER_ID)
  console.log('Fern header found:', existingFernHeader ? 'yes' : 'no')
  
  if (existingFernHeader) {
    // Check if our custom wrappers already exist
    let fernContentWrapper = document.getElementById(FERN_CONTENT_WRAPPER_ID)
    let devrevContentWrapper = document.getElementById(DEVREV_CONTENT_WRAPPER_ID)
    console.log('Existing wrappers found:', {
      fernWrapper: fernContentWrapper ? 'yes' : 'no',
      devrevWrapper: devrevContentWrapper ? 'yes' : 'no'
    })
    
    // If wrappers don't exist, create them
    if (!fernContentWrapper) {
      console.log('Creating Fern content wrapper')
      fernContentWrapper = document.createElement('div')
      fernContentWrapper.setAttribute('id', FERN_CONTENT_WRAPPER_ID)
      
      // Move all existing children to the Fern wrapper
      console.log('Moving existing children to Fern wrapper')
      while (existingFernHeader.firstChild) {
        fernContentWrapper.appendChild(existingFernHeader.firstChild)
      }
      
      existingFernHeader.appendChild(fernContentWrapper)
      console.log('Fern content wrapper created and populated')
    }
    
    if (!devrevContentWrapper) {
      console.log('Creating DevRev content wrapper')
      devrevContentWrapper = document.createElement('div')
      devrevContentWrapper.setAttribute('id', DEVREV_CONTENT_WRAPPER_ID)
      existingFernHeader.appendChild(devrevContentWrapper)
      
      // Render our custom header in the DevRev wrapper
      console.log('Rendering custom header in DevRev wrapper')
      const headerRoot = ReactDOM.createRoot(devrevContentWrapper)
      
      // Force both wrappers to be visible for debugging
      fernContentWrapper.style.display = 'block'
      devrevContentWrapper.style.display = 'block'
      
      // Pass empty props to ensure rendering
      headerRoot.render(
        React.createElement(Header, {
          version: theme === 'dark' ? 'light' : 'dark',
        })
      )
      console.log('Custom header rendered')
    } else {
      // Ensure the wrapper is visible even if it already exists
      devrevContentWrapper.style.display = 'block'
    }
    
    // Make sure the header is visible
    console.log('Making header visible')
    existingFernHeader.style.display = 'block'
  } else {
    // If Fern header doesn't exist yet, we'll wait for it to be created
    console.log('Fern header not found, waiting for it to be created')
  }

  // Handle footer rendering
  console.log('Looking for footer element')
  const footerElement = document.getElementById('fern-footer')
  console.log('Footer element found:', footerElement ? 'yes' : 'no')
  
  if (footerElement) {
    // Check if footer is already rendered
    const hasChildren = footerElement.hasChildNodes()
    console.log('Footer already has children:', hasChildren ? 'yes' : 'no')
    
    if (!hasChildren) {
      console.log('Rendering footer component')
      const footerRoot = ReactDOM.createRoot(footerElement)
      footerRoot.render(React.createElement(Footer, { ...data.footer }))
      
      // Once the footer component is loaded, make it visible
      console.log('Making footer visible')
      footerElement.style.display = 'block'
    }
  } else {
    // Create footer if it doesn't exist
    console.log('Creating new footer element')
    const newFooter = document.createElement('div')
    newFooter.setAttribute('id', 'fern-footer')
    document.body.appendChild(newFooter)
    
    console.log('Rendering footer in new element')
    const footerRoot = ReactDOM.createRoot(newFooter)
    footerRoot.render(React.createElement(Footer, { ...data.footer }))
    newFooter.style.display = 'block'
    console.log('Footer created and rendered')
  }
  
  console.log('Render function completed')
}

// For Next.js App Router compatibility
const initApp = () => {
  console.log('Initializing app')
  if (typeof window !== 'undefined') {
    console.log('Browser environment detected')
    // Check if the DOM is already loaded
    if (document.readyState === 'loading') {
      console.log('DOM still loading, adding DOMContentLoaded listener')
      document.addEventListener('DOMContentLoaded', async () => {
        console.log('DOMContentLoaded event fired')
        await render()
        setupMutationObserver()
      })
    } else {
      // DOM already loaded, render immediately
      console.log('DOM already loaded, rendering immediately')
      render().then(() => {
        console.log('Initial render complete, setting up mutation observer')
        setupMutationObserver()
      })
    }
  } else {
    console.log('Not in browser environment, skipping initialization')
  }
}

const setupMutationObserver = () => {
  console.log('Setting up mutation observer')
  // Create a mutation observer to watch for the Fern header being added to the DOM
  const observer = new MutationObserver(async (mutations) => {
    console.log('Mutation detected, mutations count:', mutations.length)
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        console.log('childList mutation detected')
        // Check if the Fern header was added
        const fernHeader = document.getElementById(FERN_HEADER_CONTAINER_ID)
        if (fernHeader) {
          console.log('Fern header found in mutation, rendering custom header')
          await render()
        }
      }
    }
  })
  
  // Start observing the document body for changes
  console.log('Starting to observe document body')
  observer.observe(document.body, { childList: true, subtree: true })
  
  // Also try to render immediately in case the header already exists
  console.log('Attempting immediate render from mutation observer setup')
  render()
}

// Initialize the app
console.log('Starting application initialization')
initApp()
