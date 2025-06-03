import React from 'react'
import Header from './_components/Header'
import Footer from './_components/Footer'

function Provider({children}) {
  return (
      <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
              {children}
          </main>
          <Footer className="mb-0" />
      </div>
  )
}

export default Provider