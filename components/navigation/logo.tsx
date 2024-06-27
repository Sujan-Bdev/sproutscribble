import React from 'react'
import logo from '@/public/logo.svg'
import Image from 'next/image'

export default function Logo() {
  return (
   <Image src={logo} alt='SproutScribbleLogo'/>
  )
}
