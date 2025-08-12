import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Products from './components/Products';

function App() {

  return (
    <>
      <div className='container'>
      <div className='header'>Welcome User!</div>
        <Products />
      </div>
    </>
  )
}

export default App
