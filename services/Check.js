import ENV from '../services/Env.js';

 

export const newCheck = (_host, _uid) => {
    console.log('http://' + _host + '/ibm/florist/check/new/'+_uid);
    return fetch('http://' + _host + '/ibm/florist/check/new/'+_uid, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const bouquetList = (_host) => {
    console.log('http://' + _host + '/ibm/florist/check/bouquet/list');
    return fetch('http://' + _host + '/ibm/florist/check/bouquet/list', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const discountList = (_host) => {
    console.log('http://' + _host + '/ibm/florist/check/discount/list');
    return fetch('http://' + _host + '/ibm/florist/check/discount/list', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

 
export const setDiscount = (_host, _checkid, _discount) => {
    console.log(`http://${_host}/ibm/florist/check/set/discont/${_checkid}/${_discount}`);

    return fetch(`http://${_host}/ibm/florist/check/set/discont/${_checkid}/${_discount}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}



export const insertProduct = (_host, _checkid, _kompid, _itemid, _amount, _price, _total) => {
    console.log(`http://${_host}/ibm/florist/check/insert/item/${_checkid}/${_kompid}/${_itemid}/${_amount}/${_price}/${_total}`);

    return fetch(`http://${_host}/ibm/florist/check/insert/item/${_checkid}/${_kompid}/${_itemid}/${_amount}/${_price}/${_total}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const insertBouquet = (_host, _checkid, _bouquet) => {
    console.log(`http://${_host}/ibm/florist/check/insert/bouquet/${_checkid}/${_bouquet}`);

    return fetch(`http://${_host}/ibm/florist/check/insert/bouquet/${_checkid}/${_bouquet}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const removeProduct = (_host, _itemid ) => {
    console.log(`http://${_host}/ibm/florist/check/delete/item/${_itemid}`);

    return fetch(`http://${_host}/ibm/florist/check/delete/item/${_itemid}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        try {
            const data =  response.json();
            return data;
        } catch (err) {
            return  {data: response}
        }
    });
}


export const updateProduct = (_host, _checkid, _amount, _price, _total ) => {
    console.log(`http://${_host}/ibm/florist/check/update/item/${_checkid}/${_amount}/${_price}/${_total}`);

    return fetch(`http://${_host}/ibm/florist/check/update/item/${_checkid}/${_amount}/${_price}/${_total}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const dontSave = (_host, _checkid, _uid  ) => {
    console.log(`http://${_host}/ibm/florist/check/dsave/${_checkid}/${_uid}`);
    
    return fetch(`http://${_host}/ibm/florist/check/dsave/${_checkid}/${_uid} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const save = (_host, _checkid, _title ) => {
    console.log(`http://${_host}/ibm/florist/check/save/${_checkid}/${_title} `);
    
    return fetch(`http://${_host}/ibm/florist/check/save/${_checkid}/${_title} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const setTotal = (_host, _checkid, _price ) => {
    console.log(`http://${_host}/ibm/florist/check/set/checktotal/${_checkid}/${_price}`);
    
    return fetch(`http://${_host}/ibm/florist/check/set/checktotal/${_checkid}/${_price} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const setClient = (_host, _checkid, clientid ) => {
    console.log(`http://${_host}/ibm/florist/check/set/client/${_checkid}/${clientid}`);
    
    return fetch(`http://${_host}/ibm/florist/check/set/client/${_checkid}/${clientid} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const getPaymentsType = (_host, _checkid ) => {
    console.log(`http://${_host}/ibm/florist/check/get/paymentstype/${_checkid} `);
    
    return fetch(`http://${_host}/ibm/florist/check/get/paymentstype/${_checkid} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const refrashList = (_host, _checkid ) => {
    console.log(`http://${_host}/ibm/florist/check/refresh/${_checkid} `);
    
    return fetch(`http://${_host}/ibm/florist/check/refresh/${_checkid} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const addPayment = (_host, _checkid, ptype,  total) => {
    console.log(`http://${_host}/ibm/florist/check/insert/payments/${_checkid}/${ptype}/${total}`);
    
    return fetch(`http://${_host}/ibm/florist/check/insert/payments/${_checkid}/${ptype}/${total}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const close = (_host, _checkid, uid ) => {
    console.log(`http://${_host}/ibm/florist/check/close/${_checkid}/${uid} `);
    
    return fetch(`http://${_host}/ibm/florist/check/close/${_checkid}/${uid} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

 

 