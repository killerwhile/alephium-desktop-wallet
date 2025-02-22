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

import { createHash } from 'crypto'
import dayjs from 'dayjs'

// ===================== //
// ==== RUNNING ENV ==== //
// ===================== //

export const isElectron = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  return userAgent.indexOf(' electron/') > -1
}

// ================= //
// ===== LINKS ===== //
// ================= //

export const openInWebBrowser = (url: string) => {
  if (url) {
    const newWindow = window.open(`${url.replace(/([^:]\/)\/+/g, '$1')}`, '_blank', 'noopener,noreferrer')
    if (newWindow) {
      newWindow.opener = null
      newWindow.focus()
    }
  }
}

export const stringToDoubleSHA256HexString = (data: string): string => {
  let hash

  hash = createHash('sha512')
  hash.update(data)
  const first = hash.digest()

  hash = createHash('sha512')
  hash.update(first)
  return hash.digest('hex')
}

export const extractErrorMsg = (e: unknown): string => {
  let error: string
  if (typeof e === 'string') {
    error = e
  } else if (e instanceof Error) {
    error = e.message
  } else {
    error = 'Unknown internal error'
  }
  return error
}

export const formatDateForDisplay = (date: Date | number): string => dayjs(date).format('YYYY-MM-DD HH:mm')
