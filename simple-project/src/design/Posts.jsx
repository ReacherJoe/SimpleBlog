import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Card } from 'antd';

const { Paragraph } = Typography;

const FullPost = () => {
  const { id } = useParams();
  const [fullText, setFullText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/data/${id}`);
        setFullText(response.data.text);
      } catch (error) {
        console.error('Error fetching full post:', error);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      <Card  style={{ width: '300px', padding: '20px', flex: '1 1 300px' }}>
      <Paragraph>{fullText}</Paragraph>
      </Card>
      
    </div>
  );
};

export default FullPost;
