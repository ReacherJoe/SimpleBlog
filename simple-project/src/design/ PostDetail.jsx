import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Card, Typography, Button, Modal, Form, Input } from 'antd';
import SeeMore from './SeeMore';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PostDetail = () => {
  const [data, setData] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState(null);
  const [updateForm] = Form.useForm();
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:8080/data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleDelete = (itemId) => {
    setDeleteItemId(itemId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:8080/api/data/${deleteItemId}`)
      .then(() => {
        fetchData();
        setDeleteModalOpen(false);
      })
      .catch(error => {
        console.error('Error deleting item:', error);
        setDeleteModalOpen(false);
      });
  };

  const handleUpdate = (item) => {
    setUpdateItem(item);
    setUpdateModalOpen(true);
    updateForm.setFieldsValue({
      title: item.title,
      text: item.text
    });
  };

  const handleUpdateSubmit = () => {
    updateForm.validateFields()
      .then(values => {
        axios.put(`http://localhost:8080/api/data/${updateItem.id}`, values)
          .then(() => {
            fetchData();
            setUpdateModalOpen(false);
          })
          .catch(error => {
            console.error('Error updating item:', error);
            setUpdateModalOpen(false);
          });
      })
      .catch(errorInfo => {
        console.error('Update form validation failed:', errorInfo);
      });
  };
  
  const handleSeeMoreClick = (postId) => {
    
    window.location.href = `/posts/${postId}`;
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ paddingLeft: '600px' }}>Post</h1>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {data.map(item => (
          <Card key={item.id} style={{ width: '300px', padding: '20px', flex: '1 1 300px' }}>
            <img src={item.images} alt="Image" style={{ width: '100%' }} />
            <Title level={4}>{item.title}</Title>
            <SeeMore text={item.text} postId={item.id} onSeeMoreClick={() => handleSeeMoreClick(item.id)} />
            <div style={{ marginTop: '10px' }}>
              <Button type="primary" onClick={() => handleUpdate(item)}>Update</Button>
              <Button type="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        <Modal
          title="Confirm Delete"
          open={deleteModalOpen}
          onOk={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        >
          <p>Are you sure you want to delete this item?</p>
        </Modal>
        <Modal
          title="Update Post"
          open={updateModalOpen}
          onCancel={() => setUpdateModalOpen(false)}
          onOk={handleUpdateSubmit}
        >
          <Form form={updateForm}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter the title' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Text"
              name="text"
              rules={[{ required: true, message: 'Please enter the text' }]}
            >
              <TextArea />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default PostDetail;
