window.onload = function() {
    // Recuperar carrito del localStorage
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || {};
    console.log("carito:",carritoGuardado);
    // Si hay productos en el carrito, actualizamos la vista
    if (Object.keys(carritoGuardado).length > 0) {
        carrito = carritoGuardado;
        actualizarCarrito(); // Mostrar los productos en el carrito
    } 
};

function actualizarCarrito(){
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || {};
    const listaCarrito = document.getElementById('cart-list');
    listaCarrito.innerHTML = ''; // Limpiar la lista

    let total = 0;
    
    for (const producto in carritoGuardado) {
        const item = carritoGuardado[producto];
        const li = document.createElement('li');
        li.innerHTML = 
        `<div class="item-carrito">
            <img src="${item.imagen}" alt="${item.nombre}" class="imagen-producto">
            <div class="detalle-producto">
                <span>${item.nombre}</span>
                <span>Precio: S/.${item.precio}</span>
                <span>Cantidad: ${item.cantidad}</span>
            </div>
        </div>`;
        listaCarrito.appendChild(li);
        
        total += parseFloat(item.precio) * item.cantidad;
    }

    document.querySelector('.total').textContent = `Total: S/.${total.toFixed(2)}`;
}
document.getElementById('btn-realizar-pago').addEventListener('click', function() {
    const carrito = obtenerCarrito();
    console.log('micarro', calcularMontoTotal());
    const total = calcularMontoTotal();

    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const direccion = document.getElementById('direccion').value.trim();

    if( nombres === '' || apellidos === '' || dni === '' || telefono === '' || email === '' || direccion === ''){
        
        alert('Por favor, complete todos los campos antes de continuar.');
    }else 
    if(total === '0.00'){
            document.getElementById('btn-realizar-pago').disabled = true;

        }else{
            document.getElementById('btn-realizar-pago').disabled = false;
            document.getElementById('formulario-pago').style.display = 'block'; // Muestra el formulario de pago
        }
    
});


document.getElementById('metodo-pago').addEventListener('change', function() {
    const metodoSeleccionado = this.value;
    const datosPago = document.getElementById('datos-pago');
    const infoTarjeta = document.getElementById('info-tarjeta');

    if (metodoSeleccionado === 'tarjeta') {
        datosPago.style.display = 'none';
        infoTarjeta.style.display = 'block';
    } else if (metodoSeleccionado === 'yape') {
        infoTarjeta.style.display = 'none';
        datosPago.style.display = 'block';
    } else {
        datosPago.style.display = 'none';
        infoTarjeta.style.display = 'none';
    }
});



// Función para realizar el pedido
document.getElementById('btn-confirmar-pago').addEventListener('click', function(){

    // Elimina el carrito de localStorage
    document.getElementById('formulario-pago').style.display = 'none';
    document.getElementById('datos-pago').style.display='none';
    document.getElementById('registro-form').reset();
    localStorage.removeItem('carrito');
    actualizarCarrito();
    window.location.href = './confirmacion.html';
    

});
document.getElementById('btn-confirmar-pago-tarjeta').addEventListener('click', function(){

    // Elimina el carrito de localStorage
    document.getElementById('formulario-pago').style.display = 'none';
    document.getElementById('datos-pago').style.display='none';
    document.getElementById('registro-form').reset();
    localStorage.removeItem('carrito');
    actualizarCarrito();
    window.location.href = './confirmacion.html';
    

});


function calcularMontoTotal() {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || {};
    let total = 0;

    for (const producto in carritoGuardado) {
        const item = carritoGuardado[producto];
        total += parseFloat(item.precio) * item.cantidad;
    }

    return total.toFixed(2); // Retorna el total como string con 2 decimales
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || {};
}


