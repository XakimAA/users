import React, { useEffect, useState } from 'react';
import { Grid, TextField, Paper, Typography, FormControl } from '@material-ui/core';
import { Button, Collapse } from 'xsolla-uikit';

import './userCard.css';
import Notification from '../Notification/notification';
import { Service } from '../../Service';
const service = new Service();

const UserCard = ({ isAdding, user, updateTable }) => {
  const formTitle = isAdding ? 'Добавление пользователя' : 'Информация о пользователе';
  const collapsePanelText = isAdding ? 'Ввести данные' : 'Показать';
  const actionButtonText = isAdding ? 'Добавить' : 'Изменить';

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

  const [errorFields, setErrorFields] = useState({
    user_id: false,
    user_name: false,
    user_custom: false,
    email: false,
  });

  const [loadButton, setLoadButton] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    if (!isAdding) setValues(user);
  }, [isAdding, user]);

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handlerEmailChange = (event) => {
    const { value } = event.target;
    setValues({ ...values, email: value });
    setErrorFields({ ...errorFields, email: !validateEmail(value) });
  };

  const handlerOnChange = (inputID) => (event) => {
    setValues({ ...values, [inputID]: event.target.value });
    setErrorFields({ ...errorFields, [inputID]: event.target.value.lenght === 0 });
  };

  const handlerSubmitClick = (event) => {
    event.preventDefault();
    setMessage('');
    setLoadButton(true);
    const request = isAdding ? service.addUser(values) : service.updateUser(values);
    request
      .then((answer) => processAnswer(answer))
      .catch((data) => {
        setLoadButton(false);
      });
  };

  const processAnswer = (answer) => {
    if (answer.statusText === 'OK' && answer.status === 200) {
      let error = '';
      if (
        answer.data &&
        answer.data.extended_message &&
        answer.data.extended_message.global_errors &&
        answer.data.extended_message.global_errors.length > 0
      )
        error = answer.data.extended_message.global_errors.reduce(
          (str, current) => str + ' ' + current,
          0
        );

      if (
        answer.data &&
        answer.data.extended_message &&
        answer.data.extended_message.property_errors
      )
        error +=
          'Ошибка:' +
          Object.keys(answer.data.extended_message.property_errors).reduce((str, current) => {
            setErrorFields({ ...errorFields, [current]: true });
            return str + ' ' + current + '\n';
          }, '');

      if (answer.data && answer.data.message) error += answer.data.message;
      if (error === '') {
        setMessageType('success');
        setMessage(isAdding ? 'Пользователь добавлен' : 'Пользователь изменен');
        if (isAdding) {
          setValues({
            user_id: '',
            user_name: '',
            user_custom: '',
            email: '',
          });
          if (typeof updateTable === "function") updateTable()
        }
      } else {
        setMessageType('error');
        setMessage(error);
      }
    } else {
      setMessageType('error');
      setMessage('Ошибка: ' + answer);
    }
    setLoadButton(false);
  };

  return (
    <>
      <Paper className="paper">
        <Collapse
          isOpened={!isAdding}
          staticElements={1}
          collapsedLabel={() => collapsePanelText}
          expandedLabel={() => 'Спрятать'}
        >
          <Typography component="p" align="left" className="title">
            {formTitle}
          </Typography>
          <form onSubmit={handlerSubmitClick}>
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
                    disabled={!isAdding}
                    required
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
                    required
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
                    required
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
                    onChange={handlerEmailChange}
                    value={values.email}
                    required
                  />
                </FormControl>
              </Grid>
              {!isAdding && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        id="register_date"
                        label="Дата регистрации"
                        variant="outlined"
                        value={new Date(values.register_date).toLocaleDateString('ru-RU')}
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
                </>
              )}
              <Grid item xs={12} md={12} align="right">
                <Button
                  type="submit"
                  appearance="secondary"
                  fetching={loadButton}
                  disabled={errorFields.email}
                >
                  {actionButtonText}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Collapse>
      </Paper>
     <Notification message={message} messageType={messageType}/>
    </>
  );
};

export default UserCard;
