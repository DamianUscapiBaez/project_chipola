import Config from "./Config";

// worker.js
onmessage = function (event) {
    const { idcustomer, numero, status, typedocument, year } = event.data;

    let endpoint = '';
    let dataKey = '';

    if (idcustomer > 0) {
        endpoint = `/register/registersearch.php?idcustomer=${idcustomer}&numero=${numero}&status=${status}&typedocument=${typedocument}&year=${year}`;
        dataKey = 'facturaPdf';
    } else {
        endpoint = `/reportes/listarregistrosclientes.php?idcustomer=${idcustomer}&estado=${status}&year=${year}&typedocument=${typedocument}`;
        dataKey = 'registrosPdf';
    }

    fetch(`${Config.URL_BASE}${endpoint}`)
        .then(response => response.json())
        .then(data => postMessage({ data, dataKey }))
        .catch(error => postMessage({ error }));
};
