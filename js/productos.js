let dataTable;
let dataTableIsInitialized = false;
const baseURL = 'https://backend256-sz1q.onrender.com'; //url para despues cargar las imagenes

const dataTableOptions = {
    pageLength: 5,
    destroy: true,
    language: {  
        lengthMenu: "Mostrar _MENU_ registros por página",  
        zeroRecords: "Ningún producto encontrado",  
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",  
        infoEmpty: "Ningún producto encontrado",  
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
        { data: null },
        { data: 'nombre' },
        { data: 'descripcion' },
        { data: 'precio' },
        { data: 'stock' },
        { data: 'categoria' },
        { data: 'imagen', render: function(data, type, row) {
            return data ? `<img src="${baseURL}${data}" alt="Imagen del Producto" class="product-image" style="width: 50px; height: auto; cursor: pointer;">` : '';
        }},
        { data: 'fechaSubida', render: function(data, type, row) {
            let date = new Date(data);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }},
        { data: null, defaultContent: '' }
    ],
    
    createdRow: function(row, data, dataIndex) {
        // Añadir la numeración aquí
        $('td', row).eq(0).html(dataIndex + 1);

        // Añadir botones de acción en la última columna
        $('td', row).eq(8).html(`
            <button type="button" class="btn btn-primary" onclick='window.location = "formProductos.html?id=${data._id}"'>Editar</button>
            <button type="button" class="btn btn-danger" onclick='deleteProducto("${data._id}")'>Eliminar</button>
        `);

        // Agregar evento click a las imágenes
        $(row).find('.product-image').on('click', function() {
            $('#modalImage').attr('src', `${baseURL}${data.imagen}`);
            $('#imageModal').modal('show');
        });
    }
};

const initDataTable = async () => {
    await mostrarProductos();

    if (dataTableIsInitialized) {
        dataTable.destroy();
    }

    dataTable = $('#datatable_producto').DataTable(dataTableOptions);
    dataTableIsInitialized = true;
}

const mostrarProductos = async() => {  
    let request = sendRequest('productos', 'GET', '');  
    request.onload = function () {  
        let data = request.response;

        if (dataTableIsInitialized) {
            dataTable.clear().rows.add(data).draw();  // Actualizar DataTables si ya estaba inicializada
        } else {
            $('#datatable_producto').DataTable({
                ...dataTableOptions,
                data: data  // Pasar los datos directamente aquí
            });
            dataTableIsInitialized = true;
        }
    }  
}

function deleteProducto(id){
    let request = sendRequest('productos/'+id, 'DELETE', '');
    request.onload = function(){
        mostrarProductos();
    }
}
/*esta funcion tuve que rediseñarla porque me generaba problemas al subir la imagen la anterior funcion que tengo comentada
    esta es la nueva funcion utilizando un metodo diferente que se llama formData
    esto me obligo a modificar el archivo request para que reciba
    imagenes en sus parametros
*/
async function guardarProducto() {  
    const form = document.getElementById('productoForm');
    const formData = new FormData(form);

    let request = sendRequest('productos/', 'POST', formData, true);
    request.onload = function() {  
        window.location = 'productos.html';  
    }  
    request.onerror = function() {  
        console.log('Error al Guardar los datos');  
    }  
}


/*
function guardarProducto() {  
    let nombre = document.getElementById('nombre-p').value;  
    let descripcion = document.getElementById('descripcion-p').value;  
    let precio = document.getElementById('precio-p').value;  
    let stock = document.getElementById('stock-p').value;  
    let categoria = document.getElementById('categoria-p').value;  
    let imagen = document.getElementById('imagen-p').value;
    let data = { 'nombre': nombre, 'descripcion': descripcion, 'precio': precio, 'stock': stock, 'categoria': categoria, 'imagen': imagen }
    let request = sendRequest('productos/', 'POST', data);  
    request.onload = function () {  
        window.location = 'productos.html';  
    }  
    
    request.onerror = function() {  
        console.log('Error al Guardar los datos');  
    }  
}
*/
function cargarDatos(id){
    let request = sendRequest('productos/'+id, 'GET', '');
    let nom = document.getElementById('nombre-p');  
    let desc = document.getElementById('descripcion-p');  
    let pre = document.getElementById('precio-p');  
    let sto = document.getElementById('stock-p');  
    let categ = document.getElementById('categoria-p');
    let imgPr = document.getElementById('imgPrevia');

    request.onload = function(){
        let data = request.response;
        nom.value = data.nombre;
        desc.value = data.descripcion;
        pre.value = data.precio;
        sto.value = data.stock;
        categ.value = data.categoria;
        
        imgPr.src = `${baseURL}${data.imagen}`;
    }
    request.onerror = function(){
        console.log("error al cargar datos");
    }
}


/*Aqui tambien debo usar formData y por lo que modifico el request
    debo pasar los parametros que añadi en el request para pasar archivos
    */

function modificarProducto(id) {
    const form = document.getElementById('productoForm');
    const formData = new FormData(form);

    let request = sendRequest(`productos/${id}`, 'PUT', formData, true);
    request.onload = function() {  
        window.location = 'productos.html';  
    }  
    request.onerror = function() {  
        console.log('Error al Guardar los datos');  
    }  
}

/*
function modificarProducto(id) {  
    let nombre = document.getElementById('nombre-p').value;  
    let descripcion = document.getElementById('descripcion-p').value;  
    let precio = document.getElementById('precio-p').value;  
    let stock = document.getElementById('stock-p').value;  
    let categoria = document.getElementById('categoria-p').value;  
    let imagen = document.getElementById('imagen-p').value;  
    let data = { 'nombre': nombre, 'descripcion': descripcion, 'precio': precio, 'stock': stock, 'categoria': categoria, 'imagen': imagen }
    let request = sendRequest('productos/' + id, 'PUT', data);  
    request.onload = function () {  
        window.location = 'productos.html';  
    }  
    
    request.onerror = function() {  
        console.log('Error al Guardar los datos');  
    }  
}
*/


/*     funciones para el listarProductos      */


window.onload = function() {
    cargarProductos();
}

async function cargarProductos() {
    let request = sendRequest('productos', 'GET', '');
    request.onload = function() {
        let productos = request.response;
        listarProductos(productos);
    }
    request.onerror = function() {
        console.log("Error al cargar productos");
    }
}

function listarProductos(productos) {
    let productosList = document.getElementById('productos-list');
    productosList.innerHTML = '';

    productos.forEach(producto => {
        let card = `
        <div class="col">
            <div class="card h-100">
                <img src="${baseURL}${producto.imagen}" class="card-img-top" alt="Imagen del Producto">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text"><strong>$${producto.precio}</strong></p>
                    <button class="btn btn-success">Agregar al Carrito</button>
                </div>
            </div>
        </div>
        `;
        productosList.innerHTML += card;
    });
}

function filtrarProductos() {
    const nombre = document.getElementById('nombre').value.toLowerCase();
    let request = sendRequest('productos', 'GET', '');
    request.onload = function() {
        let productos = request.response;
        let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(nombre));
        listarProductos(productosFiltrados);
    }
    request.onerror = function() {
        console.log("Error al cargar productos");
    }
}

