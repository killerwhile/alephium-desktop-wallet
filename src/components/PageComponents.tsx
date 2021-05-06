import { motion, MotionStyle, Variants } from 'framer-motion'
import React, { FC } from 'react'
import styled from 'styled-components'
import { ArrowLeft } from 'lucide-react'

export const MainContainer = styled.div`
  height: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 0 30px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`

export const PageContainer = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const contentVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  shown: (apparitionDelay = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      when: 'beforeChildren',
      delay: apparitionDelay,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }),
  out: {
    opacity: 0,
    x: -20
  }
}

interface ContentProps {
  apparitionDelay?: number
  style?: MotionStyle
  className?: string
}

export const SectionContent: React.FC<ContentProps> = ({ children, apparitionDelay, style, className }) => {
  return (
    <StyledContent
      variants={contentVariants}
      initial="hidden"
      animate="shown"
      custom={apparitionDelay}
      style={style}
      className={className}
    >
      {children}
    </StyledContent>
  )
}

export const StyledContent = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;

  &:not(:last-child) {
    margin-bottom: 25px;
  }
`

interface SectionTitleProps {
  color?: 'primary' | 'contrast'
  onBackButtonPress?: () => void
  smaller?: boolean
}

export const FooterActions = styled(SectionContent)`
  flex: 0;
  margin-bottom: 5vh;
`

// ===========
// == Title ==
// ===========

export const PageTitle: FC<SectionTitleProps> = ({ color = 'primary', children, onBackButtonPress, smaller }) => {
  return (
    <TitleContainer>
      {onBackButtonPress && <BackArrow onClick={onBackButtonPress} strokeWidth={3} />}
      <H1 color={color} layoutId="sectionTitle" smaller={smaller}>
        {children}
      </H1>
    </TitleContainer>
  )
}

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5vh;
  margin-bottom: 3vh;
`

const BackArrow = styled(ArrowLeft)`
  height: 47px;
  width: 20px;
  margin-right: 20px;
  cursor: pointer;
`

const H1 = styled(motion.h1)<{ color: string; smaller?: boolean }>`
  flex: 1;
  margin: 0;
  color: ${({ theme, color }) => (color === 'primary' ? theme.font.primary : theme.font.contrast)};
  font-size: ${({ smaller }) => (smaller ? '2.0rem' : 'auto')};
`

// ===========
// == Modal ==
// ===========

export const Modal: React.FC = ({ children }) => {
  return (
    <ModalContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <StyledModal
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {children}
      </StyledModal>
    </ModalContainer>
  )
}

const ModalContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  background-color: rgba(0, 0, 0, 0.15);
`

const StyledModal = styled(motion.div)`
  margin: auto 20px;
  width: 100%;
  padding: 30px 20px;
  box-shadow: 0 30px 30px rgba(0, 0, 0, 0.15);
  border: 2px solid ${({ theme }) => theme.border.primary};
  border-radius: 14px;
  background-color: ${({ theme }) => theme.bg.primary};

  ${TitleContainer} {
    margin-top: 0;
  }
`
