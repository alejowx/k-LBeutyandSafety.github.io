// js/maquillaje-filtros.js

// Base de datos de productos de maquillaje (puedes agregar más aquí)
const productosMaquillaje = [
    {
        id: "torre-multirubor",
        nombre: "Torre Multirubor Trendy",
        precio: 16000,
        imagen: "images/productos/Torre Multirubor Trendy. Valor 16k.png",
        tipo: "rubores",
        acabado: "brillante",
        descripcion: "Rubor multitono Trendy",
        destacado: true
    },
    {
        id: "safari-boom",
        nombre: "Sombras Safari Boom Trendy",
        precio: 16000,
        imagen: "images/productos/Sombras Safari Boom Trendy. Valor 16k.png",
        tipo: "ojos",
        acabado: "mate",
        descripcion: "Paleta de sombras Safari Boom",
        destacado: true
    },
    {
        id: "rubor-verguenza",
        nombre: "Rubor Vergüenza Intensamente Trendy",
        precio: 20000,
        imagen: "images/productos/Rubor Vergüenza Intensamente Trendy. Valor 20k.png",
        tipo: "rubores",
        acabado: "mate",
        descripcion: "Rubor intenso Trendy",
        destacado: true
    },
    {
        id: "polvos-traslucidos",
        nombre: "Polvos sueltos traslucido bakery flour Trendy",
        precio: 15000,
        imagen: "images/productos/Polvos sueltos traslucido bakery flour Trendy.JPG",
        tipo: "polvos",
        acabado: "satinado",
        descripcion: "Polvos traslúcidos Trendy",
        destacado: true
    },
    // Productos adicionales (puedes agregar más)
    {
        id: "labial-trendy-1",
        nombre: "LIP OIL Sandia Trendy",
        precio: 12000,
        imagen: "images/productos/LIP OIL Sandia Trendy.png",
        tipo: "labiales",
        acabado: "Brillante",
        descripcion: "LIP OIL Sandia Trendy",
        destacado: false
    },
    {
        id: "labial-trendy-2",
        nombre: "Kit de Labios Furia Trendy.",
        precio: 25000,
        imagen: "images/productos/Kit de Labios Furia Trendy..png",
        tipo: "labiales",
        acabado: "mate",
        descripcion: "Kit de Labios Furia Trendy.",
        destacado: false
    },
    {
        id: "Kit de cejas Bakery Trendy.",
        nombre: "Kit de cejas Bakery Trendy.",
        precio: 15000,
        imagen: "images/productos/Kit de cejas Bakery Trendy..png",
        tipo: "sombras",
        acabado: "mate",
        descripcion: "Kit de cejas Bakery Trendy.",
        destacado: false
    },
    {
        id: "Delineador Plumon Artist Collection Trendy.",
        nombre: "Delineador Plumon Artist Collection Trendy.",
        precio: 16000,
        imagen: "images/productos/Delineador Plumon Artist Collection Trendy..png",
        tipo: "ojos",
        acabado: "satinado",
        descripcion: "Delineador Plumon Artist Collection Trendy.",
        destacado: false
    },
    {
        id: "Corrector Magic Trendy.",
        nombre: "Corrector Magic Trendy.",
        precio: 12000,
        imagen: "images/productos/Corrector Magic Trendy..png",
        tipo: "ojos",
        acabado: "mate",
        descripcion: "Corrector Magic Trendy.",
        destacado: false
    },
    
];

// Configuración de paginación
const ITEMS_POR_PAGINA = 6;
let paginaActual = 1;
let productosFiltrados = [...productosMaquillaje];

