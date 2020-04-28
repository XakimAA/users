import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, FormControl } from '@material-ui/core';
import { Table, Button } from 'xsolla-uikit';
import Pagination from 'xsolla-uikit/lib/pagination'; //отсутствует в общем списке

import './userlist.css';
import { Service } from '../../Service';
const service = new Service();

const columns = [
  {
    id: 'user_id',
    name: 'ID',
    fieldGetter: 'user_id',
  },
  {
    id: 'user_name',
    name: 'Имя пользователя',
    fieldGetter: 'user_name',
  },
  {
    id: 'user_custom',
    name: 'Полное имя',
    fieldGetter: 'user_custom',
  },
  {
    id: 'email',
    name: 'E-mail',
    fieldGetter: 'email',
  },
];

const UserList = (props) => {
  const [users, setUsers] = useState([]);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [userParams, setUserParams] = useState({});
  const history = useHistory();

  useEffect(() => {
    service.getUsers(currentPage, perPage).then((items) => {
      console.log('getUsers', items.data.data);
      setUsers(items.data.data);
      setRecordsTotal(items.data.recordsTotal);
      return () => {};
    });
  }, [currentPage]);

  const handlerOnChange = (inputID) => (event) => {
    setUserParams({ ...userParams, [inputID]: event.target.value });
  };

  const handlerSubmitClick = (event) => {
    event.preventDefault();
    service.addUser(userParams).then(() => {
      setCurrentPage(Math.floor((recordsTotal + 1) / perPage) + 1);
    });
  };

  const handlerTableClick = (param) => {
    console.log(param);
    history.push(`/usercard/${param}`);
  };

  return (
    <div>
      <FormControl style={{ padding: 20 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <TextField
              id="user_id"
              label="ID"
              variant="outlined"
              onChange={handlerOnChange('user_id')}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              id="user_name"
              label="Имя пользователя"
              variant="outlined"
              onChange={handlerOnChange('user_name')}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              id="user_custom"
              label="Полное имя"
              variant="outlined"
              onChange={handlerOnChange('user_custom')}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              id="email"
              label="E-mail"
              variant="outlined"
              onChange={handlerOnChange('email')}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button type="submit" appearance="secondary" onClick={handlerSubmitClick}>
              Добавить
            </Button>
          </Grid>
        </Grid>
      </FormControl>
      <Pagination
        current={currentPage}
        total={recordsTotal}
        perPage={perPage}
        onChangePage={setCurrentPage}
        className="pagin"
        size="sm"
      />
      <Table
        columns={columns}
        rows={users}
        compact={true}
        className="table-wrapper"
        tableClassName="user-table"
        renderEmptyMessage={() => <div>Нет данных</div>}
        renderRow={(data) => (
          <tr
            className={data.className}
            key={data.row.user_id}
            onDoubleClick={handlerTableClick.bind(null, data.row.user_id)}
          >
            {data.columns.map((column, index) => (
              <data.CellComponent
                key={index}
                column={column}
                row={data.row}
                rowIndex={data.rowIndex}
                columnIndex={index}
              />
            ))}
          </tr>
        )}
      />
    </div>
  );
};

export default UserList;
