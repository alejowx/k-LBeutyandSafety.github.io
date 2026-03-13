// js/auth.js
import { auth, provider, signInWithPopup, signOut } from './firebase-config.js';

class Autenticacion {
    constructor() {
        this.usuarioActual = null;
        this.inicializarAuth();
    }

    inicializarAuth() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.usuarioActual = user;
                this.actualizarUIUsuario(user);
                this.procesarCarritoPendiente();
            } else {
                this.usuarioActual = null;
                this.actualizarUIUsuario(null);
            }
        });
    }

    async iniciarSesionGoogle() {
        try {
            const result = await signInWithPopup(auth, provider);
            return result.user;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            carrito.mostrarNotificacion('Error al iniciar sesión. Intenta de nuevo.');
            return null;
        }
    }

    async cerrarSesion() {
        try {
            await signOut(auth);
            carrito.mostrarNotificacion('Sesión cerrada correctamente');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    actualizarUIUsuario(user) {
        const menuUsuario = document.getElementById('menu-usuario');
        const dropdownUsuario = document.getElementById('dropdown-usuario');
        
        if (!menuUsuario) return;

        if (user) {
            menuUsuario.innerHTML = `
                <button id="btn-usuario" class="flex items-center gap-2 p-2 rounded-full hover:bg-primary/10">
                    <img src="${user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName}" 
                         alt="Usuario" class="w-8 h-8 rounded-full">
                    <span class="material-symbols-outlined">arrow_drop_down</span>
                </button>
                <div id="dropdown-usuario" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-primary/10 py-2">
                    <a href="mi-cuenta.html" class="block px-4 py-2 hover:bg-primary/5 text-sm">Mi Cuenta</a>
                    <a href="mis-pedidos.html" class="block px-4 py-2 hover:bg-primary/5 text-sm">Mis Pedidos</a>
                    <hr class="my-2 border-primary/10">
                    <button id="btn-cerrar-sesion" class="block w-full text-left px-4 py-2 hover:bg-primary/5 text-sm text-red-500">
                        Cerrar Sesión
                    </button>
                </div>
            `;

            document.getElementById('btn-usuario')?.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('dropdown-usuario')?.classList.toggle('hidden');
            });

            document.getElementById('btn-cerrar-sesion')?.addEventListener('click', () => {
                this.cerrarSesion();
            });
        } else {
            menuUsuario.innerHTML = `
                <button id="btn-iniciar-sesion" class="p-2 rounded-full hover:bg-primary/10">
                    <span class="material-symbols-outlined">person</span>
                </button>
            `;

            document.getElementById('btn-iniciar-sesion')?.addEventListener('click', () => {
                this.iniciarSesionGoogle();
            });
        }

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', () => {
            const dropdown = document.getElementById('dropdown-usuario');
            if (dropdown && !dropdown.classList.contains('hidden')) {
                dropdown.classList.add('hidden');
            }
        });
    }

    procesarCarritoPendiente() {
        const carritoPendiente = sessionStorage.getItem('carritoPendiente');
        if (carritoPendiente) {
            sessionStorage.removeItem('carritoPendiente');
            if (window.location.pathname.includes('cuenta.html')) {
                window.location.href = 'carrito.html';
            }
        }
    }

    obtenerUsuario() {
        return this.usuarioActual;
    }
}

// Inicializar autenticación
const authManager = new Autenticacion();
window.authManager = authManager;

export { authManager };