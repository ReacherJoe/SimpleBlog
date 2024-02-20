import React from 'react'
import Navbar from './design/Navbar';
import { Route, Routes } from 'react-router-dom';
import Post from './design/Post';
import Posts from './design/Posts';

function App() {
  return (
    <>
                                                                             
      <Routes>

          <Route path='/' element= {<Navbar/>}></Route>
          <Route  path='/post' element= {<Post />}></Route>
          <Route path='/posts/:id' element= {<Posts/>}></Route>         
      </Routes>
      </>
    
  )
}
export default App;
