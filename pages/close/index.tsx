import Button from 'components/button'
import React from 'react'
import css from './style.module.scss'
import { useRouter } from 'next/router'

const MeetEndScreen = () => {

  const router = useRouter()
  return (
    <section className={`row justify-content-center ${css.endScreen}`}>
        <h2>You left the meeting</h2>
        <Button onClick={() => router.replace('/')}>Back to Home</Button>
    </section>
  )
}

export default MeetEndScreen