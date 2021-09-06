import React, {
  useState,
  useEffect,
} from 'react';

import EmployeesAPI from '../../packages/GeofixAPI/employees';

let SearchUser = (props) => {
  let {
    onClick: onClickFun,
    onSelectUser,
  } = props;
  let [userKeywords, setUserKeywords] = useState('');
  let [userOptions, setUserOptions] = useState([]);

  let onChangeKeywords = (e) => {
    e.preventDefault();
    let val = e.target.value;
    setUserKeywords(val);

    EmployeesAPI.getEmployeesByKeywords(val)
      .then(data => {
        console.log(data);
        setUserOptions(data || []);
      })
      .catch(err => {
        console.error(err);
      })
  }
  return (
    <div
      style={{
        position: "relative",
        width: "15 em",
      }}
    >
      <input
        type="text"
        placeholder="search user..."
        value={userKeywords}
        onChange={onChangeKeywords}
      />
      <div
        style={{
          position: "absolute",
          top: '100%',
          backgroundColor: 'white',
          borderColor: '#1F1F1F',
        }}
      >
        {userOptions.map((item, idx) => (
          <p
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              onSelectUser && onSelectUser(item);
              onClickFun && onClickFun(e);
              setUserOptions([]);
              setUserKeywords('');
            }}
          >
            {item.username}
          </p>
        ))}
      </div>
    </div>
  )
}

export default SearchUser;
