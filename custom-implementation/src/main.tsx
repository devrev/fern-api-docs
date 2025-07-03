import './main.css'
import '@devrev/marketing-shared-components/dist/cjs/index.css'

import ReactDOM from 'react-dom/client'
import React from 'react'

import Header from './components/header'
import Footer from './components/footer'

import { Search } from './components/search'
import { ThemeSwitch } from './components/theme-switch'

import { getPageData } from './modules/sanity/utils'

const FERN_CONTENT_WRAPPER_ID = 'fern-header-content-wrapper'
const DEVREV_CONTENT_WRAPPER_ID = 'devrev-header-content-wrapper'
const FERN_HEADER_CONTAINER_ID = 'fern-header'

// ADD GUARDS: Track what's already been rendered
let headerRendered = false
let footerRendered = false
let sidenavRendered = false

const render = async () => {
  if (typeof window === 'undefined') {
    return
  }

  const data = await getPageData()

  const sidenav = document.querySelector('button.fern-search-bar')
    ?.parentElement as HTMLElement

  const theme = document.getElementsByTagName('html')[0].getAttribute('class')

  if (!sidenavRendered && !document.getElementById('sidenav-header-wrapper') && sidenav) {
    sidenavRendered = true
    
    const sidenavHeaderWrapper = document.createElement('div')
    sidenavHeaderWrapper.setAttribute('id', 'sidenav-header-wrapper')
    sidenav.appendChild(sidenavHeaderWrapper)

    const search = document.createElement('div')
    search.setAttribute('id', 'search-component')
    sidenavHeaderWrapper.appendChild(search)
    const searchRoot = ReactDOM.createRoot(search)
    searchRoot.render(React.createElement(Search))

    const wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'theme-switch')
    sidenavHeaderWrapper.appendChild(wrapper)
    const themeRoot = ReactDOM.createRoot(wrapper)
    themeRoot.render(React.createElement(ThemeSwitch))

    sidenav.replaceWith(sidenavHeaderWrapper)
  }

  const fernHeaderId = document.getElementById(FERN_CONTENT_WRAPPER_ID)
  const devrevHeaderId = document.getElementById(DEVREV_CONTENT_WRAPPER_ID)

  // DEBUG: Check header state
  console.log('DEBUG: Header check:')
  console.log('  - headerRendered:', headerRendered)
  console.log('  - fernHeaderId exists:', !!fernHeaderId)
  console.log('  - devrevHeaderId exists:', !!devrevHeaderId)
  console.log('  - Will render header:', !headerRendered && !fernHeaderId && !devrevHeaderId)

  // GUARD: Only render header once
  if (!headerRendered && !fernHeaderId && !devrevHeaderId) {
    console.log('DEBUG: Starting header render...')
    headerRendered = true
    
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

    // Render header component
    console.log('DEBUG: Rendering DevRev header component...')
    console.log('DEBUG: devrevContentWrapper:', devrevContentWrapper)
    console.log('DEBUG: header data:', data.header)
    
    const headerRoot = ReactDOM.createRoot(devrevContentWrapper)
    headerRoot.render(
      React.createElement(Header, {
        ...data.header,
        version: theme == 'dark' ? 'light' : 'dark',
      })
    )
    
    console.log('DEBUG: DevRev header rendered, making visible...')
    
    // Make header visible immediately
    setTimeout(() => {
      const header = document.getElementById(FERN_HEADER_CONTAINER_ID)
      console.log('DEBUG: Final header element:', header)
              if (header) {
          header.style.display = 'block'
          console.log('DEBUG: Header display set to block')
          
          // Check if DevRev wrapper is visible
          const devrevWrapper = document.getElementById(DEVREV_CONTENT_WRAPPER_ID)
          if (devrevWrapper) {
            const styles = window.getComputedStyle(devrevWrapper)
            console.log('DEBUG: DevRev wrapper styles:')
            console.log('  - display:', styles.display)
            console.log('  - visibility:', styles.visibility)
            console.log('  - opacity:', styles.opacity)
          }
        }
    }, 0)
  }

  // GUARD: Only render footer once
  const footerElement = document.getElementById('fern-footer')
  if (!footerRendered && footerElement && !footerElement.hasAttribute('data-footer-rendered')) {
    footerRendered = true
    footerElement.setAttribute('data-footer-rendered', 'true')
    
    const footerRoot = ReactDOM.createRoot(footerElement)
    footerRoot.render(React.createElement(Footer,{ ...data.footer }))
    
    // Make footer visible immediately
    setTimeout(() => {
      const footer = document.getElementById('fern-footer')
      if (footer) {
        footer.style.display = 'block'
      }
    }, 0)
  }

  // Add Plug component directly to body
  if (!document.getElementById('plug-platform')) {
    const plugScript = document.createElement('script')
    plugScript.setAttribute('type', 'text/javascript')
    plugScript.setAttribute('id', 'plug-platform')
    plugScript.setAttribute('src', 'https://plug-platform.devrev.ai/static/plug.js')
    document.body.appendChild(plugScript)
    
    // Initialize Plug SDK after script loads
    plugScript.onload = () => {
      if ((window as any).plugSDK) {
        (window as any).plugSDK?.init?.({
          app_id: data?.plug?.id,
          enable_session_recording: true,
        });
        
        // Wait for the widget to be ready before adding event listeners
        (window as any).plugSDK.onEvent((payload: any) => {
          if(payload.type === "ON_PLUG_WIDGET_READY") {
            // Initialize search agent after widget is ready
            (window as any).plugSDK.initSearchAgent();
            
            // Add keyboard shortcut for search agent
            document.addEventListener("keydown", function(event) {
              // Check if event.key is defined before accessing it
              if (event && event.key === "/") {
                event.preventDefault();
                (window as any).plugSDK.toggleSearchAgent();
              }
            });
          }
        }); 
      }
    }
  }
}

let observations = 0
let isInitialized = false

// BETTER INITIALIZATION: Only run once
const initialize = async () => {
  if (isInitialized) {
    return
  }
  isInitialized = true
  
  await render()
  setupMutationObserver()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize)
} else {
  // Use a small delay to ensure app router has finished initial render
  setTimeout(initialize, 50)
}

function setupMutationObserver() {
  console.log('DEBUG: Setting up mutation observer')
  
  new MutationObserver(async (mutations, observer) => {
    // LESS AGGRESSIVE: Only re-render in specific cases
    let shouldRender = false
    
    for (const mutation of mutations) {
      if (mutation.target instanceof HTMLElement) {
        const target = mutation.target
        
        // Only re-render if fern-header or fern-footer are added/removed
        if (target.id === 'fern-header' || target.id === 'fern-footer') {
          console.log(`DEBUG: ${target.id} changed, triggering re-render`)
          shouldRender = true
          break
        }
        
        // Check if fern-footer was added to DOM
        if (mutation.type === 'childList') {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node instanceof HTMLElement && node.id === 'fern-footer') {
              console.log('DEBUG: fern-footer added to DOM, triggering re-render')
              shouldRender = true
              break
            }
          }
        }
      }
    }
    
    if (shouldRender && observations < 3) {
      observations++
      console.log(`DEBUG: Re-rendering (${observations}/3)`)
      await render()
    } else if (observations >= 3) {
      console.log('DEBUG: Max observations reached, disconnecting observer')
      observer.disconnect()
    } else {
      console.log('DEBUG: DOM change detected but no re-render needed')
    }
  }).observe(document.body, { childList: true, subtree: true })
}