// js/carrito.js

// Clase para manejar el carrito de compras
class CarritoCompras {
    constructor() {
        this.carrito = this.obtenerCarrito();
        this.actualizarContador();
    }

    // Detectar si es dispositivo móvil
    esDispositivoMovil() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Abrir Instagram según el dispositivo
    abrirInstagram() {
        const username = '15klbeauty'; // Tu usuario de Instagram
        
        if (this.esDispositivoMovil()) {
            window.location.href = `instagram://user?username=${username}`;
            setTimeout(() => {
                window.open(`https://www.instagram.com/${username}/`, '_blank');
            }, 1000);
        } else {
            window.open(`https://www.instagram.com/${username}/`, '_blank');
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje) {
        const notificacionesExistentes = document.querySelectorAll('.notificacion-carrito');
        notificacionesExistentes.forEach(n => n.remove());

        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion-carrito fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }

    // Obtener carrito del localStorage
    obtenerCarrito() {
        const carritoGuardado = localStorage.getItem('klCarrito');
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }

    // Guardar carrito en localStorage
    guardarCarrito() {
        localStorage.setItem('klCarrito', JSON.stringify(this.carrito));
        this.actualizarContador();
        this.actualizarPaginaCarrito();
    }

    // Actualizar el contador en el header
    actualizarContador() {
        const contadores = document.querySelectorAll('.carrito-contador');
        const totalItems = this.carrito.reduce((total, item) => total + item.cantidad, 0);
        
        contadores.forEach(contador => {
            if (totalItems > 0) {
                contador.textContent = totalItems;
                contador.classList.remove('hidden');
            } else {
                contador.classList.add('hidden');
            }
        });
    }

    // Agregar producto al carrito
    agregarProducto(producto) {
        if (!producto.id || !producto.nombre || !producto.precio) {
            console.error('Producto inválido:', producto);
            return;
        }

        if (typeof producto.precio === 'string') {
            producto.precio = parseInt(producto.precio.replace(/[^0-9]/g, '')) || 0;
        }

        const existente = this.carrito.find(item => item.id === producto.id);
        
        if (existente) {
            existente.cantidad += 1;
        } else {
            this.carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        this.guardarCarrito();
        this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    }

    // Eliminar producto del carrito
    eliminarProducto(productoId) {
        const producto = this.carrito.find(item => item.id === productoId);
        this.carrito = this.carrito.filter(item => item.id !== productoId);
        this.guardarCarrito();
        if (producto) {
            this.mostrarNotificacion(`${producto.nombre} eliminado del carrito`);
        }
    }

    // Actualizar cantidad de un producto
    actualizarCantidad(productoId, nuevaCantidad) {
        if (nuevaCantidad < 1) {
            this.eliminarProducto(productoId);
            return;
        }
        
        const producto = this.carrito.find(item => item.id === productoId);
        if (producto) {
            producto.cantidad = nuevaCantidad;
            this.guardarCarrito();
        }
    }

    // Calcular subtotal
    calcularSubtotal() {
        return this.carrito.reduce((total, item) => {
            const precio = this.convertirAPrecioNumerico(item.precio);
            return total + (precio * item.cantidad);
        }, 0);
    }

    // Convertir precio de string a número
    convertirAPrecioNumerico(precio) {
        if (typeof precio === 'number') return precio;
        if (!precio) return 0;
        return parseInt(precio.toString().replace(/[^0-9]/g, '')) || 0;
    }

    // Formatear precio en COP
    formatearPrecioCOP(precio) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(precio);
    }

    // Actualizar la página del carrito si estamos en ella
    actualizarPaginaCarrito() {
        if (window.location.pathname.includes('carrito.html')) {
            this.renderizarCarrito();
        }
    }

    // Mejorar la visualización del carrito en móviles
    mejorarVistaMovil() {
        if (window.innerWidth <= 640) {
            const productosCarrito = document.querySelectorAll('.producto-carrito');
            productosCarrito.forEach(producto => {
                producto.classList.add('text-center');
                
                const cantidadContainer = producto.querySelector('.flex.items-center.border');
                if (cantidadContainer) {
                    cantidadContainer.classList.add('mx-auto');
                }
            });
        }
    }

    // Renderizar el carrito en la página
    renderizarCarrito() {
        const contenedor = document.querySelector('.contenedor-carrito');
        const resumen = document.querySelector('.resumen-carrito');
        
        if (!contenedor) return;

        if (this.carrito.length === 0) {
            contenedor.innerHTML = `
                <div class="text-center py-16">
                    <span class="material-symbols-outlined text-6xl text-primary/30 mb-4">shopping_bag</span>
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tu carrito está vacío</h3>
                    <p class="text-slate-500 mb-8">¡Explora nuestros productos y encuentra tu favorito!</p>
                    <a href="maquillaje.html" class="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-bold transition-all">
                        Ver Productos
                    </a>
                </div>
            `;
            if (resumen) {
                resumen.innerHTML = `
                    <div class="bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-primary/10 sticky top-32">
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Resumen del Pedido</h2>
                        <p class="text-slate-500 text-center py-4">Agrega productos para ver el resumen</p>
                    </div>
                `;
            }
            return;
        }

        let html = '';
        let subtotal = 0;

        this.carrito.forEach(item => {
            const precioNum = this.convertirAPrecioNumerico(item.precio);
            const itemTotal = precioNum * item.cantidad;
            subtotal += itemTotal;
            
            html += `
                <div class="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-primary/10 producto-carrito" data-id="${item.id}">
                    <div class="w-32 h-40 rounded-xl bg-center bg-cover flex-shrink-0" style='background-image: url("${item.imagen || 'https://via.placeholder.com/128x160'}");'></div>
                    <div class="flex-1 w-full">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">${item.categoria || 'Producto'}</p>
                                <h3 class="font-bold text-xl text-slate-900 dark:text-slate-100">${item.nombre}</h3>
                            </div>
                            <button class="btn-eliminar text-slate-400 hover:text-primary transition-colors" data-id="${item.id}">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                        <p class="text-slate-500 dark:text-slate-400 text-sm mb-4">${item.descripcion || ''}</p>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center border border-primary/20 rounded-lg">
                                <button class="btn-disminuir px-3 py-1 hover:bg-primary/5 transition-colors text-primary font-bold" data-id="${item.id}">-</button>
                                <span class="cantidad-producto px-4 py-1 font-semibold text-sm">${item.cantidad}</span>
                                <button class="btn-aumentar px-3 py-1 hover:bg-primary/5 transition-colors text-primary font-bold" data-id="${item.id}">+</button>
                            </div>
                            <span class="font-bold text-lg text-slate-900 dark:text-white">${this.formatearPrecioCOP(itemTotal)}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        contenedor.innerHTML = html;
        
        if (resumen) {
            resumen.innerHTML = `
                <div class="bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-primary/10 sticky top-32">
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Resumen del Pedido</h2>
                    <div class="space-y-4 mb-8">
                        <div class="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Subtotal</span>
                            <span>${this.formatearPrecioCOP(subtotal)}</span>
                        </div>
                        <div class="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Envío</span>
                            <span>${this.formatearPrecioCOP(0)}</span>
                        </div>
                        <div class="flex justify-between text-slate-600 dark:text-slate-400 italic text-sm">
                            <span>Envío estándar gratuito aplicado</span>
                        </div>
                        <div class="pt-4 border-t border-primary/10 flex justify-between items-end">
                            <span class="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                            <div class="text-right">
                                <p class="text-2xl font-black text-primary">${this.formatearPrecioCOP(subtotal)}</p>
                                <p class="text-[10px] text-slate-400 uppercase tracking-widest">Impuestos incluidos</p>
                            </div>
                        </div>
                    </div>
                    <button id="btn-finalizar-compra" class="inline-block w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 text-lg uppercase tracking-wide text-center">
                        Finalizar Compra
                    </button>
                    
                    <div class="mt-8 pt-8 border-t border-primary/10">
                        <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Código de Descuento</p>
                        <div class="flex gap-2">
                            <input class="bg-primary/5 border-primary/10 rounded-lg text-sm w-full focus:ring-primary focus:border-primary placeholder:text-slate-400" placeholder="Ingresa tu código" type="text"/>
                            <button class="bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold text-sm">Aplicar</button>
                        </div>
                    </div>
                </div>
            `;
        }

        this.inicializarEventosCarrito();
        this.mejorarVistaMovil();
    }

    // Inicializar eventos del carrito
    inicializarEventosCarrito() {
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = e.currentTarget.dataset.id;
                this.eliminarProducto(id);
            });
        });

        document.querySelectorAll('.btn-aumentar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = e.currentTarget.dataset.id;
                const producto = this.carrito.find(item => item.id === id);
                if (producto) {
                    this.actualizarCantidad(id, producto.cantidad + 1);
                }
            });
        });

        document.querySelectorAll('.btn-disminuir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = e.currentTarget.dataset.id;
                const producto = this.carrito.find(item => item.id === id);
                if (producto) {
                    this.actualizarCantidad(id, producto.cantidad - 1);
                }
            });
        });

        const btnFinalizar = document.getElementById('btn-finalizar-compra');
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', () => {
                this.procesarPago();
            });
        }
    }

    procesarPago() {
        if (this.carrito.length === 0) {
            this.mostrarNotificacion('Tu carrito está vacío');
            return;
        }
        
        this.mostrarMetodosPago();
    }

    // Función para copiar el pedido al portapapeles
    copiarPedidoAlPortapapeles(metodoSeleccionado = null) {
        if (this.carrito.length === 0) {
            this.mostrarNotificacion('Tu carrito está vacío');
            return;
        }

        const total = this.formatearPrecioCOP(this.calcularSubtotal());
        
        let productosTexto = '';
        this.carrito.forEach(item => {
            const precio = this.convertirAPrecioNumerico(item.precio);
            const subtotal = precio * item.cantidad;
            productosTexto += `• ${item.nombre} - ${item.cantidad} x ${this.formatearPrecioCOP(precio)} = ${this.formatearPrecioCOP(subtotal)}\n`;
        });

        let metodoTexto = '';
        if (metodoSeleccionado) {
            switch(metodoSeleccionado) {
                case 'nequi':
                    metodoTexto = 'Nequi';
                    break;
                case 'daviplata':
                    metodoTexto = 'Daviplata';
                    break;
                case 'bancolombia':
                    metodoTexto = 'Transferencia Bancolombia';
                    break;
                case 'efecty':
                    metodoTexto = 'Efecty';
                    break;
            }
        }

        const textoPedido = `¡Hola! Quiero hacer un pedido:

${productosTexto}
💰 TOTAL: ${total}

${metodoSeleccionado ? `📱 Método de pago seleccionado: ${metodoTexto}\n` : '📱 Método de pago: (indicar Nequi/Daviplata/Transferencia/Efecty)\n'}
📍 Dirección de envío:
📞 Teléfono de contacto:
👤 Nombre completo:

¡Quedo atento a la confirmación! 🙌`;

        navigator.clipboard.writeText(textoPedido).then(() => {
            if (metodoSeleccionado) {
                this.mostrarNotificacion(`✅ Pedido copiado con método ${metodoTexto}. Abriendo Instagram...`);
            } else {
                this.mostrarNotificacion('✅ Pedido copiado al portapapeles. Abriendo Instagram...');
            }
            
            setTimeout(() => {
                this.abrirInstagram();
            }, 1500);
        }).catch(() => {
            this.mostrarNotificacion('❌ No se pudo copiar automáticamente. Selecciona el texto manualmente.');
            
            const textarea = document.createElement('textarea');
            textarea.value = textoPedido;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            setTimeout(() => {
                this.abrirInstagram();
            }, 1500);
        });
    }

    // Mostrar métodos de pago
    mostrarMetodosPago() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Métodos de Pago</h3>
                <div class="space-y-4 mb-6">
                    <button class="metodo-pago w-full flex items-center gap-4 p-4 border border-primary/20 rounded-lg hover:border-primary transition-colors" data-metodo="nequi">
                        <span class="material-symbols-outlined text-primary">smartphone</span>
                        <span class="font-bold">Nequi</span>
                    </button>
                    <button class="metodo-pago w-full flex items-center gap-4 p-4 border border-primary/20 rounded-lg hover:border-primary transition-colors" data-metodo="daviplata">
                        <span class="material-symbols-outlined text-primary">account_balance_wallet</span>
                        <span class="font-bold">Daviplata</span>
                    </button>
                    <button class="metodo-pago w-full flex items-center gap-4 p-4 border border-primary/20 rounded-lg hover:border-primary transition-colors" data-metodo="bancolombia">
                        <span class="material-symbols-outlined text-primary">account_balance</span>
                        <span class="font-bold">Transferencia Bancolombia</span>
                    </button>
                    <button class="metodo-pago w-full flex items-center gap-4 p-4 border border-primary/20 rounded-lg hover:border-primary transition-colors" data-metodo="efecty">
                        <span class="material-symbols-outlined text-primary">payments</span>
                        <span class="font-bold">Efecty</span>
                    </button>
                </div>
                
                <button class="cerrar-modal w-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white py-3 rounded-lg font-bold">
                    Cancelar
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelectorAll('.metodo-pago').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const metodo = e.currentTarget.dataset.metodo;
                this.procesarPagoConMetodo(metodo);
                modal.remove();
            });
        });

        modal.querySelector('.cerrar-modal').addEventListener('click', () => {
            modal.remove();
        });
    }

    // Procesar pago con método específico
    procesarPagoConMetodo(metodo) {
        this.copiarPedidoAlPortapapeles(metodo);
    }
}

// Inicializar carrito global
const carrito = new CarritoCompras();

// Exportar para usar en otras páginas
window.carrito = carrito;
