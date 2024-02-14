import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Card, Typography, Button, Modal, Form, Input } from 'antd';

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

  const renderText = (text) => {
    const words = text.split(' ');
    if (words.length > 15) {
      return (
        <>
          {words.slice(0, 15).join(' ')}
          <span style={{ display: 'none' }}>{words.slice(15).join(' ')}</span>
          <Button type="link" onClick={() => handleSeeMore(words)}>See More</Button>
        </>
      );
    }
    return text;
  };

  const handleSeeMore = (words) => {
    const hiddenText = words.slice(15).join(' ');
    Modal.info({
      title: 'More Text',
      content: <Text>{hiddenText}</Text>,
    });
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      <h1 style={{ width: '100%' }}>Post</h1>
      {data.map(item => (
        <Card key={item.id} style={{ width: '300px', padding: '20px', flex: '1 1 300px' }}>
          <img src={item.images} alt="Image" style={{ width: '100%' }} />
          <Title level={4}>{item.title}</Title>
          <Text>{renderText(item.text)}</Text>
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
  );
};

export default PostDetail;
