let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    pageLength: 5,
    destroy: true,
    language: {  
        lengthMenu: "Mostrar _MENU_ registros por página",  
        zeroRecords: "Ningún cliente encontrado",  
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",  
        infoEmpty: "Ningún cliente encontrado",  
        infoFiltered: "(filtrados desde _MAX_ registros totales)",  
        search: "Buscar:",  
        loadingRecords: "Cargando ...",  
        paginate: {  
            first: "Primero",  
            last: "Último",  
            next: "Siguiente",  
            previous: "Anterior"  
        }  
    },
    columns: [
        { data: null },  // Esta columna será para los números
        { data: 'nombres' },
        { data: 'apellidos' },
        { data: 'documento' },
        { data: 'correo' },
        { data: 'telefono' },
        { data: 'direccion' },
        { data: null, defaultContent: '' }  // Columna de acciones, la manejaremos después
    ],
    createdRow: function(row, data, dataIndex) {
        // Añadir la numeración aquí
        $('td', row).eq(0).html(dataIndex + 1);

        // Añadir botones de acción en la última columna
        $('td', row).eq(7).html(`
            <button type="button" class="btn btn-primary" onclick='window.location = "formClientes.html?id=${data._id}"'>Editar</button>
            <button type="button" class="btn btn-danger" onclick='deleteClientes("${data._id}")'>Eliminar</button>
        `);
    }
};

const initDataTable = async () => {
    await mostrarClientes(); //esto lo hago para que se carguen primero los datos en la tabla antes de destruir la tabla para que funcionen todas las funciones de datatable disponibles
    if (dataTableIsInitialized) {
        dataTable.destroy();
    }
    dataTable = $('#datatable_cliente').DataTable(dataTableOptions);

    dataTableIsInitialized = true;
}
/* 
    este es el codigo de mostrar clientes adaptado para que funcione con datatables
    en lugar de traer los datos llamando data recorriendolo con el foreach y mandando 1 a 1
    los <td> con sus respectivas variables como ${element.nombres} se usa 

    dataTable = $('#datatable_cliente').DataTable({
        ...dataTableOptions,
        data: data  // Pasar los datos directamente aquí
    });
    
    ya que ese código no se necesita cuando estamos usando DataTables correctamente,
    ya que DataTables se encarga de renderizar las filas por nosotros
*/
const mostrarClientes = async() => {  
    let request = sendRequest('clientes', 'GET', '');  
    request.onload = function () {  
        let data = request.response;

        if (dataTableIsInitialized) {
            dataTable.clear().rows.add(data).draw();  // Actualizar DataTables si ya estaba inicializada
        } else {
            $('#datatable_cliente').DataTable({
                ...dataTableOptions,
                data: data  // Pasar los datos directamente aquí
            });
            dataTableIsInitialized = true;
        }
    }  
}

/*
function mostrarClientes() {  
    let request = sendRequest('clientes', 'GET', '');  
    let table = document.getElementById('clientes-table');  
    table.innerHTML = "";  
    request.onload = function () {  
        let data = request.response;  
        //console.log(data);  
        data.forEach(element => {  
            table.innerHTML += `  
            <tr>  
                <td>${element.nombres}</td>  
                <td>${element.apellidos}</td>  
                <td>${element.documento}</td>  
                <td>${element.correo}</td>  
                <td>${element.telefono}</td>  
                <td>${element.direccion}</td>  
                
                <td>
                    <button type="button" class = "btn btn-primary" onclick = 'window.location = "formClientes.html?id=${element._id}"'>Editar</button>
                    <button type="button" class = "btn btn-danger" onclick = 'deleteClientes("${element._id}")'>Eliminar</button>
                </td>  
            </tr>
            `  
        });
    }  
}
*/
function deleteClientes(id){
    let request = sendRequest('clientes/'+id, 'DELETE', '');
    request.onload = function(){
        mostrarClientes();
    }
}

function guardarClientes() {  
    let nom = document.getElementById('nombres-n').value;  
    let ape = document.getElementById('apellidos-a').value;  
    let doc = document.getElementById('documento-d').value;  
    let cor = document.getElementById('correo-c').value;  
    let tel = document.getElementById('telefono-t').value;  
    let dir = document.getElementById('direccion-d').value;  
    let data = { 'nombres': nom, 'apellidos': ape, 'documento': doc, 'correo': cor, 'telefono': tel, 'direccion': dir  }
    let request = sendRequest('clientes/', 'POST', data);  
    request.onload = function () {  
        window.location = 'clientes.html';  
    }  
    
    request.onerror = function() {  
        console.log('Error al Guardar los datos');  
    }  
}

function cargarDatos(id){
    let request = sendRequest('clientes/'+id, 'GET', '');
    let nom = document.getElementById('nombres-n');  
    let ape = document.getElementById('apellidos-a');  
    let doc = document.getElementById('documento-d');  
    let cor = document.getElementById('correo-c');  
    let tel = document.getElementById('telefono-t');  
    let dir = document.getElementById('direccion-d');  

    request.onload = function(){
        let data = request.response;
        nom.value = data.nombres;
        ape.value = data.apellidos;
        doc.value = data.documento;
        cor.value = data.correo;
        tel.value = data.telefono;
        dir.value = data.direccion;
    }
    request.onerror = function(){
        console.log("error al cargar datos")
    }
}

function modificarClientes(id) {  
    let nom = document.getElementById('nombres-n').value;  
    let ape = document.getElementById('apellidos-a').value;  
    let doc = document.getElementById('documento-d').value;  
    let cor = document.getElementById('correo-c').value;  
    let tel = document.getElementById('telefono-t').value;  
    let dir = document.getElementById('direccion-d').value;  
    let data = { 'nombres': nom, 'apellidos': ape, 'documento': doc, 'correo': cor, 'telefono': tel, 'direccion': dir  }
    let request = sendRequest('clientes/'+id, 'PUT', data);  
    request.onload = function () {  
        window.location = 'clientes.html';  
    }  
    
    request.onerror = function() {  
        console.log('Error al Guardar los datos');  
    }  
}