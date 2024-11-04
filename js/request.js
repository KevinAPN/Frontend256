//const url = 'http://localhost:5000/api/';
const url = 'https://backend256-sz1q.onrender.com/api/';

function sendRequest(endPoint, method, data, isFormData = false) {  
    let request = new XMLHttpRequest();  
    request.open(method, url + endPoint);  
    request.responseType = 'json';

    if (!isFormData) {
        request.setRequestHeader('Content-Type', 'application/json');  
        data = data ? JSON.stringify(data) : data;
    }

    request.send(data);  
    return request;  
}


/* antiguo request */
/*const url = 'http://localhost:5000/api/';

function sendRequest(endPoint, method, data) {  
    let request = new XMLHttpRequest();  
    request.open(method, url+endPoint);  
    request.responseType = 'json';  
    request.setRequestHeader('Content-Type', 'application/json');  
    request.send(data ? JSON.stringify(data) : data);  
    return request;  
}*/