import ENV from '../services/Env.js';

export const getAvailables = (_host) => {
  console.log('http://' + _host + '/ibm/florist/orders/list');
  return fetch('http://' + _host + '/ibm/florist/orders/list', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}



export const newOrder = (_host, uid) => {
  console.log('http://' + _host + '/ibm/florist/orders/new/'+uid)
  return fetch('http://' + _host + '/ibm/florist/orders/new/'+uid, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}


export const refreshInfo = (_host, checkid) => {
  console.log('http://' + _host + '/ibm/florist/orders/refreshinfo/'+checkid)
  return fetch('http://' + _host + '/ibm/florist/orders/refreshinfo/'+checkid, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}

export const refreshPrepay = (_host, checkid) => {
  return fetch('http://' + _host + '/ibm/florist/orders/refreshprepay/'+checkid, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}



export const getOrdersStatus= (_host) => {
  console.log('http://' + _host + '/ibm/florist/orders/status/list');
  return fetch('http://' + _host + '/ibm/florist/orders/status/list', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}

export const getOrdersStatusSell= (_host) => {
  console.log('http://' + _host + '/ibm/florist/orders/status/sell');
  return fetch('http://' + _host + '/ibm/florist/orders/status/sell', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}

export const getOrdersStatusDelivery = (_host) => {
  console.log('http://' + _host + '/ibm/florist/orders/status/delivery');
  return fetch('http://' + _host + '/ibm/florist/orders/status/delivery', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}

export const getOrdersStatusCurier = (_host) => {
  console.log('http://' + _host + '/ibm/florist/orders/status/curier');
  return fetch('http://' + _host + '/ibm/florist/orders/status/curier', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}

export const openOrder = (_host, _order) => {
  console.log(`http://${_host}/ibm/florist/orders/open/${_order}`);
  return fetch(`http://${_host}/ibm/florist/orders/open/${_order}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}

export const orderPhotos = (_host, orderid, photonum) => {
  console.log(`http://${_host}/ibm/florist/orders/photos/${orderid}/${photonum}`);
  return fetch(`http://${_host}/ibm/florist/orders/photos/${orderid}/${photonum}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}

export const addPhoto = (_host, orderid, file, num ) => {
  console.log(`http://${_host}/ibm/florist/orders/add/photo/${orderid}/${file}/${num}`);
  return fetch(`http://${_host}/ibm/florist/orders/add/photo/${orderid}/${file}/${num}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}





export const addUserToOrder = (_host, _uid, _oid) => {
  console.log('http://' + _host + '/ibm/users/orders/set/user/'+_uid+'/'+_oid);
  return fetch('http://' + _host + '/ibm/users/orders/set/user/'+_uid+'/'+_oid, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}

export const doneOrder = (_host, _oid) => {
  return fetch('http://' + _host + '/ibm/users/orders/done/'+_oid, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}
 
export const getClients = (_host) => {
  return fetch('http://' + _host + '/ibm/florist/orders/clients', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}

export const searchClient = (_host, _line) => {
  return fetch(`http://${_host}/ibm/florist/orders/clients/search/${_line}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}
 
export const payOrder = (_host, _сid, _type, _stat, _price ) => {
  console.log('http://' + _host + '/ibm/users/orders/price/'+_сid+'/'+ _type +'/'+_stat+"/"+_price);
  return fetch('http://' + _host + '/ibm/users/orders/price/'+_сid+'/'+ _type +'/'+_stat+"/"+_price, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}

export const getCoords = (_val) => {
  return fetch('https://geocode-maps.yandex.ru/1.x/?apikey=1cc23b7d-036d-4b86-a7b2-2ea8a63809c9&format=json&geocode=' + _val, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json());
}


export const saveOrder = (_host, orderid, totime, StartTime, EndTime, customer, customerphone, dostavka, receiver, receiverphone, receiveraddress, comment, SiteNum, otkydaid, statusid, CreatingBy, DeliveryStatusId, DeliveryManId, OrderName) => {
  //let log = log.toLowerCase().trim();

  console.log(
    {
      orderid: orderid,
      totime: totime,
      StartTime: StartTime,
      EndTime: EndTime,
      customer: customer,
      customerphone: customerphone,
      dostavka: dostavka,
      receiver: receiver,
      receiverphone: receiverphone,
      receiveraddress: receiveraddress,
      comment: comment,
      SiteNum: SiteNum,
      otkydaid: otkydaid,
      statusid: statusid,
      CreatingBy: CreatingBy,
      DeliveryStatusId: DeliveryStatusId,
      DeliveryManId: DeliveryManId,
      OrderName: OrderName
    }
  );

  return fetch('http://'+_host+'/ibm/florist/orders/save' , {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderid: orderid,
        totime: totime,
        StartTime: StartTime,
        EndTime: EndTime,
        customer: customer,
        customerphone: customerphone,
        dostavka: dostavka,
        receiver: receiver,
        receiverphone: receiverphone,
        receiveraddress: receiveraddress,
        comment: comment,
        SiteNum: SiteNum,
        otkydaid: otkydaid,
        statusid: statusid,
        CreatingBy: CreatingBy,
        DeliveryStatusId: DeliveryStatusId,
        DeliveryManId: DeliveryManId,
        OrderName: OrderName
      }),
 
    }).then((response) =>   response.json() );
}



