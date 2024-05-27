'use client'

import { useEffect, useState, useRef } from 'react'
import {
  ComponentConfigContext,
  HeaderV30 as SharedHeader,
} from '@devrev/marketing-shared-components/dist/cjs'

import './header.css'

const Header = ({
  logo,
  links,
  actions,
  collapseOnScroll = true,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const html = document.getElementsByTagName('html')[0]
  const [theme, setTheme] = useState(html.getAttribute('class') || 'light') // Default to 'light' if no class is present

  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = html.getAttribute('class') || 'light'
      if (themeRef.current !== newTheme) {
        setTheme(newTheme)
      }
    })

    const config = { attributes: true, attributeFilter: ['class'] }
    observer.observe(html, config)
    return () => {
      observer.disconnect()
    }
  }, [html])

  return (
    <div>
      <ComponentConfigContext.Provider
        value={{
          origin: 'https://developer.devrev.ai',
        }}>
        <SharedHeader
          logo={logo}
          items={links}
          actions={actions}
          version={theme === 'dark' ? 'dark' : 'light'} // Ensure the theme is correctly reflected
          collapseOnScroll={collapseOnScroll}
          wrapperClassName="custom-header"
        />
      </ComponentConfigContext.Provider>
    </div>
  )
}

export default Header
