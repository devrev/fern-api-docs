'use client'

import {
  ComponentConfigContext,
  HeaderV30 as SharedHeader,
} from '@devrev/marketing-shared-components/dist/cjs'

const Header = ({
  logo,
  links,
  actions,
  version,
  collapseOnScroll = true,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  return (
    <div>
      <ComponentConfigContext.Provider
        value={{
          origin: 'https://api.docs.devrev.ai',
        }}>
        <SharedHeader
          logo={logo}
          items={links}
          actions={actions}
          version={version}
          collapseOnScroll={collapseOnScroll}
        />
      </ComponentConfigContext.Provider>
    </div>
  )
}

export default Header
