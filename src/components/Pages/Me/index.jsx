import React from 'react';
import { useSelector } from 'react-redux';
import { getUserData } from '../../../store/user';

const Home = () => {
  const userData = useSelector(getUserData);

  return (
    <div>
      <ul>
        <li>Name: {userData.userName}</li>
        <li>Email: {userData.email}</li>
      </ul>
    </div>
  );
};

export default Home;