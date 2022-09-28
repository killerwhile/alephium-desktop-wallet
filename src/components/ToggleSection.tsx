/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import styled from 'styled-components'

import Toggle from './Inputs/Toggle'

interface ToggleSectionProps {
  title: string
  children: ReactNode
  onClick?: (b: boolean) => void
  className?: string
}

const ToggleSection = ({ title, onClick = () => null, children, className }: ToggleSectionProps) => {
  const [isShown, setIsShown] = useState(false)

  const handleToggle = () => {
    setIsShown(!isShown)
    onClick(isShown)
  }

  return (
    <div className={className}>
      <CellControl>
        {title}
        <Toggle onToggle={handleToggle} label={title} toggled={isShown} />
      </CellControl>
      <CellChildren
        animate={{
          height: isShown ? 'auto' : 0,
          opacity: isShown ? 1 : 0,
          visibility: isShown ? 'visible' : 'hidden'
        }}
        transition={{ duration: 0.2 }}
      >
        <CellChildrenInner>{children}</CellChildrenInner>
      </CellChildren>
    </div>
  )
}

export default styled(ToggleSection)`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bg.accent};
  border-radius: var(--radius-medium);
  padding-bottom: 16px;
`

const CellControl = styled.div`
  justify-content: space-between;
  flex-direction: row;
  display: flex;
  align-items: center;
  font-weight: 400;
  padding: 16px 21px 0 21px;
`

const CellChildren = styled(motion.div)`
  overflow: hidden;
  height: 0;
  opacity: 0;
  visibility: hidden;
`

const CellChildrenInner = styled.div`
  border-top: 1px solid ${({ theme }) => theme.bg.primary};
  margin-top: 16px;
  padding: 16px 21px 0 21px;
`