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

// Used as reference: https://github.com/xobotyi/react-scrollbars-custom/issues/46#issuecomment-897506147

import React, { CSSProperties, useCallback, useRef, useState, WheelEvent } from 'react'
import Scrollbar, { ScrollbarProps } from 'react-scrollbars-custom'
import { ElementPropsWithElementRef, ScrollState } from 'react-scrollbars-custom/dist/types/types'
import { useTheme } from 'styled-components'

import { ScrollContextProvider } from '../contexts/scroll'

const paddingRight = '6px'
const width = `calc(6px + ${paddingRight})`

const paddingTop = '6px'
const height = `calc(6px + ${paddingTop})`

const createScrollbarPiece = (regular: CSSProperties, additional?: CSSProperties, useAdditionalStyling?: boolean) => ({
  renderer: ({ elementRef, style, ...restProps }: ElementPropsWithElementRef) => {
    // The only way to know the scrollbar is being rendered is if bottom > 0...
    const overflowStyle = {
      overflow:
        (restProps.key === 'ScrollbarsCustom-Wrapper' && style?.bottom && style.bottom > 0) ||
        (style?.right && style.right > 0)
          ? 'hidden'
          : 'unset'
    }

    return (
      <div
        {...restProps}
        ref={elementRef}
        style={{ ...style, ...regular, ...overflowStyle, ...(useAdditionalStyling && additional) }}
      />
    )
  }
})

interface ScrollbarCustomProps extends ScrollbarProps {
  // When children have dynamic sizes, set this to true (like the AddressSummaryCards in OverviewPage/Header).
  isDynamic?: boolean
}

const ScrollbarCustom = ({ isDynamic, noScrollX, ...props }: ScrollbarCustomProps) => {
  const theme = useTheme()
  const [scroll, setScroll] = useState<ScrollState>()
  const [isScrolling, setIsScrolling] = useState(false)
  const [isMouseOver, setIsMouseOver] = useState(false)
  const scrollerElemRef = useRef<HTMLDivElement | null>(null)

  const isShow = isScrolling || isMouseOver

  const onScrollStart = () => setIsScrolling(true)
  const onScrollStop = () => setIsScrolling(false)
  const onMouseEnter = () => setIsMouseOver(true)
  const onMouseLeave = () => setIsMouseOver(false)

  const onWheelY = useCallback(
    (e: WheelEvent) => {
      if (!scrollerElemRef || !scrollerElemRef.current) return

      scrollerElemRef.current.scrollTop += e.deltaY
    },
    [scrollerElemRef]
  )

  const transparencyStyle = {
    backgroundColor: 'transparent',
    opacity: isShow ? 1 : 0,
    transition: 'opacity 0.4s ease-in-out'
  }

  const trackXProps = createScrollbarPiece({ height, paddingTop }, transparencyStyle, true)

  const trackYProps = {
    renderer: ({ elementRef, style, ...restProps }: ElementPropsWithElementRef) => (
      <div
        {...restProps}
        ref={elementRef}
        onWheel={onWheelY}
        style={{ ...style, width, paddingRight, ...transparencyStyle }}
      />
    )
  }

  const thumbProps = createScrollbarPiece({ backgroundColor: theme.font.tertiary })

  const rendererProps = createScrollbarPiece(
    {},
    { position: 'relative' as const, width: 'unset', height: 'unset', overflow: 'hidden' },
    isDynamic
  ).renderer

  const wrapperProps = createScrollbarPiece(
    { right: 0 },
    { position: 'relative' as const, height: '100%', top: !noScrollX ? '-16px' : '' },
    isDynamic
  )

  const scrollerProps = {
    renderer: ({ elementRef, style, ...restProps }: ElementPropsWithElementRef) => {
      const onElementRef = (element: HTMLDivElement | null) => {
        if (!elementRef) return

        scrollerElemRef.current = element
        elementRef(element)
      }

      return (
        <div
          {...restProps}
          ref={onElementRef}
          style={{
            ...style,
            ...(isDynamic && { position: 'relative' as const, height: '100%', top: !noScrollX ? '16px' : '' })
          }}
        />
      )
    }
  }

  const contentProps = createScrollbarPiece(
    { display: 'block', height: '100%' },
    { position: 'unset' as const, height: '100%' },
    isDynamic
  )

  // react-scrollbars-custom has a type issue where you can't just spread props
  // onto the component. That's why needed props are added as necessary.
  return (
    <Scrollbar
      elementRef={props.elementRef}
      renderer={rendererProps}
      wrapperProps={wrapperProps}
      contentProps={contentProps}
      scrollerProps={scrollerProps}
      trackXProps={trackXProps}
      trackYProps={trackYProps}
      thumbXProps={thumbProps}
      thumbYProps={thumbProps}
      onScrollStart={onScrollStart}
      onScrollStop={onScrollStop}
      onUpdate={(s: ScrollState) => setScroll(s)}
      scrollDetectionThreshold={500} // ms
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      momentum
      noScrollY={props.noScrollY}
      noScrollX={noScrollX}
      translateContentSizeYToHolder={props.translateContentSizeYToHolder}
    >
      <ScrollContextProvider value={{ scroll }}>{props.children}</ScrollContextProvider>
    </Scrollbar>
  )
}

export default ScrollbarCustom
