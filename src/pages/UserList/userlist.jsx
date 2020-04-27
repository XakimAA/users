import React, { useEffect, useState } from 'react';
import { Grid,TextField } from '@material-ui/core';
import { Table,Button } from 'xsolla-uikit';
import Pagination from 'xsolla-uikit/lib/pagination'; //отсутствует в общем списке

import './userlist.css';
import { Service } from '../../Service';
const service = new Service();

const UserList = (props) => {
  const columns = [
    {
      id: 'user_id',
      name: 'ID',
      fieldGetter: 'user_id',
      width: '10%',
    },
    {
      id: 'user_name',
      name: 'Имя пользователя',
      fieldGetter: 'user_name',
      width: '30%',
    },
    {
      id: 'user_custom',
      name: 'Полное имя',
      fieldGetter: 'user_custom',
      width: '30%',
    },
    {
      id: 'email',
      name: 'E-mail',
      fieldGetter: 'email',
      width: '30%',
    },
  ];

  const [users, setUsers] = useState([]);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    service.getUsers(currentPage, perPage).then((items) => {
      console.log('getUsers', items.data.data);
      setUsers(items.data.data);
      setRecordsTotal(items.data.recordsTotal);
      return () => {};
    });
  }, [currentPage]);

  const handlerOnChange = (inputID) => (event) => {
    setSearchParams({ ...searchParams, [inputID]: event.target.value });
  };

  const handlerSubmitClick = (event) => {
    event.preventDefault();
    console.log(searchParams);
  };

  return (
    <div>
      <form style={{ padding: 20}} onSubmit={handlerSubmitClick}>
        <TextField id="user_id" label="ID" variant="outlined" onChange={handlerOnChange("user_id")}/>
        <TextField id="user_name" label="Имя пользователя" variant="outlined" onChange={handlerOnChange("user_name")} />
        <TextField id="user_custom" label="Полное имя" variant="outlined" onChange={handlerOnChange("user_custom")}/>
        <TextField id="email" label="E-mail" variant="outlined" onChange={handlerOnChange("email")}/>
        <Button type="submit" appearance="secondary">Найти</Button>
      </form>
      <Button type="button" appearance="secondary">Добавить</Button>
      <Button type="button" appearance="secondary">Редактировать</Button>
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
      />
    </div>
  );
};

export default UserList;

{
  /* <div style={{ padding: 20}}>
<Grid container spacing={4}>
  {users.map((user) => (
    <Grid container item xs={12} md={6} key={user.user_id}>
      <Card style={{ height:"unset"}}>
        {() => (
          <> 
            <Head appearance="separated">{user.user_name || ''}</Head>
            <FormGroup indentation="sm">user_custom</FormGroup>
            <FormGroup indentation="sm">email</FormGroup>
          </>
        )}
      </Card>
    </Grid>
  ))}
</Grid>
</div> */
}
