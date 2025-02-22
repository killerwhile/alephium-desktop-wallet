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
import { X } from 'lucide-react'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import Button from '../components/Button'
import { Section } from '../components/PageComponents/PageContainers'
import PanelTitle, { TitleContainer } from '../components/PageComponents/PanelTitle'
import Scrollbar from '../components/Scrollbar'
import Spinner from '../components/Spinner'
import Tooltip from '../components/Tooltip'
import useFocusOnMount from '../hooks/useFocusOnMount'
import ModalContainer, { ModalBackdrop, ModalContainerProps } from './ModalContainer'

interface CenteredModalProps extends ModalContainerProps {
  title?: ReactNode
  subtitle?: string
  isLoading?: boolean
  header?: ReactNode
  narrow?: boolean
}

const CenteredModal: FC<CenteredModalProps> = ({
  title,
  subtitle,
  onClose,
  focusMode,
  isLoading,
  header,
  narrow = false,
  children
}) => {
  const { t } = useTranslation('App')
  const elRef = useFocusOnMount<HTMLSpanElement>()

  return (
    <ModalContainer onClose={onClose} focusMode={focusMode} hasPadding>
      <CenteredBox
        role="dialog"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        narrow={narrow}
      >
        <ModalHeader contrast={!!header}>
          <TitleRow>
            <PanelTitle smaller useLayoutId={false}>
              <span ref={elRef} tabIndex={0} role="heading">
                {title}
              </span>
              {subtitle && <ModalSubtitle>{subtitle}</ModalSubtitle>}
            </PanelTitle>
            <CloseButton aria-label={t`Close`} squared transparent onClick={onClose}>
              <X />
            </CloseButton>
          </TitleRow>
          {header && <ModalHeaderContent>{header}</ModalHeaderContent>}
        </ModalHeader>
        <Scrollbar translateContentSizeYToHolder>
          <ModalContent>{children}</ModalContent>
        </Scrollbar>
        {isLoading && (
          <>
            <ModalBackdrop light />
            <ModalLoadingSpinner>
              <Spinner />
            </ModalLoadingSpinner>
          </>
        )}
      </CenteredBox>
      <Tooltip />
    </ModalContainer>
  )
}

export default CenteredModal

export const HeaderContent = styled(Section)`
  flex: 0;
  margin-bottom: var(--spacing-4);
`

export const HeaderLogo = styled.div`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const CenteredBox = styled(motion.div)<{ narrow: boolean }>`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 100%;
  max-width: ${({ narrow }) => (narrow ? '380px' : '600px')};
  max-height: 95vh;
  box-shadow: ${({ theme }) => theme.shadow.tertiary};
  border-radius: var(--radius);
  background-color: ${({ theme }) => theme.bg.primary};
  z-index: 1;
  position: relative;
  overflow: hidden;

  ${TitleContainer} {
    flex: 1;
    margin: var(--spacing-3) var(--spacing-4) var(--spacing-3) var(--spacing-4);
  }
`

export const ModalHeader = styled.header<{ contrast?: boolean }>`
  margin-bottom: var(--spacing-3);

  ${({ contrast }) =>
    contrast &&
    css`
      background-color: ${({ theme }) => theme.bg.secondary};
      border-bottom: 1px solid ${({ theme }) => theme.border.secondary};
    `}
`

const ModalHeaderContent = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 45px;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
`

const CloseButton = styled(Button)`
  color: ${({ theme }) => theme.font.primary};
  margin-right: var(--spacing-2);
`

const ModalContent = styled.div`
  padding: 0 var(--spacing-4) var(--spacing-4) var(--spacing-4);
  width: 100%;
`

export const ModalFooterButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  padding: var(--spacing-3) var(--spacing-3) 0;
`

export const ModalFooterButton = ({ ...props }) => (
  <ModalFooterButtonStyled short {...props}>
    {props.children}
  </ModalFooterButtonStyled>
)

const ModalFooterButtonStyled = styled(Button)`
  min-width: 111px;
  height: 30px;
`

const ModalSubtitle = styled.div`
  color: ${({ theme }) => theme.font.secondary};
  font-size: 14px;
  margin-top: var(--spacing-1);
`

const ModalLoadingSpinner = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`
