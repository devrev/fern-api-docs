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
  console.log('Starting render function')
  /*
   * This is a where we try to make async data call.
   */
  const data = await getPageData()
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

  if (!document.getElementById('sidenav-header-wrapper')) {
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
      
      // Remove display style forcing for production
      // fernContentWrapper.style.display = 'block'
      // devrevContentWrapper.style.display = 'block'
      
      // Pass header data to the component
      headerRoot.render(
        React.createElement(Header, {
          version: theme === 'dark' ? 'light' : 'dark',
          ...data.header
        })
      )
      console.log('Custom header rendered')
    } else {
      // Update the header with current theme if it already exists
      console.log('Updating existing header with current theme')
      const headerRoot = ReactDOM.createRoot(devrevContentWrapper)
      headerRoot.render(
        React.createElement(Header, {
          version: theme === 'dark' ? 'light' : 'dark',
          ...data.header
        })
      )
    }
    
    // Make sure the header is visible
    console.log('Making header visible')
    existingFernHeader.style.display = 'block'
  } else {
    // If Fern header doesn't exist yet, create it
    console.log('Fern header not found, creating it')
    const newHeader = document.createElement('div')
    newHeader.setAttribute('id', FERN_HEADER_CONTAINER_ID)
    document.body.insertBefore(newHeader, document.body.firstChild)
    
    // Create DevRev content wrapper
    const devrevContentWrapper = document.createElement('div')
    devrevContentWrapper.setAttribute('id', DEVREV_CONTENT_WRAPPER_ID)
    newHeader.appendChild(devrevContentWrapper)
    
    // Render our custom header
    console.log('Rendering custom header in new element')
    const headerRoot = ReactDOM.createRoot(devrevContentWrapper)
    headerRoot.render(
      React.createElement(Header, {
        version: theme === 'dark' ? 'light' : 'dark',
        ...data.header
      })
    )
    console.log('Custom header created and rendered')
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
  console.log('Render function completed')
}

// For Next.js App Router compatibility
const initApp = () => {
  console.log('Initializing app')
  if (typeof window !== 'undefined') {
    console.log('Browser environment detected')
    
    // Function to attempt rendering multiple times
    const attemptRender = (attempts = 0, maxAttempts = 5) => {
      console.log(`Render attempt ${attempts + 1} of ${maxAttempts}`)
      render().then(() => {
        // Check if header and footer are properly rendered
        const header = document.getElementById(DEVREV_CONTENT_WRAPPER_ID)
        const footer = document.getElementById('fern-footer')
        const headerRendered = header && header.children.length > 0
        const footerRendered = footer && footer.children.length > 0
        
        console.log('Render check:', {
          headerRendered: headerRendered ? 'yes' : 'no',
          footerRendered: footerRendered ? 'yes' : 'no'
        })
        
        // If not rendered properly and we haven't reached max attempts, try again
        if ((!headerRendered || !footerRendered) && attempts < maxAttempts - 1) {
          console.log('Components not fully rendered, trying again in 500ms')
          setTimeout(() => attemptRender(attempts + 1, maxAttempts), 500)
        } else if (attempts >= maxAttempts - 1) {
          console.log('Max render attempts reached')
        } else {
          console.log('Components successfully rendered')
        }
      })
    }
    
    // Check if the DOM is already loaded
    if (document.readyState === 'loading') {
      console.log('DOM still loading, adding DOMContentLoaded listener')
      document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded event fired')
        attemptRender()
      })
    } else {
      // DOM already loaded, render immediately
      console.log('DOM already loaded, rendering immediately')
      attemptRender()
    }
    
    // Also add a window load event to ensure everything is rendered
    window.addEventListener('load', () => {
      console.log('Window load event fired')
      render()
    })
  } else {
    console.log('Not in browser environment, skipping initialization')
  }
}

// Initialize the app
console.log('Starting application initialization')
initApp()

