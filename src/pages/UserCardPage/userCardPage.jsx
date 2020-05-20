import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, TextField, Paper, Typography, FormControl } from '@material-ui/core';
import { Table, Button, Collapse, Loader } from 'xsolla-uikit';

import UserCard from '../../components/UserCard/userCard';
import Notification from '../../components/Notification/notification';
import './userCardPage.css';
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
  const [errorDate, setErrorDate] = useState({
    dateFrom:false,
    dateTo:false
  });
  const [valueDate, setValueDate] = useState({
    dateFrom:"2017-05-24T10:30",
    dateTo:"2020-05-24T10:30"
  });

  const [loadingPage, setloadingPage] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [addTransactionLoad, setAddTransactionLoad] = useState(false);
  const [errorAmount, setErrorAmount] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loadingTransaction, setLoadingTransaction] = useState(false);

  useEffect(() => {
    service.getUserInfo(id).then((answer)=>{
      setUser(answer.data);
      setloadingPage(false);
      setLoadingTransaction(true);
      if (answer.data.http_status_code === 404) {
        console.log(answer.data.http_status_code);
        return setUserNotFound(true);
      }
      return service.getTransactions(id,valueDate.dateFrom,valueDate.dateTo);
    }).then((answer)=>{
      setTransactions(answer.data);
      setLoadingTransaction(false);
    })
  }, [id]);

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
          setUser({...user, balance: answer.data.amount});
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

  const handlerDate = (inputID) => (event) => {
    const { value } = event.target;
    setErrorDate({...errorDate, [inputID]: value.length === 0});
    setValueDate({ ...valueDate, [inputID]: value });
  };

  const heandlerSearchTransaction = () => {
    setLoadingTransaction(true);
    service.getTransactions(id,valueDate.dateFrom,valueDate.dateTo).then((answer)=>{
      setTransactions(answer.data);
      setLoadingTransaction(false);
    })
  }

  return (
    <>
      {loadingPage && <Loader color="blue" fullscreen={true} centered={true} />}
      {!loadingPage && userNotFound && (
        <>
          <div>Пользователя с таким id не существует</div>
          <Link to="/">Вернуться к списку пользователей</Link>
        </>
      )}
      {!loadingPage && !userNotFound && (
        <>
          <div className="title">
            <Link to="/">Вернуться к списку пользователей</Link>
          </div>
          <UserCard user={user} isAdding={false} />
          <Paper className="paper">
            <Collapse
              isOpened={false}
              staticElements={1}
              collapsedLabel={() => `Ввести данные`}
              expandedLabel={() => 'Спрятать'}
            >
              <Typography component="p" align="left" className="title">
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
                  <Grid item xs={12} md={2} align="right" className="button__height">
                    <Button
                      type="submit"
                      appearance="secondary"
                      fetching={addTransactionLoad}
                      disabled={errorAmount}
                    >
                      Добавить
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Collapse>
          </Paper>
          <Paper>
            <Typography component="p" align="left" className="title__table">
              Все операции пользователя
            </Typography>
            <Grid container spacing={2} className="datePicker">
              <Grid item xs={12} md={5}>
                <TextField
                  id="dateFrom"
                  label="Дата с"
                  type="datetime-local"
                  defaultValue={valueDate.dateFrom}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handlerDate("dateFrom")}
                  error={errorDate.dateFrom}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  id="dateTo"
                  label="Дата по"
                  type="datetime-local"
                  defaultValue={valueDate.dateTo}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handlerDate("dateTo")}
                  error={errorDate.dateTo}
                />
              </Grid>
              <Grid item xs={12} md={2} align="right" className="button__height">
                <Button
                  type="submit"
                  appearance="secondary"
                  fetching={loadingTransaction}
                  disabled={errorDate.dateFrom || errorDate.dateTo}
                  onClick={heandlerSearchTransaction}
                >
                  Поиск
                </Button>
              </Grid>
            </Grid>
            <Table
              columns={columns}
              rows={transactions}
              compact={true}
              className="table-wrapper"
              tableClassName="user-table"
              fetching={loadingTransaction || addTransactionLoad}
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
    </>
  );
};

export default UserCardPage;
