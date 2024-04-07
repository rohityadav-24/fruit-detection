import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <>
      <div>MAIN PAGE</div>
      <Link href="/admin">
        Admin
      </Link>
    </>
  )
}

export default Page