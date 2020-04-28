import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Paper, Typography, FormControl } from '@material-ui/core';
import { Table, Button } from 'xsolla-uikit';
import moment from 'moment';

import { Service } from '../../Service';
const service = new Service();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

const UserCard = (props) => {
  const classes = useStyles();
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
  const [loadSave, setLoadSave] = useState(false);
  useEffect(() => {
    service.getUserInfo(id).then((user) => {
      setValues(user.data);
    });
  }, []);

  const handlerOnChange = (inputID) => (event) => {
    setValues({ ...values, [inputID]: event.target.value });
  };

  const handlerSubmitClick = (event) => {
    event.preventDefault();
    setLoadSave(true);
    service
      .updateUser(values)
      .then((answer) => {
        setLoadSave(false);
        if (!answer.data && answer.statusText === 'OK' && answer.status === 200) {
          console.log('добавлен');
        } else {
          console.log('ошибка', answer);
        }
      })
      .catch((data) => {
        setLoadSave(false);
        console.log('произошла ошибка', data);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Paper style={{ padding: '20px' }}>
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
          <Grid item xs={12} align="right">
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
    </div>
  );
};

export default UserCard;
