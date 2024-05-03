import React, { useEffect } from 'react'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export const ThemeSwitch = () => {
  const [selected, setSelected] = React.useState('public')

  useEffect(() => {
    const beta = window.location.pathname.split('/').includes('beta')
    setSelected(beta ? 'beta' : 'public')
  })

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Public</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.RadioGroup value={selected} onValueChange={setSelected}>
            <DropdownMenu.RadioItem value="public">
              <a className="fern-dropdown-item" href="/about/for-developers">
                <DropdownMenu.ItemIndicator className="fern-dropdown-item-indicator">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"></path>
                  </svg>
                </DropdownMenu.ItemIndicator>
                <span>
                  <span>Public</span>
                </span>
              </a>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="beta">
              <a
                className="fern-dropdown-item"
                href="/beta/about/for-developers">
                <DropdownMenu.ItemIndicator className="fern-dropdown-item-indicator">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"></path>
                  </svg>
                </DropdownMenu.ItemIndicator>
                <span>
                  <span>Beta</span>
                </span>
              </a>
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
