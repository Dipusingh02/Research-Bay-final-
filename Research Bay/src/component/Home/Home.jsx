import React from 'react';
import Navbar from '../Navbar/Navbar';
import "./home.css"
import Search from '../search/Search';
import Footer from '../footer/Footer';

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className='bgcolor' id='wh'>
      <br />
      <Search />
    </div>
    <Footer />
    </div>
  )
}

export default Home;
