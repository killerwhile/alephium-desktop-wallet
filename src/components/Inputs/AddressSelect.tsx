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

import { AnimatePresence } from 'framer-motion'
import { MoreVertical } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Address } from '../../contexts/addresses'
import CenteredModal, { ModalFooterButton, ModalFooterButtons } from '../../modals/CenteredModal'
import { sortAddressList } from '../../utils/addresses'
import AddressBadge from '../AddressBadge'
import AddressEllipsed from '../AddressEllipsed'
import Amount from '../Amount'
import InfoBox from '../InfoBox'
import InputArea from '../Inputs/InputArea'
import { sectionChildrenVariants } from '../PageComponents/PageContainers'
import { inputDefaultStyle, InputLabel, InputProps } from '.'
import { MoreIcon, SelectContainer } from './Select'

interface AddressSelectProps {
  id: string
  title: string
  options: Address[]
  onAddressChange: (address: Address) => void
  defaultAddress?: Address
  label?: string
  disabled?: boolean
  hideEmptyAvailableBalance?: boolean
  className?: string
}

function AddressSelect({
  options,
  title,
  label,
  disabled,
  defaultAddress,
  className,
  id,
  onAddressChange,
  hideEmptyAvailableBalance
}: AddressSelectProps) {
  const [canBeAnimated, setCanBeAnimated] = useState(false)
  const [address, setAddress] = useState(defaultAddress)
  const [isAddressSelectModalOpen, setIsAddressSelectModalOpen] = useState(false)

  useEffect(() => {
    if (!address && options.length === 1) {
      setAddress(options[0])
    }
  }, [options, setAddress, address])

  useEffect(() => {
    if (address && address.hash !== defaultAddress?.hash) {
      onAddressChange(address)
    }
  }, [address, defaultAddress, onAddressChange])

  if (!address) return null

  return (
    <>
      <AddressSelectContainer
        variants={sectionChildrenVariants}
        animate={canBeAnimated ? (!disabled ? 'shown' : 'disabled') : false}
        onAnimationComplete={() => setCanBeAnimated(true)}
        custom={disabled}
        onInput={() => !disabled && setIsAddressSelectModalOpen(true)}
        disabled={!!disabled}
      >
        <InputLabel inputHasValue={!!address} htmlFor={id}>
          {label}
        </InputLabel>
        {!disabled && (
          <MoreIcon>
            <MoreVertical />
          </MoreIcon>
        )}
        <ClickableInputStyled type="button" className={className} disabled={disabled} id={id}>
          <AddressBadge address={address} truncate showHashWhenNoLabel withBorders />
          {!!address.settings.label && <AddressEllipsed addressHash={address.hash} />}
        </ClickableInputStyled>
      </AddressSelectContainer>
      <AnimatePresence>
        {isAddressSelectModalOpen && (
          <AddressSelectModal
            options={options}
            selectedOption={address}
            setAddress={setAddress}
            title={title}
            hideEmptyAvailableBalance={hideEmptyAvailableBalance}
            onClose={() => {
              setIsAddressSelectModalOpen(false)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

const AddressSelectModal = ({
  options,
  selectedOption,
  setAddress,
  onClose,
  title,
  hideEmptyAvailableBalance
}: {
  options: Address[]
  selectedOption?: Address
  setAddress: (address: Address) => void | undefined
  onClose: () => void
  title: string
  hideEmptyAvailableBalance?: boolean
}) => {
  const { t } = useTranslation('App')
  const [selectedAddress, setSelectedAddress] = useState(selectedOption)
  const displayedOptions = hideEmptyAvailableBalance
    ? options.filter((address) => address.availableBalance > 0)
    : options
  const noAddressesWithAvailableBalance = hideEmptyAvailableBalance && displayedOptions.length === 0

  const onOptionAddressSelect = (address: Address) => {
    setAddress(address)
    onClose()
  }

  return (
    <CenteredModal title={t`Addresses`} onClose={onClose}>
      <Description>{title}</Description>
      <div>
        {sortAddressList(displayedOptions).map((address) => (
          <AddressOption key={address.hash} onInput={() => setSelectedAddress(address)}>
            <Circle filled={selectedAddress?.hash === address.hash} />
            <AddressBadgeStyled address={address} showHashWhenNoLabel />
            <AmountStyled value={BigInt(address.details.balance)} fadeDecimals />
          </AddressOption>
        ))}
        {noAddressesWithAvailableBalance && (
          <InfoBox
            importance="accent"
            text={t`There are no addresses with available balance. Please, send some funds to one of your addresses, and try again.`}
          />
        )}
      </div>
      <ModalFooterButtons>
        <ModalFooterButton secondary onClick={onClose}>
          {t`Cancel`}
        </ModalFooterButton>
        <ModalFooterButton
          onClick={() => selectedAddress && onOptionAddressSelect(selectedAddress)}
          disabled={!selectedAddress || noAddressesWithAvailableBalance}
        >
          {t`Select`}
        </ModalFooterButton>
      </ModalFooterButtons>
    </CenteredModal>
  )
}

export default AddressSelect

const AddressSelectContainer = styled(SelectContainer)<{ disabled: boolean }>`
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
    `}
`

const Circle = styled.div<{ filled: boolean }>`
  background-color: ${({ filled, theme }) => (filled ? theme.global.accent : theme.bg.secondary)};
  height: 15px;
  width: 15px;
  border-radius: var(--radius-full);
  border: 1px solid ${({ theme }) => theme.border.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    ${({ filled }) =>
      filled &&
      css`
        content: '';
        display: block;
        height: 7px;
        width: 7px;
        background-color: var(--color-white);
        border-radius: var(--radius-full);
      `}
  }
`

const Description = styled.div`
  margin-bottom: var(--spacing-5);
  color: ${({ theme }) => theme.font.secondary};
`

const AddressOption = styled(InputArea)`
  display: flex;
  gap: 12px;
  align-items: center;

  padding: var(--spacing-3);
  background-color: ${({ theme }) => theme.bg.primary};
  color: inherit;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.bg.secondary};
  }
`

const ClickableInput = styled.div<InputProps>`
  ${({ isValid }) => inputDefaultStyle(isValid)}
  display: flex;
  align-items: center;
  padding-right: 50px;
`

const ClickableInputStyled = styled(ClickableInput)`
  gap: var(--spacing-2);
`

const AmountStyled = styled(Amount)`
  flex: 1;
  text-align: right;
`

const AddressBadgeStyled = styled(AddressBadge)`
  width: auto;
`
