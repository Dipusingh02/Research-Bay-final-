import React from 'react';
import Navbar from '../Navbar/Navbar';
import "./home.css"
import Search from '../search/Search';

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className='bgcolor'>
      <Search />
    </div></div>
  )
}

export default Home;
