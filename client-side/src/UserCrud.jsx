

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"
const UserCrud = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: '', email: '', age: '' });
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {

    axios.get('http://localhost:5000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('ERROR', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleCreate = () => {
    axios.post('http://localhost:5000/users', user)
      .then(response => {
        setUsers([...users, response.data]);
        setUser({ name: '', email: '', age: '' });
      })
      .catch(error => {
        console.error('Error', error);
      });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/users/${currentId}`, user)
      .then(response => {
        const updatedUsers = users.map(u => u._id === currentId ? response.data : u);
        setUsers(updatedUsers);
        setEditing(false);
        setUser({ name: '', email: '', age: '' });
      })
      .catch(error => {
        console.error('Error', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user._id !== id));
      })
      .catch(error => {
        console.error('Error', error);
      });
  };

  const handleEdit = (id) => {
    const userToEdit = users.find(user => user._id === id);
    setUser(userToEdit);
    setEditing(true);
    setCurrentId(id);
  };

  return (
    <div>
      <h1>CRUD OPERATION</h1>

      <div>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="number"
          name="age"
          value={user.age}
          onChange={handleChange}
          placeholder="Age"
        />
        {editing ? (
          <button onClick={handleUpdate}>Update User</button>
        ) : (
          <button onClick={handleCreate}>Create User</button>
        )}
      </div>


      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <span>{user.name} - {user.email} - {user.age}</span>
            <button onClick={() => handleEdit(user._id)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserCrud;
