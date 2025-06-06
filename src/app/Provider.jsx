"use client";
import React from 'react'
import Header from './_components/Header'
import Footer from './_components/Footer'
import {usePathname} from "next/navigation";

function Provider({children}) {
    const pathname = usePathname();

    return (
      <div className="min-h-screen flex flex-col">
          {!['/signin'].includes(pathname)?  <Header /> : <></>}
          <main className="flex-grow">
              {children}
          </main>
          {!['/signin'].includes(pathname)?   <Footer className="mb-0" /> : <></>}

      </div>
  )
}

export default Provider