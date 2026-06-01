# Documentación de Inicio y Arquitectura del Proyecto (E-commerce)

¡Bienvenido! Este documento contiene la información básica y detallada sobre la estructura y configuración local de nuestro proyecto E-commerce. Está pensado especialmente para que cualquier persona, incluso sin conocimientos avanzados de programación, pueda entender cómo levantar el proyecto en su computadora y comprender qué hace cada parte del sistema.

---

## 🚀 Guía de Instalación y Configuración Local

Para poder ver y probar el sitio web en tu computadora, debes instalar algunas herramientas básicas. Sigue estos pasos en orden:

### 1. Requisitos Previos (Instalación de Programas)

Antes de ejecutar los comandos del proyecto, necesitas instalar estas tres herramientas en tu sistema operativo:

- **Git**: Herramienta que nos permite descargar y controlar las versiones del código del proyecto.
    - _Descarga:_ [Sitio Oficial de Git](https://git-scm.com/)
- **PHP y Laravel**: PHP es el lenguaje de programación del backend (servidor) y Laravel es el marco de trabajo (framework) sobre el cual está construido.
    - _Guía oficial de instalación:_ Sigue las instrucciones detalladas en [Laravel Installation Docs](https://laravel.com/docs/13.x/installation) para configurar PHP, Composer y Laravel en tu sistema operativo (Windows, macOS o Linux).
- **Node.js**: Necesario para compilar y ejecutar el frontend (la interfaz de usuario hecha con React).
    - _Descarga:_ [Sitio Oficial de Node.js](https://nodejs.org/)

### 2. Versiones de Software Utilizadas en este Proyecto

Para asegurar que todo funcione correctamente, el proyecto está configurado con las siguientes versiones específicas:

- **PHP:** Versión `8.3` o superior (Recomendado PHP `8.4`).
- **Laravel Framework:** Versión `13.7` o superior.
- **React:** Versión `19`.
- **Tailwind CSS (Estilos):** Versión `4`.

---

### 3. Pasos para Levantar el Proyecto

Abre la terminal de comandos (consola) de tu sistema y sigue estas instrucciones paso a paso:

#### Paso A: Clonar el Proyecto y entrar a la carpeta

Descarga una copia del código del proyecto desde el repositorio de Git e ingresa a la carpeta creada:

```bash
git clone https://github.com/MrAron7w7/mis-ecommerce-matt.git
cd ecommerce-matt
```

#### Paso B: Instalar las dependencias de React (Frontend)

Este comando descarga todos los paquetes necesarios para que la interfaz visual de React funcione:

```bash
npm install
```

#### Paso C: Instalar las dependencias de PHP / Laravel (Backend)

Este comando descarga todos los paquetes y librerías del backend gestionados por Composer:

```bash
composer install
```

#### Paso D: Configurar el archivo de entorno (`.env`)

Laravel necesita un archivo de configuración llamado `.env` para saber cómo conectarse a la base de datos.

1. Copia el archivo de ejemplo ejecutando:
    ```bash
    cp .env.example .env
    ```
2. Abre el archivo `.env` en un editor de texto y asegúrate de que los datos de conexión a tu base de datos local (como `DB_DATABASE`, `DB_USERNAME` y `DB_PASSWORD`) sean correctos.

#### Paso E: Crear la Base de Datos y Poblar Datos Iniciales

Ejecuta el siguiente comando para crear las tablas en la base de datos de manera limpia.

> [!IMPORTANT]
> Se recomienda usar la bandera `--seed` para que se creen automáticamente los roles de usuario (`admin` y `client`), categorías de productos y productos de prueba necesarios para el funcionamiento inicial.

```bash
php artisan migrate:fresh --seed
```

- `migrate:fresh`: Borra cualquier tabla existente y vuelve a crear la base de datos desde cero (limpieza total).
- `--seed`: Inserta los datos iniciales obligatorios (roles de usuario, categorías de productos, etc.).

#### Paso F: Iniciar el Servidor de Desarrollo

Para poner en marcha la web completa, ejecuta el siguiente comando:

```bash
composer run dev
```

Este comando encenderá simultáneamente el servidor web de Laravel y el compilador de React. En la consola verás que te arroja un enlace local, por ejemplo:
👉 **`http://127.0.0.1:8000`** o **`http://localhost:8000`**

Abre ese enlace en tu navegador web y podrás ver e interactuar con la tienda online completa.

---

## 📂 Estructura de Carpetas Más Importantes

Para que puedas explicarle a tus compañeros dónde está cada cosa, aquí tienes un resumen de la arquitectura del proyecto:

| Directorio / Archivo            | ¿Qué contiene?               | Explicación Sencilla                                                                                                                                                                     |
| :------------------------------ | :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/Models/`                   | **Modelos**                  | Define la estructura de los datos que guardamos en la base de datos (ej: Producto, Usuario, Pedido). Es el "traductor" entre el código y la base de datos.                               |
| `app/Http/Controllers/`         | **Controladores**            | Contiene el cerebro lógico. Recibe las peticiones del usuario, procesa la información (usando los modelos) y decide qué responder o qué vista mostrar.                                   |
| `database/migrations/`          | **Migraciones**              | Son planos de construcción. Le dicen a la base de datos exactamente qué tablas crear, qué columnas tienen (texto, números, fechas) y cómo se relacionan entre sí.                        |
| `database/seeders/`             | **Sembradores (Seeders)**    | Scripts que llenan la base de datos con información por defecto (roles, categorías, productos ficticios) para que la web no esté vacía al iniciar.                                       |
| `resources/js/pages/`           | **Vistas (React + Inertia)** | Contiene las pantallas reales que ve el usuario final. Están escritas en React (`.tsx`) y separadas de forma ordenada según el rol (Cliente, Administrador, etc.).                       |
| `resources/views/app.blade.php` | **Plantilla Base (Blade)**   | Es la estructura HTML principal de la aplicación. Actúa como el contenedor donde se monta nuestra aplicación React usando Inertia.js.                                                    |
| `routes/web.php`                | **Rutas del Sistema**        | Es el mapa de navegación de la web. Asocia cada dirección URL (ej: `/productos`) con el controlador encargado de gestionarla. Carga los archivos `admin.php`, `client.php` y `auth.php`. |
| `config/`                       | **Configuración**            | Archivos de configuración general de Laravel (base de datos, servicios de correo, seguridad, etc.).                                                                                      |
| `public/`                       | **Archivos Públicos**        | Contiene imágenes estáticas, el favicon del sitio, estilos globales ya procesados y recursos a los que el navegador accede directamente.                                                 |
| `storage/`                      | **Almacenamiento**           | Carpeta donde se guardan archivos subidos por los usuarios (como fotos de productos o avatares), registros de errores (logs) y archivos temporales del framework.                        |

---

## 👥 Sistema de Roles y Acceso (Spatie Permissions)

La aplicación cuenta con un sistema de control de acceso que divide a los usuarios en **dos roles principales**:

1.  **client (Cliente):** El rol por defecto cuando alguien se registra. Puede navegar por la tienda, añadir productos al carrito, gestionar sus favoritos, actualizar su perfil e historial de compras. No tiene acceso al panel de administración.
2.  **admin (Administrador):** Usuario con permisos totales. Puede ver estadísticas de ventas, crear, editar y eliminar productos, gestionar categorías, marcas, proveedores, banners promocionales, revisar comentarios de clientes y cambiar roles de otros usuarios.

---

### 🔑 Cómo Convertir un Usuario Registrado en Administrador (`admin`)

Como las personas se registran a través de la web por defecto con el rol de `client`, para convertir una cuenta en administrador y poder ingresar al panel de control, debes seguir estos pasos utilizando la consola interactiva de Laravel (Tinker):

1.  **Regístrate en la web:** Ingresa a la web en local, haz clic en registrarse y crea una cuenta con tu correo electrónico.
2.  **Abre la terminal de comandos** dentro de la carpeta del proyecto.
3.  **Inicia Laravel Tinker** ejecutando el siguiente comando:
    ```bash
    php artisan tinker
    ```
    _Esto abrirá una consola especial donde puedes escribir código PHP que interactúa directamente con el proyecto en tiempo real._
4.  **Busca al usuario** que acabas de registrar. Si es el primer usuario en la base de datos, su ID será el `1`. Ejecuta:
    ```php
    $user = App\Models\User::find(1);
    ```
    _(Presiona Enter. Verás en pantalla los datos de tu usuario confirmando que lo encontró)._
5.  **Asigna el rol de administrador** ejecutando:
    ```php
    $user->syncRoles(['admin']);
    ```
    _(Presiona Enter. Te devolverá un mensaje confirmando que se guardaron los cambios)._
6.  **¡Listo!** Escribe `exit` para salir de Tinker. Ahora puedes iniciar sesión en la web e ir directamente a la URL **`/admin/dashboard`** para ver el panel de administración, publicar productos y gestionar el e-commerce.

---

## 🖥️ Detalle de las Vistas (Frontend - React Pages)

Las pantallas que los usuarios ven se encuentran organizadas en la carpeta `resources/js/pages/`. A continuación, se detalla qué hace cada una de ellas:

### 👤 1. Vistas del Cliente (`resources/js/pages/Client/`)

Estas vistas definen toda la experiencia de compra y navegación del cliente:

- **`Home.tsx` (Página de Inicio):** Es la portada de la tienda. Muestra banners rotativos de ofertas, categorías principales destacadas y carruseles con productos recomendados o más vendidos.
- **`Product.tsx` (Catálogo de Productos):** Muestra el listado completo de todos los productos disponibles con filtros interactivos (por precio, marca, categoría) y un buscador para que el cliente encuentre lo que necesita.
- **`ProductDetail.tsx` o `Product.tsx` (Detalle del Producto):** Pantalla donde se abre un producto específico. Muestra múltiples fotos del producto, descripción detallada, especificaciones técnicas, precio, stock disponible, selección de variantes (tallas/colores) y la sección de opiniones/calificaciones de otros clientes.
- **`Cart.tsx` (Carrito de Compras):** Resumen de los productos que el cliente ha ido agregando. Permite subir o bajar la cantidad de unidades de cada ítem, ver los subtotales y proceder con la compra.
- **`Checkout.tsx` (Proceso de Pago):** Formulario donde el cliente ingresa su dirección de envío, método de entrega y selecciona la forma de pago para formalizar y finalizar su pedido.
- **`OrderSuccess.tsx` (Confirmación de Pedido):** Pantalla de agradecimiento que se muestra inmediatamente después de que una compra es exitosa, detallando el número de orden y los pasos a seguir.
- **`UserFavoriteClient.tsx` (Favoritos/Lista de Deseos):** Panel donde el cliente puede ver todos los productos que marcó con un "corazón" para guardarlos y comprarlos después.
- **`Profile/Profile.tsx` (Perfil de Usuario):** Sección privada donde el cliente gestiona sus datos personales, actualiza su foto de perfil (avatar), cambia su contraseña de acceso y registra múltiples direcciones de entrega.
- **`Profile/Orders/Orders.tsx` (Historial de Pedidos):** Listado histórico de todas las compras realizadas por el cliente, donde puede ver el estado de su pedido (en preparación, enviado, entregado) y descargar el detalle.
- **Páginas Informativas (`Reclamaciones.tsx`, `TerminosCondiciones.tsx`, `PoliticaPrivacidad.tsx`, `PreguntasFrecuentes.tsx`):** Vistas legales e informativas del comercio, incluyendo el Libro de Reclamaciones digital de acuerdo a ley, términos de servicio, políticas de datos y respuestas a dudas comunes.

---

### 👑 2. Vistas del Administrador (`resources/js/pages/Admin/`)

Estas vistas componen el Panel de Control (Dashboard) exclusivo para usuarios con rol `admin`:

- **`Dashboard.tsx` (Panel Principal):** Pantalla inicial de bienvenida que muestra métricas y estadísticas clave en tiempo real: gráficos de ventas del mes, cantidad de nuevos clientes, pedidos pendientes por enviar y productos con bajo stock.
- **`Products/` (Gestión de Productos):**
    - `Products.tsx`: Tabla con todos los productos registrados. Permite buscar, filtrar, activar/desactivar un producto para que no se venda temporalmente, y marcar productos como destacados.
    - `CreateProduct.tsx`: Formulario detallado para registrar un nuevo producto (nombre, descripción, precios, stock, selección de marca, categoría, proveedor y carga de múltiples imágenes).
    - `EditProduct.tsx`: Permite modificar la información de un producto ya existente.
- **`Categories/` (Gestión de Categorías):** Listas y formularios para crear y editar categorías de productos (ej: Tecnología, Ropa) y activar o desactivar su visibilidad en el menú público.
- **`Brands/` (Gestión de Marcas):** Permite administrar las marcas comerciales de los productos (crear nuevas marcas, subir sus logotipos y editarlas).
- **`Suppliers/` (Gestión de Proveedores):** Directorio para registrar y editar los datos de los proveedores de mercadería (nombre, contacto, teléfono, dirección).
- **`Orders/` (Gestión de Pedidos):** Panel de control de compras realizadas por clientes. El administrador puede revisar los detalles de pago, cambiar el estado del pedido (ej. de "Pendiente" a "Enviado") y colocar números de seguimiento de transporte.
- **`Payments/` (Historial de Pagos):** Vista para revisar y validar las transacciones de pago entrantes, asegurando que las compras coincidan con los ingresos de dinero (como códigos de Yape o transferencias).
- **`Banners/` (Gestión de Banners):** Permite subir y ordenar las imágenes promocionales que aparecen en la página de inicio (sliders), programar su visualización y reordenarlos arrastrándolos.
- **`Reviews/` (Control de Reseñas):** Módulo de moderación donde el administrador aprueba o elimina los comentarios y puntuaciones con estrellas que escriben los clientes sobre los productos, evitando spam o lenguaje ofensivo.
- **`Users/` (Gestión de Usuarios):** Permite ver la lista de todos los usuarios registrados en el sistema, cambiarles el rol (de cliente a administrador, por ejemplo) o bloquear cuentas sospechosas de fraude.
- **`Settings/` (Ajustes de la Tienda):** Panel para editar los datos generales de la empresa que se muestran en el pie de página (teléfonos, correo de soporte, dirección física, enlaces a redes sociales y datos de cuentas bancarias).

---

## ⚙️ Detalle de los Controladores (Backend - PHP Controllers)

Los controladores están en `app/Http/Controllers/`. Son los encargados de recibir las acciones de las vistas, consultar la base de datos a través de los modelos y devolver la respuesta correspondiente.

### 👤 1. Controladores del Cliente (`app/Http/Controllers/Client/` y Generales)

- **`HomeController.php`:** Carga la página de inicio (`Home.tsx`). Recupera de la base de datos las categorías activas, los productos destacados y los banners promocionales ordenados para mostrárselos al cliente.
- **`Client\ProductController.php`:** Controla la visualización pública de los productos. Se encarga de listar todos los productos en el catálogo con filtros avanzados y de cargar la página de detalles de un producto específico, trayendo también sus imágenes y comentarios aprobados.
- **`Client\CategoryController.php`:** Gestiona el menú de categorías. Muestra el catálogo de categorías disponibles y filtra todos los productos pertenecientes a una categoría cuando el usuario hace clic en ella.
- **`PublicProductController.php`:** Controla el buscador del encabezado de la web. Toma el texto ingresado por el usuario y realiza una búsqueda inteligente en la base de datos sobre los títulos y descripciones de los productos.
- **`CartController.php`:** Controla el carrito de compras en la base de datos o en la sesión del usuario. Gestiona las funciones de añadir un producto, actualizar cantidades de unidades y eliminar ítems del carrito.
- **`CheckoutController.php`:** Coordina la finalización de la compra. Valida que haya stock de los productos seleccionados, procesa los datos del método de envío, guarda la orden de compra y registra el método de pago elegido.
- **`Client\OrderController.php`:** Gestiona el historial de compras del usuario autenticado, recuperando de la base de datos solo los pedidos que pertenecen a esa persona para que pueda ver sus detalles.
- **`Client\ProfileController.php`:** Gestiona las acciones de configuración personal del cliente: permite actualizar datos de contacto, subir/cambiar la foto de perfil (avatar), guardar o eliminar direcciones de envío y validar el cambio de contraseña segura.
- **`FavoriteController.php`:** Gestiona la lista de deseos del cliente. Controla las acciones de guardar un producto como favorito, quitarlo de favoritos o eliminar múltiples favoritos al mismo tiempo.
- **`ReviewController.php`:** Recibe los comentarios y calificaciones con estrellas que envían los clientes sobre los productos adquiridos y los guarda en estado "pendiente de aprobación" en la base de datos.
- **`ChatbotController.php`:** Controla las respuestas automáticas de ayuda al cliente de la tienda virtual, procesando las consultas que los usuarios escriben en el chat interactivo de la esquina inferior.

---

### 👑 2. Controladores del Administrador (`app/Http/Controllers/Admin/`)

- **`Admin\DashboardController.php`:** Recopila datos consolidados de ventas (ingresos monetarios), número de pedidos nuevos, cantidad de clientes registrados y alertas de productos que se están quedando sin inventario para graficarlos en el panel de control.
- **`Admin\ProductController.php`:** Realiza todas las tareas de administración de productos: guarda nuevos productos creados, actualiza la información modificada, maneja la carga y guardado de archivos de imagen al servidor y permite activar, desactivar o eliminar del inventario.
- **`Admin\CategoryController.php`:** Permite al administrador crear, modificar y cambiar el estado de activación de las categorías en las que se clasifican los productos.
- **`Admin\BrandController.php`:** Maneja las operaciones de registro, edición y eliminación de marcas comerciales asociadas a los productos.
- **`Admin\SupplierController.php`:** Controla el registro e información de contacto de los proveedores que suministran el stock de mercadería.
- **`Admin\OrderController.php`:** Muestra todos los pedidos realizados por todos los clientes en la tienda. Permite al administrador actualizar el estado de los envíos (ej: marcar como "Preparando" o "Enviado").
- **`Admin\PaymentController.php`:** Gestiona y lista las transacciones de pago de los pedidos, permitiendo validar transferencias y asociar comprobantes a las compras.
- **`Admin\BannerController.php`:** Controla la carga de banners publicitarios de la web, permitiendo activarlos, desactivarlos y registrar el orden de aparición en el carrusel de la página de inicio.
- **`Admin\ReviewController.php`:** Permite al administrador ver la lista de reseñas de productos escritas por clientes para aprobarlas (hacerlas visibles en la web) o eliminarlas si son spam.
- **`Admin\UserController.php`:** Administra el padrón de usuarios registrados en el e-commerce. Permite buscar personas por nombre/correo, asignarles el rol de `admin` o `client`, y bloquear su cuenta para impedirles iniciar sesión si es necesario.
- **`Admin\SettingController.php`:** Controla la actualización de las configuraciones globales del e-commerce (dirección física del comercio, cuentas de soporte, redes sociales, horarios de atención, etc.).
