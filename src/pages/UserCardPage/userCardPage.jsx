import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, TextField, Paper, Typography, FormControl } from '@material-ui/core';
import { Table, Button, Collapse, Loader } from 'xsolla-uikit';

import UserCard from '../../components/UserCard/userCard';
import Notification from '../../components/Notification/notification';
import { Service } from '../../Service';
const service = new Service();

const columns = [
  { id: 'operation_id', name: 'ID', fieldGetter: 'operation_id' },
  { id: 'date', name: 'дата', fieldGetter: 'date' },
  { id: 'transaction_type', name: 'тип транзакции', fieldGetter: 'transaction_type' },
  { id: 'amount', name: 'сумма операции', fieldGetter: 'amount' },
  { id: 'user_balance', name: 'баланс', fieldGetter: 'user_balance' },
  { id: 'currency', name: 'валюта', fieldGetter: 'currency' },
  { id: 'comment', name: 'комментарий', fieldGetter: 'comment', maxWidth: 150 },
  { id: 'status', name: 'статус', fieldGetter: 'status' },
];

const UserCardPage = (props) => {
  let { id } = useParams();

  const [user, setUser] = useState({});

  const [transactionInfo, setTransactionInfo] = useState({
    user_id: id,
    amount: '',
    comment: '',
  });

  const [loadingPage, setloadingPage] = useState(true);
  const [userNotFound, setUserNotFound] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [addTransactionLoad, setAddTransactionLoad] = useState(false);
  const [errorAmount, setErrorAmount] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    getInfo(id);
  }, [id]);

  const getInfo = (id) => {
    const getUserInfo = service.getUserInfo(id);
    const getTransactions = service.getTransactions(id);
    Promise.all([getUserInfo, getTransactions]).then((values) => {
      setUser(values[0].data);
      setTransactions(values[1].data);
      setUserNotFound(values[0].data.http_status_code === 404);
      setloadingPage(false);
    });
  };

  const handlerOnChangeTransaction = (inputID) => (event) => {
    const { value } = event.target;
    if (inputID === 'amount') {
      setErrorAmount(parseFloat(value) === 0);
    }
    setTransactionInfo({ ...transactionInfo, [inputID]: value });
  };

  const handlerAddTransation = (event) => {
    event.preventDefault();
    setMessage('');
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
          setMessageType('success');
          setMessage('Операция выполнена');
          getInfo(id);
        } else {
          setMessageType('error');
          setMessage(answer);
        }
      })
      .catch((data) => {
        setAddTransactionLoad(false);
        setMessageType('error');
        setMessage('Ошибка: ' + data);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      {loadingPage && <Loader color="blue" fullscreen={true} centered={true} />}
      {!loadingPage && userNotFound && (
        <>
          <div>Пользователя с таким id не существует</div>
          <Link to="/">Вернуться к списку пользователей</Link>
        </>
      )}
      {!loadingPage && !userNotFound && (
        <>
          <div style={{ marginBottom: '20px' }}><Link to="/" >Вернуться к списку пользователей</Link></div>
          <UserCard user={user} isAdding={false} />
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
              <form onSubmit={handlerAddTransation}>
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
                        required
                        error={errorAmount}
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
                        required
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2} align="right">
                    <Button
                      type="submit"
                      appearance="secondary"
                      fetching={addTransactionLoad}
                      style={{ height: '100%' }}
                      disabled={errorAmount}
                    >
                      Добавить
                    </Button>
                  </Grid>
                </Grid>
              </form>
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
                const date = new Date(data.row['date']);
                data.row['date'] = `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString(
                  'ru-RU'
                )}`;
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
          <Notification message={message} messageType={messageType} />
        </>
      )}
    </div>
  );
};

export default UserCardPage;