// Función para renderizar productos
function renderizarProductos() {
    const grid = document.getElementById('productos-grid');
    if (!grid) return;

    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const fin = inicio + ITEMS_POR_PAGINA;
    const productosPagina = productosFiltrados.slice(inicio, fin);

    if (productosPagina.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <span class="material-symbols-outlined text-6xl text-primary/30 mb-4">search_off</span>
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">No hay productos</h3>
                <p class="text-slate-500">No encontramos productos que coincidan con los filtros seleccionados.</p>
            </div>
        `;
    } else {
        grid.innerHTML = productosPagina.map(producto => `
            <div class="group cursor-pointer producto-card" data-id="${producto.id}">
                <div class="relative overflow-hidden rounded-xl aspect-[4/5] mb-4 bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
                    <div class="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110" 
                         style='background-image: url("${producto.imagen}"); background-size: cover; background-repeat: no-repeat; background-position: center;'></div>
                    <div class="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                        <button class="btn-agregar-carrito w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xl uppercase tracking-widest"
                                data-id="${producto.id}"
                                data-nombre="${producto.nombre}"
                                data-precio="${producto.precio}"
                                data-imagen="${producto.imagen}"
                                data-categoria="${producto.tipo}"
                                data-descripcion="${producto.descripcion}">
                            <span class="material-symbols-outlined text-sm">shopping_cart</span> Añadir al Carrito
                        </button>
                    </div>
                </div>
                <div class="px-2">
                    <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-1">${producto.tipo.charAt(0).toUpperCase() + producto.tipo.slice(1)} • Trendy</p>
                    <h3 class="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1 leading-tight">${producto.nombre}</h3>
                    <p class="text-primary font-extrabold">$${producto.precio.toLocaleString('es-CO')} COP</p>
                </div>
            </div>
        `).join('');
    }

    // Actualizar contadores
    document.getElementById('total-productos').textContent = productosFiltrados.length;
    const inicioMostrado = productosFiltrados.length > 0 ? (paginaActual - 1) * ITEMS_POR_PAGINA + 1 : 0;
    const finMostrado = Math.min(paginaActual * ITEMS_POR_PAGINA, productosFiltrados.length);
    document.getElementById('productos-inicio').textContent = inicioMostrado;
    document.getElementById('productos-fin').textContent = finMostrado;

    renderizarPaginacion();
    inicializarBotonesCarrito();
}

// Función para renderizar paginación
function renderizarPaginacion() {
    const paginacion = document.getElementById('paginacion');
    if (!paginacion) return;

    const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA);
    
    if (totalPaginas <= 1) {
        paginacion.innerHTML = '';
        return;
    }

    let html = '';

    // Botón anterior
    html += `
        <button class="btn-paginacion w-10 h-10 flex items-center justify-center rounded-full border border-primary/20 hover:bg-primary/5 transition-colors ${paginaActual === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                data-pagina="${paginaActual - 1}" ${paginaActual === 1 ? 'disabled' : ''}>
            <span class="material-symbols-outlined text-sm">chevron_left</span>
        </button>
    `;

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= paginaActual - 1 && i <= paginaActual + 1)) {
            html += `
                <button class="btn-paginacion w-10 h-10 flex items-center justify-center rounded-full border border-primary/20 text-sm transition-colors ${i === paginaActual ? 'bg-primary text-white border-primary' : 'hover:bg-primary/5'}"
                        data-pagina="${i}">
                    ${i}
                </button>
            `;
        } else if (i === paginaActual - 2 || i === paginaActual + 2) {
            html += `
                <span class="w-10 h-10 flex items-center justify-center text-sm text-slate-400">...</span>
            `;
        }
    }

    // Botón siguiente
    html += `
        <button class="btn-paginacion w-10 h-10 flex items-center justify-center rounded-full border border-primary/20 hover:bg-primary/5 transition-colors ${paginaActual === totalPaginas ? 'opacity-50 cursor-not-allowed' : ''}"
                data-pagina="${paginaActual + 1}" ${paginaActual === totalPaginas ? 'disabled' : ''}>
            <span class="material-symbols-outlined text-sm">chevron_right</span>
        </button>
    `;

    paginacion.innerHTML = html;

    // Agregar eventos a botones de paginación
    document.querySelectorAll('.btn-paginacion:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
            const nuevaPagina = parseInt(btn.dataset.pagina);
            if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
                paginaActual = nuevaPagina;
                renderizarProductos();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// Función para aplicar filtros
function aplicarFiltros() {
    // Obtener filtros de tipo
    const tiposSeleccionados = Array.from(document.querySelectorAll('.filtro-checkbox[data-filtro="tipo"]:checked'))
        .map(cb => cb.dataset.valor);

    // Obtener filtros de acabado
    const acabadosSeleccionados = Array.from(document.querySelectorAll('.filtro-checkbox[data-filtro="acabado"]:checked'))
        .map(cb => cb.dataset.valor);

    // Obtener filtro de precio
    const precioMax = parseInt(document.getElementById('filtro-precio').value);

    // Aplicar filtros
    productosFiltrados = productosMaquillaje.filter(producto => {
        // Filtro por tipo
        if (tiposSeleccionados.length > 0 && !tiposSeleccionados.includes(producto.tipo)) {
            return false;
        }

        // Filtro por acabado
        if (acabadosSeleccionados.length > 0 && !acabadosSeleccionados.includes(producto.acabado)) {
            return false;
        }

        // Filtro por precio
        if (producto.precio > precioMax) {
            return false;
        }

        return true;
    });

    // Aplicar ordenamiento
    const orden = document.getElementById('ordenar-por').value;
    ordenarProductos(orden);

    // Resetear a primera página
    paginaActual = 1;
    renderizarProductos();
}

// Función para ordenar productos
function ordenarProductos(orden) {
    switch(orden) {
        case 'menor-precio':
            productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
        case 'mayor-precio':
            productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
        case 'nombre':
            productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'destacados':
        default:
            productosFiltrados.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
            break;
    }
}

// Función para limpiar filtros
function limpiarFiltros() {
    document.querySelectorAll('.filtro-checkbox').forEach(cb => {
        cb.checked = false;
    });
    
    document.getElementById('filtro-precio').value = 100000;
    document.getElementById('ordenar-por').value = 'destacados';
    
    productosFiltrados = [...productosMaquillaje];
    paginaActual = 1;
    renderizarProductos();
}

// Función para inicializar botones del carrito
function inicializarBotonesCarrito() {
    if (typeof carrito === 'undefined') {
        console.error('El carrito no está disponible');
        return;
    }

    document.querySelectorAll('.btn-agregar-carrito').forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const producto = {
                id: this.dataset.id,
                nombre: this.dataset.nombre,
                precio: this.dataset.precio,
                imagen: this.dataset.imagen,
                categoria: this.dataset.categoria,
                descripcion: this.dataset.descripcion || ''
            };
            
            carrito.agregarProducto(producto);
        });
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar productos iniciales
    renderizarProductos();

    // Event listeners para filtros
    document.querySelectorAll('.filtro-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });

    // Event listener para filtro de precio
    const filtroPrecio = document.getElementById('filtro-precio');
    if (filtroPrecio) {
        filtroPrecio.addEventListener('input', function() {
            document.getElementById('precio-max').textContent = `$${parseInt(this.value).toLocaleString('es-CO')}`;
        });
        
        filtroPrecio.addEventListener('change', aplicarFiltros);
    }

    // Event listener para ordenamiento
    document.getElementById('ordenar-por').addEventListener('change', function() {
        ordenarProductos(this.value);
        paginaActual = 1;
        renderizarProductos();
    });

    // Event listener para limpiar filtros
    document.getElementById('btn-limpiar-filtros').addEventListener('click', limpiarFiltros);
});