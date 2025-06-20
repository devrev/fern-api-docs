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

const render = async () => {
  if (typeof window === 'undefined') {
    return
  }

  const data = await getPageData()

  const sidenav = document.querySelector('button.fern-search-bar')
    ?.parentElement as HTMLElement

  const theme = document.getElementsByTagName('html')[0].getAttribute('class')

  if (!document.getElementById('sidenav-header-wrapper') && sidenav) {
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

    // Updated to createRoot - callback handling changed
    const headerRoot = ReactDOM.createRoot(devrevContentWrapper)
    headerRoot.render(
      React.createElement(Header, {
        ...data.header,
        version: theme == 'dark' ? 'light' : 'dark',
      })
    )
    
    // Make header visible immediately
    setTimeout(() => {
      const header = document.getElementById(FERN_HEADER_CONTAINER_ID)
      if (header) header.style.display = 'block'
    }, 0)
  }

  const footerElement = document.getElementById('fern-footer')
  if (footerElement) {
    const footerRoot = ReactDOM.createRoot(footerElement)
    footerRoot.render(React.createElement(Footer, { ...data.footer }))
    
    // Make footer visible immediately
    setTimeout(() => {
      const footer = document.getElementById('fern-footer')
      if (footer) footer.style.display = 'block'
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await render()
    setupMutationObserver()
  })
} else {
  // DOM is already ready, run immediately
  render().then(() => {
    setupMutationObserver()
  })
}

function setupMutationObserver() {
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
}