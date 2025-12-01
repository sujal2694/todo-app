import React, { useContext, useState } from 'react'
import LoginPage from './components/LoginPage'
import Navbar from './components/Navbar'
import ProgressGraph from './components/ProgressGraph'
import AddTodo from './components/AddTodo'
import { Toaster } from 'react-hot-toast'
import { Context } from './context/context'
import Footer from './components/Footer'

const App = () => {
  const { token, loading, setLoading } = useContext(Context);
  const spinner = document.getElementById('spinner');
  if (spinner) {
    setTimeout(() => {
      spinner.style.display = 'none'
      setLoading(false)
    }, 3000);
  }
  return (
    <>
      <Toaster />
      {!loading && !token
        ? <LoginPage />
        : <>
          <Navbar />
          <AddTodo />
          <ProgressGraph />
          <Footer/>
        </>}
    </>
  )
}

export default App
