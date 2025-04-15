import ENV from '../services/Env.js';

 
export const checkAccess = (_host, _id) => {
  //let log = log.toLowerCase().trim();
  console.log('http://' + _host + '/ibm/users/access/'+_id)
  return fetch('http://' + _host + '/ibm/users/access/'+_id, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }, 

  }).then((response) => response.json());
}


export const checkLicense = (_host, _log) => {
  //let log = log.toLowerCase().trim();
  //http://45.141.100.207:44445/getlicense?HDD=123&user=FloraPointFlorist&progtype=8
  console.log('http://' + _host + ':44445/getlicense?HDD=' + _log + '&user=FloraPointFlorist&progtype=8')
  return fetch('http://' + _host + ':44445/getlicense?HDD=' + _log + '&user=FloraPointFlorist&progtype=8', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.text());
}


export const checkLogin = (_host, _log, _pass) => {
  //let log = log.toLowerCase().trim();

  return fetch('http://' + _host + '/ibm/user/login/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: _pass,
      login: _log,
    }),

  }).then((response) => response.json());
}

export const checkLoginCourier = (_host, _log, _pass) => {
  //let log = log.toLowerCase().trim();

  return fetch('http://' + _host + '/ibm/courier/user/login/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: _pass,
      login: _log,
    }),

  }).then((response) => response.json());
}



export const setUserPushToken = (_host, _uid, _token) => {
  console.log(
    'http://' + _host + '/ibm/courier/user/token',
    {
      token: _token,
      uid: _uid,
    }
  );
  return fetch('http://' + _host + '/ibm/courier/user/token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: _token,
      uid: _uid,
    }),
  }).then((response) => response.json());
}


export const restorePassword = (_phone, _password, _code) => {
  return fetch(ENV.API_URL + '/passwords/restore/sms', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: _code,
      password: _password,
      phone: _phone,
    }),
  }).then((response) => response.json());
}