import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, FormControl, Paper, Typography } from '@material-ui/core';
import { Table, Button, Collapse } from 'xsolla-uikit';
import Pagination from 'xsolla-uikit/lib/pagination'; //отсутствует в общем списке

import './userlist.css';
import UserCard from '../../components/UserCard/userCard';
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
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    service.getUsers(currentPage, perPage).then((items) => {
      // console.log('getUsers', items.data.data);
      setUsers(items.data.data);
      setRecordsTotal(items.data.recordsTotal);
      return () => {};
    });
  }, [currentPage]);

  const handlerTableClick = (param) => {
    console.log(param);
    history.push(`/usercard/${param}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <UserCard isAdding/>
      <Paper>
        <Typography component="p" align="left" style={{ padding: '20px' }}>
          Все пользователи
        </Typography>
        <Grid container>
          <Grid item xs={12} style={{ marginBottom: '10px', paddingLeft: '20px' }}>
            <Pagination
              current={currentPage}
              total={recordsTotal}
              perPage={perPage}
              onChangePage={setCurrentPage}
              className="pagin"
              size="sm"
            />
          </Grid>
        </Grid>
        <Table
          columns={columns}
          rows={users}
          compact={true}
          className="table-wrapper"
          tableClassName="user-table"
          renderEmptyMessage={() => <div>Нет данных</div>}
          renderRow={(data) => (
            <tr
              title="Двойнок клик: редактирование пользователя и просмотр операций"
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
      </Paper>
    </div>
  );
};

export default UserList;
