import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, FormControl, Paper, Typography } from '@material-ui/core';
import { Table, Button, Collapse } from 'xsolla-uikit';
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
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [userParams, setUserParams] = useState({});
  const [loadAdd, setLoadAdd] = useState(false);
  const [errorText, setErrorText] = useState('');

  const [errorFields, setErrorFields] = useState({
    user_id: false,
    user_name: false,
    user_custom: false,
    email: false,
  });

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
    setErrorFields({ ...errorFields, [inputID]: false });
  };

  const handlerSubmitClick = (event) => {
    event.preventDefault();
    setErrorText('');
    setLoadAdd(true);
    service
      .addUser(userParams)
      .then((answer) => {
        if (answer.statusText === 'OK' && answer.status === 200) {
          let error = '';
          if (
            !!answer.data &&
            !!answer.data.extended_message &&
            !!answer.data.extended_message.global_errors &&
            answer.data.extended_message.global_errors.length > 0
          )
            error = answer.data.extended_message.global_errors.reduce(
              (str, current) => str + ' ' + current + '\n',
              0
            );

          if (
            !!answer.data &&
            !!answer.data.extended_message &&
            !!answer.data.extended_message.property_errors
          )
            error +=
              'Ошибка:' +
              Object.keys(answer.data.extended_message.property_errors).reduce((str, current) => {
                setErrorFields({ ...errorFields, [current]: true });
                console.log(current);
                return str + ' ' + current + '.' +  answer.data.extended_message.property_errors[current] + '\n';
              }, '');

          if (!!answer.data && !!answer.data.message) error += answer.data.message;

          if (error === '') {
            setCurrentPage(Math.floor((recordsTotal + 1) / perPage) + 1);
            console.log('добавлен');
          } else {
            setErrorText(error);
            console.log('ошибка', error);
          }
        } else {
          console.log('ошибка', answer);
        }
        setLoadAdd(false);
      })
      .catch(() => {
        setLoadAdd(false);
      });
  };

  const handlerTableClick = (param) => {
    console.log(param);
    history.push(`/usercard/${param}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <Collapse
          isOpened={false}
          staticElements={1}
          collapsedLabel={() => 'Ввести данные'}
          expandedLabel={() => 'Спрятать'}
        >
          <Typography component="p" align="left" style={{ marginBottom: '20px' }}>
            Добавление пользователя
          </Typography>
          <form onSubmit={handlerSubmitClick}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <TextField
                  id="user_id"
                  label="ID"
                  variant="outlined"
                  error={errorFields.user_id}
                  onChange={handlerOnChange('user_id')}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <TextField
                  id="user_name"
                  label="Имя пользователя"
                  variant="outlined"
                  error={errorFields.user_name}
                  onChange={handlerOnChange('user_name')}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <TextField
                  id="user_custom"
                  label="Полное имя"
                  variant="outlined"
                  error={errorFields.user_custom}
                  onChange={handlerOnChange('user_custom')}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <TextField
                  id="email"
                  label="E-mail"
                  variant="outlined"
                  error={errorFields.email}
                  onChange={handlerOnChange('email')}
                />
              </FormControl>
            </Grid>
            {errorText && (
              <Grid item xs={12} md={10}>
                <FormControl fullWidth>
                  <Typography component="p" align="left" style={{ color: '#ff0000' }}>
                    {errorText}
                  </Typography>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} md={2} align="right">
              <Button
                type="submit"
                appearance="secondary"
                style={{ height: '100%' }}
                fetching={loadAdd}
              >
                Добавить
              </Button>
            </Grid>
          </Grid>
          </form>
        </Collapse>
      </Paper>

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
