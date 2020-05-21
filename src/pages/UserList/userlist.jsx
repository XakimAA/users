import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Grid, Paper, Typography, TextField, FormControl } from '@material-ui/core';
import { Table, Button } from 'xsolla-uikit';
import Pagination from 'xsolla-uikit/lib/pagination'; //отсутствует в общем списке

import './userlist.css';
import UserCard from '../../components/UserCard/userCard';
import { Service } from '../../Service';
const service = new Service();

const columns = [
  {
    id: 'rowIndex',
    name: '№',
    fieldGetter: 'rowIndex',
  },
  {
    id: 'register_date',
    name: 'Дата регистрации',
    fieldGetter: 'register_date',
  },
  {
    id: 'user_id',
    name: 'ID',
    fieldGetter: 'user_id',
    maxWidth: 150,
  },
  {
    id: 'user_name',
    name: 'Имя пользователя',
    fieldGetter: 'user_name',
    maxWidth: 150,
  },
  {
    id: 'balance',
    name: 'Баланс',
    fieldGetter: 'balance',
    maxWidth: 150,
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
  const [loadSearching, setLoadSearching] = useState(false);
  const [filters, setFilters] = useState({
    user_requisites: '',
    email: '',
    size: 10,
  });
  const [errorEmail, setErrorEmail] = useState(false);

  useEffect(() => {
    getUsers();
  }, [currentPage]);

  const getUsers = () => {
    setLoadSearching(true);
    service
      .getUsers(filters, currentPage)
      .then((items) => {
        setUsers(items.data.data);
        setRecordsTotal(items.data.recordsTotal || 0);
        setLoadSearching(false);
        return () => {};
      })
      .catch(() => {
        setLoadSearching(false);
      });
  };

  const handlerTableClick = (param) => {
    history.push(`/usercard/${param}`);
  };

  const handlerFilterChange = (inputID) => (event) => {
    setFilters({ ...filters, [inputID]: event.target.value });
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handlerEmailChange = (event) => {
    const { value } = event.target;
    setErrorEmail(value.length !== 0 && !validateEmail(value));
    setFilters({ ...filters, email: value });
  };

  const handlerSearchClick = () => {
    setPerPage(parseInt(filters.size));
    if (currentPage === 1) getUsers();
    else setCurrentPage(1);
  };

  return (
    <>
      <UserCard isAdding updateTable={getUsers} />
      <Paper className="paper">
        <Typography component="p" align="left" className="title">
          Фильтры
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <TextField
                id="user_requisites"
                label="ID или имя пользователя"
                variant="outlined"
                onChange={handlerFilterChange('user_requisites')}
                value={filters.user_requisites}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <TextField
                label="E-mail"
                variant="outlined"
                error={errorEmail}
                onChange={handlerEmailChange}
                value={filters.email}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <TextField
                id="size"
                label="Показывать по"
                variant="outlined"
                onChange={handlerFilterChange('size')}
                value={filters.size}
                type="number"
                inputProps={{ min: "0", max: "10", step: "1" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2} align="right" className="button__height">
            <Button
              type="submit"
              appearance="secondary"
              onClick={handlerSearchClick}
              disabled={errorEmail}
              fetching={loadSearching}
            >
              Поиск
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper>
        <Typography component="p" align="left" className="title__table">
          Все пользователи
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
          fetching={loadSearching}
          renderEmptyMessage={() => <div>Нет данных</div>}
          renderRow={(data) => {
            data.row.rowIndex = (currentPage - 1)*perPage + data.rowIndex + 1;
            
            data.row['register_date'] = new Date(data.row['register_date']).toLocaleDateString(
              'ru-RU'
            );
            return (
              <tr
                title="Двойнок клик: редактирование пользователя и просмотр операций"
                className={data.className}
                key={data.row.user_id}
                onClick={handlerTableClick.bind(null, data.row.user_id)}
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
            );
          }}
        />
      </Paper>
    </>
  );
};

export default UserList;
