let btnProductos = document.querySelector('.btn-ver-productos');
if(btnProductos){
    btnProductos.addEventListener('click', event=>{
    event.preventDefault();
    btnProductos.style.transform = 'translateX(1350px)';
    
    setTimeout(function(){
        window.location.href = './productos.html';
    },300);
});
}


let datos= [];

let btnSubmit = document.querySelector('#form-calificacion').addEventListener('submit',event=>{
    event.preventDefault();
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
    alert('Gracias 👏 por su comentario, seguiremos mejorando para garantizar una experiencia única 🎊');
});


/*Desplegar carrito */
function desplegarCarrito() {
    const carrito_contenedor = document.getElementById('carrito');
    carrito_contenedor.classList.toggle('mostrar');
    
    const btn_carrito = document.getElementById('btn-carrito');
    btn_carrito.classList.toggle('cambiarfondo');
}

let platos= [];
let index = 0;
const productsPorSlide = 1; 
let intervalId;
/* Petición a platos.json */
url = './Datos/platos.json';
fetch(url).then(res=>{
    if(!res.ok){
       console.error("Error al obtener los datos");
    }else{
        return res.json();
    }
}).then(data=>{
    platos = data;
    cargarPlatos();
    agregarEventos();
    slideAutomatico();
});

function cargarPlatos(){
    let contenedorProductos = document.querySelector('.carrusel');
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
                    <th>Precio</th>
                    <td class="precio-producto">${plato.precio}</td>
                </tr>
                <tr>
                    <th>Descripción</th>
                    <td class="descripcion-producto">${plato.descripcion}</td>
                </tr>
                <tr>
                    <th>Valoración</th>
                    <td>${plato.valoracion}</td>
                </tr>
            </table>`;

        // Agregar el nuevo producto al contenedor
        contenedorProductos.appendChild(producto);
        
    });
    
}
let carrito = {};


function agregarEventos(){
    const btnAgregarCarrito = document.querySelectorAll('.btn-agregar-carrito');
    const btnPagar = document.getElementById('btn-pagar');
    
    // Cargar carrito desde el localStorage si existe
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        actualizarCarrito(); // Mostrar el carrito cargado
    }
    
    
    btnAgregarCarrito.forEach(button => {
        button.addEventListener('click', function() {
            // Obtener el contenedor del producto clickeado
            const producto = this.closest('.producto');
    
            const nombre = producto.querySelector('.nombre-producto').innerText;
            const precio = producto.querySelector('.precio-producto').innerText;
    
            if (carrito[nombre]) {
                carrito[nombre].cantidad++;
            } else {
                carrito[nombre] = {
                    nombre: nombre,
                    precio: precio,
                    cantidad: 1
                };
            }
    
            // Actualizar el carrito en la vista
            actualizarCarrito();
        });
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
                <button class="btn-incremento" cantidad-producto="${producto}">+</button>
            `;

            listaCarrito.appendChild(li);
            hayProductos = true;
        }
        if(hayProductos){
            btnPagar.style.display = 'block';
        }else{
            btnPagar.style.display = 'none';
        }
        // Asignar los eventos a los botones de incremento y decremento
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
    }

    btnPagar.addEventListener('click', function() {
        alert('Compra realizada con éxito. ¡Gracias por su compra!');
        // Después de pagar, vaciamos el carrito
        for (const producto in carrito) {
            delete carrito[producto];
        }
        actualizarCarrito();
    });
}
/* Función para avanzar automáticamente */
function slideAutomatico() {
    clearInterval(intervalId);

    // Iniciar el auto-deslizador
    intervalId = setInterval(() => {
        slideSiguiente();
    }, 2500); // Cambiar cada 3 segundos
    
}

/* Función para deslizar hacia el siguiente conjunto de productos */
function slideSiguiente() {
    let carrusel = document.querySelector('.carrusel');
    const totalSlides = (platos.length / productsPorSlide)-2;
    index++;
    if (index >= totalSlides) {
        index = 0; // Reiniciar cuando se alcanza el final
    }
    carrusel.style.transform = `translateX(-${index*34.1}%)`;
}

/* Función para deslizar hacia el conjunto anterior de productos */
function slideAnterior() {
    let carrusel = document.querySelector('.carrusel');
    const totalSlides = (platos.length / productsPorSlide)-2;
    index--;
    if (index < 0) {
        index = totalSlides - 1; // Volver al final si se llega al principio
    }
    carrusel.style.transform = `translateX(-${index*34.1}%)`;
}

/* Asignar eventos a los botones de navegación */
document.querySelector('.next').addEventListener('click',  () => {
    slideSiguiente();
    slideAutomatico();
});
    
document.querySelector('.prev').addEventListener('click', () => {
    slideAnterior();
    slideAutomatico();
});

window.onload = function() {
    slideAutomatico(); 
};