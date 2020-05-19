import React, { useEffect, useState } from 'react';
import { Snackbar } from '@material-ui/core';

import { ReactComponent as CloseIcon } from '../../static/times-circle-solid.svg';
import './notification.css';

const Notification = ({ message, messageType }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!message);
  }, [message]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      message={message}
      className={messageType}
      action={<CloseIcon width="16px" onClick={handleClose} />}
    />
  );
};

export default Notification;
