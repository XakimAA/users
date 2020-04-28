import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, TextField, Paper, Typography, FormControl } from '@material-ui/core';
import { Table, Button, Collapse, Loader } from 'xsolla-uikit';
import moment from 'moment';

import { Service } from '../../Service';
const service = new Service();

const columns = [
  { id: 'date', name: 'дата', fieldGetter: 'date' },
  { id: 'transaction_type', name: 'тип транзакции', fieldGetter: 'transaction_type' },
  { id: 'amount', name: 'сумма операции', fieldGetter: 'amount' },
  { id: 'user_balance', name: 'баланс', fieldGetter: 'user_balance' },
  { id: 'currency', name: 'валюта', fieldGetter: 'currency' },
  { id: 'comment', name: 'комментарий', fieldGetter: 'comment' },
  { id: 'status', name: 'статус', fieldGetter: 'status' },
];

const UserCard = (props) => {
  let { id } = useParams();
  const [values, setValues] = useState({
    user_id: '',
    user_name: '',
    user_custom: '',
    email: '',
    register_date: '',
    balance: '',
    wallet_amount: '',
    wallet_currency: '',
    enabled: true,
  });

  const [transactionInfo, setTransactionInfo] = useState({
    user_id: id,
    amount: '',
    comment: '',
  });

  const [errorFields, setErrorFields] = useState({
    user_id: false,
    user_name: false,
    user_custom: false,
    email: false,
  });

  const [loadSave, setLoadSave] = useState(false);
  const [loadingPage, setloadingPage] = useState(true);
  const [userNotFound, setUserNotFound] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [addTransactionLoad, setAddTransactionLoad] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const getUserInfo = service.getUserInfo(id).then((user) => {
      setValues(user.data);
      return user;
    });
    const getTransactions = service.getTransactions(id).then(({ data }) => {
      setTransactions(data);
      return data;
    });
    Promise.all([getUserInfo, getTransactions]).then((values) => {
      setUserNotFound(values[0].data.http_status_code === 404);
      setloadingPage(false);
    });
  }, []);

  const handlerOnChange = (inputID) => (event) => {
    setValues({ ...values, [inputID]: event.target.value });
    setErrorFields({ ...errorFields, [inputID]: false });
  };

  const handlerSubmitClick = (event) => {
    setErrorText('');
    setLoadSave(true);
    service
      .updateUser(values)
      .then((answer) => {
        setLoadSave(false);
        if (answer.statusText === 'OK' && answer.status === 200) {
          let error = '';
          if (
            !!answer.data &&
            !!answer.data.extended_message &&
            !!answer.data.extended_message.global_errors &&
            answer.data.extended_message.global_errors.length > 0
          )
            error = answer.data.extended_message.global_errors.reduce(
              (str, current) => str + ' ' + current,
              0
            );

          if (
            !!answer.data &&
            !!answer.data.extended_message &&
            !!answer.data.extended_message.property_errors
          )
            error +=
              'Неверно заполнено поле:' +   
              Object.keys(answer.data.extended_message.property_errors).reduce((str, current) => {
                setErrorFields({ ...errorFields, [current]: true });
                return str + ' ' + current + '\n';
              }, '');

          if (error === '') console.log('добавлен');
          else {
            setErrorText(error);
            console.log('ошибка', error);
          }
        } else {
          console.log('ошибка', answer);
        }
      })
      .catch((data) => {
        setLoadSave(false);
        console.log('произошла ошибка', data);
      });
  };

  const handlerOnChangeTransaction = (inputID) => (event) => {
    setTransactionInfo({ ...transactionInfo, [inputID]: event.target.value });
  };

  const handlerAddTransation = (event) => {
    setAddTransactionLoad(true);
    service
      .addTransaction(transactionInfo)
      .then((answer) => {
        setAddTransactionLoad(false);
        if (
          !!answer.data &&
          !answer.data.message &&
          answer.statusText === 'OK' &&
          answer.status === 200
        ) {
          console.log('добавлен');
          service.getTransactions(id).then(({ data }) => {
            setTransactions(data);
          });
        } else {
          console.log('ошибка', answer);
        }
      })
      .catch((data) => {
        setAddTransactionLoad(false);
        console.log('произошла ошибка', data);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      {loadingPage && <Loader color="blue" fullscreen={true} centered={true} />}
      {!loadingPage && userNotFound && <div>Пользователя с таким id не существует</div>}
      {!loadingPage && !userNotFound && (
        <>
          <Paper style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography component="p" align="left" style={{ marginBottom: '20px' }}>
              Информация о пользователе
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    id="user_id"
                    label="ID"
                    variant="outlined"
                    error={errorFields.user_id}
                    onChange={handlerOnChange('user_id')}
                    value={values.user_id}
                    disabled
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    id="user_name"
                    label="Имя пользователя"
                    variant="outlined"
                    error={errorFields.user_name}
                    onChange={handlerOnChange('user_name')}
                    value={values.user_name}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    id="user_custom"
                    label="Полное имя"
                    variant="outlined"
                    error={errorFields.user_custom}
                    onChange={handlerOnChange('user_custom')}
                    value={values.user_custom}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    id="email"
                    label="E-mail"
                    variant="outlined"
                    error={errorFields.email}
                    onChange={handlerOnChange('email')}
                    value={values.email}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    id="register_date"
                    label="Дата регистрации"
                    variant="outlined"
                    value={moment(values.register_date).format('DD.MM.YYYY')}
                    disabled
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    id="balance"
                    label="Баланс"
                    variant="outlined"
                    value={values.balance}
                    disabled
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    id="wallet_amount"
                    label="Кошелек"
                    variant="outlined"
                    value={values.wallet_amount}
                    disabled
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    id="wallet_currency"
                    label="Валюта"
                    variant="outlined"
                    value={values.wallet_currency}
                    disabled
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={10}>
                <FormControl fullWidth>
                  <Typography component="p" align="left" style={{ color: '#ff0000' }}>
                    {errorText}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2} align="right">
                <Button
                  type="submit"
                  appearance="secondary"
                  onClick={handlerSubmitClick}
                  fetching={loadSave}
                >
                  Изменить
                </Button>
              </Grid>
            </Grid>
          </Paper>
          <Paper style={{ padding: '20px', marginBottom: '20px' }}>
            <Collapse
              isOpened={false}
              staticElements={1}
              collapsedLabel={() => `Ввести данные`}
              expandedLabel={() => 'Спрятать'}
            >
              <Typography component="p" align="left" style={{ marginBottom: '20px' }}>
                Добавить операцию
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth>
                    <TextField
                      id="amount"
                      label="Сумма"
                      variant="outlined"
                      onChange={handlerOnChangeTransaction('amount')}
                      value={transactionInfo.amount}
                      type="number"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth>
                    <TextField
                      id="comment"
                      label="Комментарий"
                      variant="outlined"
                      onChange={handlerOnChangeTransaction('comment')}
                      value={transactionInfo.comment}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2} align="right">
                  <Button
                    type="submit"
                    appearance="secondary"
                    onClick={handlerAddTransation}
                    fetching={addTransactionLoad}
                    style={{ height: '100%' }}
                  >
                    +
                  </Button>
                </Grid>
              </Grid>
            </Collapse>
          </Paper>
          <Paper style={{ marginBottom: '20px' }}>
            <Typography component="p" align="left" style={{ padding: '20px' }}>
              Все операции пользователя
            </Typography>
            <Table
              columns={columns}
              rows={transactions}
              compact={true}
              className="table-wrapper"
              tableClassName="user-table"
              renderEmptyMessage={() => <div>Нет данных</div>}
              renderRow={(data) => {
                data.row['date'] = moment(data.row['date']).format('DD.MM.YYYY');
                return (
                  <tr className={data.className} key={data.row.operation_id}>
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
      )}
    </div>
  );
};

export default UserCard;
