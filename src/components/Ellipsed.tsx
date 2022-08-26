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

import { MutableRefObject, useLayoutEffect, useRef, useState } from 'react'

const style = { fontFamily: 'monospace', overflow: 'hidden' }

const createHandleResize =
  (
    el: MutableRefObject<HTMLDivElement | null>,
    charWidth: MutableRefObject<number | undefined>,
    text: string,
    setText: (t: string) => void
  ) =>
  () => {
    if (el?.current === null) return

    if (charWidth?.current === undefined) {
      charWidth.current = el.current.scrollWidth / text.length
    }

    const visibleChars = Math.floor(el.current.getBoundingClientRect().width / charWidth.current)
    const half = (visibleChars - 3) / 2
    setText(text.slice(0, half) + '...' + text.slice(-half))
  }

const createLayoutEffectHandler = (handleResize: () => void) => () => {
  handleResize()

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}

interface EllipsedProps {
  text: string
}

const Ellipsed = ({ text }: EllipsedProps) => {
  const el = useRef<HTMLDivElement | null>(null)
  const charWidth = useRef<number>()
  const [_text, setText] = useState(text)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(createLayoutEffectHandler(createHandleResize(el, charWidth, text, setText)), [])

  return (
    <div ref={el} style={style}>
      {_text}
    </div>
  )
}

export default Ellipsed