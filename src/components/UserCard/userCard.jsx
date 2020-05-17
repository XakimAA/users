import React, { useEffect, useState } from 'react';
import { Grid, TextField, Paper, Typography, FormControl } from '@material-ui/core';
import { Button, Collapse } from 'xsolla-uikit';
import moment from 'moment';

import { Service } from '../../Service';
const service = new Service();

const UserCard = ({ isAdding, user }) => {
  const formTitle = isAdding ? "Добавление пользователя" : "Информация о пользователе";
  const collapsePanelText = isAdding ? "Ввести данные" : "Показать";
  const actionButtonText = isAdding ? "Добавить" : "Изменить";
  
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
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (!isAdding) setValues(user);
  }, []);

  const handlerOnChange = (inputID) => (event) => {
    setValues({ ...values, [inputID]: event.target.value });
    setErrorFields({ ...errorFields, [inputID]: false });
  };

  const handlerSubmitClick = (event) => {
    event.preventDefault();
    setErrorText('');
    setLoadButton(true);
    const request = isAdding ? service.addUser(values) : service.updateUser(values);
    request
      .then((answer) => processAnswer(answer))
      .catch((data) => {
        setLoadButton(false);
        console.log('произошла ошибка', data);
      });
      
  };

  const processAnswer = (answer) => {
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
          'Ошибка:' +
          Object.keys(answer.data.extended_message.property_errors).reduce((str, current) => {
            setErrorFields({ ...errorFields, [current]: true });
            return str + ' ' + current + '\n';
          }, '');

          if (!!answer.data && !!answer.data.message) error += answer.data.message;

      if (error === '') console.log('добавлен'); //TODO:Исправить на окно об успехе
      else {
        setErrorText(error);
        console.log('ошибка', error);
      }
    } else {
      console.log('ошибка', answer);
    }
    setLoadButton(false);
  }

  return (
    <Paper style={{ padding: '20px', marginBottom: '20px' }}>
      <Collapse
          isOpened={!isAdding}
          staticElements={1}
          collapsedLabel={() => collapsePanelText}
          expandedLabel={() => 'Спрятать'}
        >
      <Typography component="p" align="left" style={{ marginBottom: '20px' }}>
        {formTitle}
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
              disabled={!isAdding}
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
        {!isAdding && (<>
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
        </>)}
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
            fetching={loadButton}
          >
           {actionButtonText}
          </Button>
        </Grid>
      </Grid>
      </Collapse>
    </Paper>
  );
};

export default UserCard;
