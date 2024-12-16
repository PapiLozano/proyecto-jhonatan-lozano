
/*Desplegar carrito */
function desplegarCarrito() {
    const carrito_contenedor = document.getElementById('carrito');
    carrito_contenedor.classList.toggle('mostrar');
    
    const btn_carrito = document.getElementById('btn-carrito');
    btn_carrito.classList.toggle('cambiarfondo');
}

window.onload = function() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito(); // Mostrar el carrito en la página
    }
};

let platos= [];
let index = 0;
let carrito = {};
/*peticion a platos.json */
url = './Datos/platos.json'
fetch(url).then(res=>{
    if(!res.ok){
    }else{
        return res.json();
    }
}).then(data=>{
    platos = data;
    console.log(data);
    cargarPlatos();
    agregarEventos();
});

function cargarPlatos(){
    let contenedorProductos = document.querySelector('.container-productos');
    contenedorProductos.innerHTML = ''; // Limpiar el contenedor antes de cargar los platos

    // Iterar sobre los platos para crear los elementos HTML
    platos.forEach(plato => {
        let producto = document.createElement('div');
        producto.classList.add('producto');

        producto.innerHTML = `
            <img src="${plato.imagen}" alt="Imagen de ${plato.nombre}">
            <table>
                <tr>
                    <th>Nombre</th>
                    <td class="nombre-producto">${plato.nombre}</td>
                </tr>
                <tr>
                    <th>Precio (S/.)</th>
                    <td class="precio-producto">S/.${plato.precio}</td>
                </tr>
                <tr>
                    <th>Descripción</th>
                    <td class="descripcion-producto">${plato.descripcion}</td>
                </tr>
                <tr>
                    <th>Valoración</th>
                    <td>${plato.valoracion}</td>
                </tr>
            </table>
            <button class="btn-agregar-carrito">Agregar al carrito</button>
        `;

        // Agregar el nuevo producto al contenedor
        contenedorProductos.appendChild(producto);
        
    });
    
    
}

function agregarEventos(){
/* Agregar productos al carrito */

const btnAgregarCarrito = document.querySelectorAll('.btn-agregar-carrito');
const btnPagar = document.getElementById('btn-pagar');

btnAgregarCarrito.forEach(button => {
    button.addEventListener('click', function() {
        // Obtener el contenedor del producto clickeado
        const producto = this.closest('.producto');

        const nombre = producto.querySelector('.nombre-producto').innerText;
        const precio = parseFloat(producto.querySelector('.precio-producto').innerText.replace('S/.',''));
        const imagen = producto.querySelector('img').src;
        if (carrito[nombre]) {
            carrito[nombre].cantidad++;
        } else {
            carrito[nombre] = {
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: 1,
                
            };
        }
        
        // Actualizar el carrito en la vista
        actualizarCarrito();
    });
});

    //Asignar los eventos a los botones de incremento y decremento
    document.querySelectorAll('.btn-incremento').forEach(button => {
        button.addEventListener('click', function() {
            const producto = this.getAttribute('cantidad-producto');
            if(carrito[producto].cantidad <20){
                carrito[producto].cantidad++;
            } 
            actualizarCarrito();
        });
    });

    document.querySelectorAll('.btn-decremento').forEach(button => {
        button.addEventListener('click', function() {
            const producto = this.getAttribute('cantidad-producto');
            if (carrito[producto].cantidad > 1) {
                carrito[producto].cantidad--;
            } else {
                delete carrito[producto]; // Eliminar el producto si la cantidad llega a 0
            }
            actualizarCarrito();
        });
    });

    btnPagar.addEventListener('click', (e)=>{
        e.preventDefault();
        // Después de pagar, vaciamos el carrito
        window.location.href = './pedido.html';
    });

    function actualizarCarrito() {
        const listaCarrito = document.getElementById('lista-carrito');
        listaCarrito.innerHTML = ''; // Limpiamos la lista
        let hayProductos= false;
        for (const producto in carrito) {
            const item = carrito[producto];
            const li = document.createElement('li');
            
            li.innerHTML = `
                ${item.nombre} - S/.${item.precio} - Cantidad: ${item.cantidad}
                <button class="btn-decremento" cantidad-producto="${producto}">-</button>
                <button class="btn-incremento" cantidad-producto="${producto}">+</button>`;
    
            listaCarrito.appendChild(li);
            hayProductos = true;
            console.log(carrito);
        }
        if(hayProductos){
            btnPagar.style.display = 'block';
        }else{
            btnPagar.style.display = 'none';
        }
    
        listaCarrito.innerHTML+= `<p>Total a Pagar :S/.${CalcularTotal(carrito)} </p>`;
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
    

    
}
function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    listaCarrito.innerHTML = ''; // Limpiamos la lista
    let hayProductos= false;
    for (const producto in carrito) {
        const item = carrito[producto];
        const li = document.createElement('li');
        
        li.innerHTML = `
            ${item.nombre} - S/.${item.precio} - Cantidad: ${item.cantidad}
            <button class="btn-decremento" cantidad-producto="${producto}">-</button>
            <button class="btn-incremento" cantidad-producto="${producto}">+</button>`;

        listaCarrito.appendChild(li);
        hayProductos = true;
        console.log(carrito);
    }
    if(hayProductos){
        btnPagar.style.display = 'block';
    }else{
        btnPagar.style.display = 'none';
    }

    listaCarrito.innerHTML+= `<p>Total a Pagar :S/.${CalcularTotal(carrito)} </p>`;
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function CalcularTotal(carrito) {
    let total = 0;
    for (const producto in carrito) {
        // Remover el texto "S/." del precio y convertir a numero
        let precio = carrito[producto].precio;
        console.log(precio);
        total += parseFloat(precio) * parseFloat(carrito[producto].cantidad);
    }
    return total.toFixed(2); // Devolver con dos decimales
}
