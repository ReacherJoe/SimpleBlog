import React from 'react'
import Navbar from './design/Navbar';
import { Route, Routes } from 'react-router-dom';
import Post from './design/Post';

function App() {
  return (
    <div>
      <Routes>
          <Route path='/' element= {<Navbar/>}></Route>
          <Route  path='/post' element= {<Post />}></Route>
          
      </Routes>
  
    </div>
  )
}
export default App;
