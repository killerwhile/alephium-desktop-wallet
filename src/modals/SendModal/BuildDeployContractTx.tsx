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

import { Address } from '../../contexts/addresses'
import { isAmountWithinRange } from '../../utils/transactions'
import {
  ModalContent,
  PartialTxData,
  SubmitOrCancel,
  useBuildTxCommon,
  useBytecode,
  useIssueTokenAmount
} from './utils'

export interface BuildDeployContractTxData {
  fromAddress: Address
  bytecode: string

  initialAttoAlphAmount?: string
  issueTokenAmount?: string
  gasAmount?: number
  gasPrice?: string
}

export interface BuildDeployContractTxProps {
  data: PartialTxData<BuildDeployContractTxData, 'fromAddress'>
  onSubmit: (data: BuildDeployContractTxData) => void
  onCancel: () => void
}

const BuildDeployContractTx = ({ data, onSubmit, onCancel }: BuildDeployContractTxProps) => {
  const [fromAddress, FromAddress, attoAlphAmount, AlphAmount, gasAmount, gasPrice, GasSettings, isCommonReady] =
    useBuildTxCommon(data.fromAddress, data.initialAttoAlphAmount, data.gasAmount, data.gasPrice)
  const [bytecode, Bytecode] = useBytecode(data.bytecode ?? '')
  const [issueTokenAmount, IssueTokenAmount] = useIssueTokenAmount(data.issueTokenAmount?.toString() ?? undefined)

  if (typeof fromAddress === 'undefined') {
    onCancel()
    return <></>
  }

  const isSubmitButtonActive =
    isCommonReady &&
    bytecode &&
    (!attoAlphAmount || isAmountWithinRange(BigInt(attoAlphAmount), fromAddress.availableBalance))

  return (
    <>
      <ModalContent>
        {FromAddress}
        {Bytecode}
        {AlphAmount}
        {IssueTokenAmount}
      </ModalContent>
      {GasSettings}
      <SubmitOrCancel
        onSubmit={() =>
          onSubmit({
            fromAddress: data.fromAddress,
            bytecode: bytecode,
            issueTokenAmount: issueTokenAmount,
            initialAttoAlphAmount: attoAlphAmount,
            gasAmount: gasAmount.parsed,
            gasPrice: gasPrice.parsed
          })
        }
        onCancel={onCancel}
        isSubmitButtonActive={isSubmitButtonActive}
      />
    </>
  )
}

export default BuildDeployContractTx
