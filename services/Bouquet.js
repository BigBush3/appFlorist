import ENV from '../services/Env.js';

export const getList = (_host) => {
    console.log('http://' + _host + '/ibm/florist/bouquet/list');
    return fetch('http://' + _host + '/ibm/florist/bouquet/list', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}


export const getProductsList = (_host, _p = 1) => {
    console.log('http://' + _host + '/ibm/florist/bouquet/products/'+_p);
    return fetch('http://' + _host + '/ibm/florist/bouquet/products/'+_p, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}


export const newBouquet = (_host, _user) => {
    console.log('http://' + _host + '/ibm/florist/bouquet/new/'+_user);
    return fetch('http://' + _host + '/ibm/florist/bouquet/new/'+_user, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const insertProduct = (_host, _checkid, _kompid, _itemid, _amount, _price, _total) => {
    console.log(`http://${_host}/ibm/florist/bouquet/insert/item/${_checkid}/${_kompid}/${_itemid}/${_amount}/${_price}/${_total}`);

    return fetch(`http://${_host}/ibm/florist/bouquet/insert/item/${_checkid}/${_kompid}/${_itemid}/${_amount}/${_price}/${_total}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const removeProduct = (_host, _itemid ) => {
    console.log(`http://${_host}/ibm/florist/bouquet/delete/item/${_itemid}`);

    return fetch(`http://${_host}/ibm/florist/bouquet/delete/item/${_itemid}`, {
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
    console.log(`http://${_host}/ibm/florist/bouquet/update/item/${_checkid}/${_amount}/${_price}/${_total}`);

    return fetch(`http://${_host}/ibm/florist/bouquet/update/item/${_checkid}/${_amount}/${_price}/${_total}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}


export const dontSave = (_host, _checkid, _uid  ) => {
    console.log(`http://${_host}/ibm/florist/bouquet/dsave/${_checkid}/${_uid}`);
    
    return fetch(`http://${_host}/ibm/florist/bouquet/dsave/${_checkid}/${_uid} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const save = (_host, _checkid, _title ) => {
    console.log(`http://${_host}/ibm/florist/bouquet/save/${_checkid}/${_title} `);
    
    return fetch(`http://${_host}/ibm/florist/bouquet/save/${_checkid}/${_title} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const setTotal = (_host, _checkid, _price ) => {
    console.log(`http://${_host}/ibm/florist/bouquet/set/checktotal/${_checkid}/${_price}`);
    
    return fetch(`http://${_host}/ibm/florist/bouquet/set/checktotal/${_checkid}/${_price} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}

export const addPhoto = (_host, komplektcheckitemid, file ) => {
    console.log(`http://${_host}/ibm/florist/bouquet/add/photo/${komplektcheckitemid}/${file}`);
    
    return fetch(`http://${_host}/ibm/florist/bouquet/add/photo/${komplektcheckitemid}/${file} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}


export const open = (_host, _checkid ) => {
    console.log(`http://${_host}/ibm/florist/bouquet/open/${_checkid}`);
    
    return fetch(`http://${_host}/ibm/florist/bouquet/open/${_checkid} `, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}


export const getProductsInBouquet = (_host, _checkid, _kompid ) => {
    console.log(`http://${_host}/ibm/florist/bouquet/prodlist/${_checkid}/${_kompid}`);
    
    return fetch(`http://${_host}/ibm/florist/bouquet/prodlist/${_checkid}/${_kompid}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
}
