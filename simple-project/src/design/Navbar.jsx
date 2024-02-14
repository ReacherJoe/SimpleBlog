import React from 'react';
import { Layout, Button } from 'antd';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import PostDetail from './ PostDetail';

const { Header } = Layout;

const Navbar = () => {
  return (
    <>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Simple Blog
          </span>
        </div>
        {/* Use Link instead of anchor tag */}
        <Button type="primary">
          <Link to="/post">Create Post</Link>
        </Button>
      </Header>
      <PostDetail />
    </>
  );
};

export default Navbar;
