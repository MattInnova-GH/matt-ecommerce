<?php

namespace App\Http\Data;

class ChatbotDataset
{
    public static function get(): array
    {
        return [
            // Saludos
            [
                'keywords' => [
                    'hola', 'hi', 'hey', 'buenas', 'buenos días', 'buenas tardes',
                    'buenas noches', 'saludos', 'qué tal', 'que tal', 'buen día',
                    'buen dia', 'hello', 'ola',
                ],
                'icon'     => 'sparkles',
                'response' => "¡Hola! Bienvenido a nuestra tienda. Estoy aquí para ayudarte con dudas sobre productos, envíos, pagos y más.\n\n¿En qué puedo ayudarte?",
            ],

            // Despedidas
            [
                'keywords' => [
                    'adiós', 'adios', 'chao', 'chau', 'hasta luego', 'bye',
                    'gracias', 'muchas gracias', 'nos vemos', 'hasta pronto',
                    'ok gracias', 'listo gracias', 'eso es todo', 'nada más',
                ],
                'icon'     => 'heart',
                'response' => '¡Hasta pronto! Fue un placer ayudarte. Si tienes más preguntas, aquí estaré. ¡Que tengas un excelente día!',
            ],

            // Quién eres / qué puedes hacer
            [
                'keywords' => [
                    'quién eres', 'quien eres', 'qué eres', 'que eres', 'cómo funcionas',
                    'como funcionas', 'eres un bot', 'eres humano', 'eres robot',
                    'eres ia', 'tu nombre', 'que puedes hacer', 'qué puedes hacer',
                    'en qué ayudas', 'en que ayudas', 'para qué sirves', 'para que sirves',
                ],
                'icon'     => 'bot',
                'response' => "Soy Mia Bot, tu asistente virtual asistente virtual de la tienda. Puedo ayudarte con:\n\n• Información sobre productos\n• Envíos y tiempos de entrega\n• Métodos de pago\n• Estado de pedidos\n• Devoluciones y cambios\n• Tu cuenta y perfil\n\n¿Qué necesitas saber?",
            ],

            // Registro / crear cuenta
            [
                'keywords' => [
                    'registrar', 'registrarse', 'me registro', 'crear cuenta',
                    'creo una cuenta', 'crear mi cuenta', 'creo mi cuenta',
                    'abrir cuenta', 'hacer cuenta', 'nueva cuenta', 'cuenta nueva',
                    'cómo registro', 'como me registro', 'quiero registrarme',
                    'quiero una cuenta', 'no tengo cuenta', 'como registro',
                    'como creo', 'cómo creo', 'unirme', 'crear usuario',
                ],
                'icon'     => 'user-plus',
                'response' => "Para crear una cuenta es muy sencillo:\n\n1. Haz clic en el ícono de usuario en la barra superior\n2. Selecciona \"Registrarse\"\n3. Completa tu nombre, correo y contraseña\n\n¡Listo! Ya podrás hacer compras y seguir tus pedidos.",
            ],

            // Iniciar sesión
            [
                'keywords' => [
                    'iniciar sesión', 'iniciar sesion', 'login', 'ingresar',
                    'entrar', 'cómo ingreso', 'como ingreso', 'acceder',
                    'acceso', 'ya tengo cuenta', 'tengo cuenta', 'no puedo entrar',
                    'no puedo ingresar', 'no me deja entrar', 'me logueo',
                    'como inicio sesion', 'cómo inicio sesión',
                ],
                'icon'     => 'log-in',
                'response' => "Para iniciar sesión:\n\n1. Haz clic en el ícono de usuario en la barra superior\n2. Selecciona \"Iniciar sesión\"\n3. Ingresa tu correo y contraseña\n\nSi olvidaste tu contraseña, puedes recuperarla desde esa misma pantalla.",
            ],

            // Contraseña
            [
                'keywords' => [
                    'contraseña', 'contrasena', 'olvidé mi contraseña',
                    'olvide mi contraseña', 'recuperar contraseña',
                    'cambiar contraseña', 'no recuerdo mi contraseña',
                    'olvidé la clave', 'olvide la clave', 'resetear contraseña',
                    'nueva contraseña', 'restablecer contraseña',
                ],
                'icon'     => 'lock',
                'response' => "Para recuperar tu contraseña:\n\n1. Ve a \"Iniciar sesión\"\n2. Haz clic en **\"¿Olvidaste tu contraseña?\"**\n3. Ingresa tu correo electrónico\n4. Revisa tu bandeja de entrada\n\nSi no llega el correo, revisa tu carpeta de spam.",
            ],

            // Perfil
            [
                'keywords' => [
                    'perfil', 'datos personales', 'actualizar datos',
                    'editar cuenta', 'mi cuenta', 'cambiar datos',
                    'cambiar nombre', 'cambiar correo', 'editar perfil',
                    'modificar perfil', 'actualizar perfil',
                ],
                'icon'     => 'user-cog',
                'response' => 'Ve a **Mi cuenta → Mi perfil** para actualizar tu nombre, dirección, teléfono y foto de perfil.',
            ],

            // Productos generales
            [
                'keywords' => [
                    'qué venden', 'que venden', 'qué tienen', 'que tienen',
                    'qué productos', 'que productos', 'catálogo', 'catalogo',
                    'artículo', 'articulo', 'ver productos', 'explorar',
                    'qué hay', 'que hay', 'tienes algo', 'muestrame productos',
                ],
                'icon'     => 'shopping-bag',
                'response' => 'Contamos con una amplia variedad de productos. Puedes explorar el catálogo en la sección **Productos** del menú superior o navegar por **Categorías** para encontrar lo que buscas.',
            ],

            // Buscar
            [
                'keywords' => [
                    'buscar', 'busco', 'buscar producto', 'encontrar producto',
                    'cómo busco', 'como busco', 'dónde busco', 'donde busco',
                    'buscar por nombre', 'buscar por marca', 'encontrar',
                    'cómo encuentro', 'como encuentro', 'necesito encontrar',
                ],
                'icon'     => 'search',
                'response' => 'Usa el ícono de lupa en la barra de navegación superior para buscar por nombre, categoría o marca. También puedes filtrar por precio desde la página de productos.',
            ],

            // Stock
            [
                'keywords' => [
                    'stock', 'disponible', 'disponibilidad', 'agotado',
                    'sin stock', 'hay disponible', 'queda', 'quedan',
                    'tienen en stock', 'está disponible', 'esta disponible',
                    'fuera de stock', 'no disponible', 'cuando llega',
                    'cuándo llega', 'reposición', 'reposicion',
                ],
                'icon'     => 'package',
                'response' => 'La disponibilidad se muestra en cada página de producto. Si no ves el botón de agregar al carrito, está temporalmente agotado. Contáctanos para saber cuándo habrá reposición.',
            ],

            // Precio / ofertas
            [
                'keywords' => [
                    'precio', 'precios', 'costo', 'cuánto cuesta', 'cuanto cuesta',
                    'cuánto vale', 'cuanto vale', 'oferta', 'ofertas',
                    'descuento', 'descuentos', 'promoción', 'promociones',
                    'promo', 'sale', 'rebaja', 'más barato', 'mas barato',
                    'cuanto es', 'cuánto es',
                ],
                'icon'     => 'tag',
                'response' => 'Los precios están indicados en cada producto. Regularmente tenemos ofertas y descuentos especiales. Te recomendamos revisar nuestra sección de productos para ver las promociones vigentes.',
            ],

            // Categorías
            [
                'keywords' => [
                    'categoría', 'categoria', 'categorias', 'categorías',
                    'tipos de productos', 'secciones', 'sección', 'seccion',
                    'colecciones', 'colección', 'ver categorias',
                ],
                'icon'     => 'layout-grid',
                'response' => 'Puedes explorar nuestras categorías desde el menú **Categorías** en la barra de navegación. Cada categoría agrupa productos similares para ayudarte a encontrar lo que buscas.',
            ],

            // Agregar al carrito
            [
                'keywords' => [
                    'agregar al carrito', 'añadir al carrito', 'poner en carrito',
                    'como compro', 'cómo compro', 'quiero comprar',
                    'agregar producto', 'añadir producto', 'poner producto',
                    'cómo agrego', 'como agrego', 'cómo añado', 'como añado',
                ],
                'icon'     => 'shopping-cart',
                'response' => "Para agregar un producto al carrito:\n\n1. Entra a la página del producto\n2. Elige la variante si aplica (talla, color, etc.)\n3. Haz clic en **\"Agregar al carrito\"**\n4. Ve al carrito y finaliza tu compra",
            ],

            // Ver / gestionar carrito
            [
                'keywords' => [
                    'carrito', 'mi carrito', 'ver carrito', 'carro de compras',
                    'eliminar del carrito', 'quitar del carrito', 'borrar carrito',
                    'vaciar carrito', 'cambiar cantidad', 'modificar carrito',
                ],
                'icon'     => 'shopping-cart',
                'response' => 'Haz clic en el ícono del carrito en la barra superior para ver o editar tu carrito. Desde ahí puedes cambiar cantidades o eliminar productos.',
            ],

            // Proceso de compra
            [
                'keywords' => [
                    'checkout', 'finalizar compra', 'proceso de compra',
                    'cómo comprar', 'como comprar', 'pasos para comprar',
                    'cómo pido', 'como pido', 'hacer pedido', 'hacer un pedido',
                    'realizar pedido', 'cómo realizo', 'como realizo',
                ],
                'icon'     => 'circle-check',
                'response' => "El proceso de compra es simple:\n\n1. Agrega productos al carrito\n2. Haz clic en **\"Ir al checkout\"**\n3. Ingresa tu dirección de entrega\n4. Elige tu método de pago\n5. Confirma tu pedido\n\nRecibirás un correo de confirmación.",
            ],

            // Envíos
            [
                'keywords' => [
                    'envío', 'envio', 'envíos', 'envios', 'entrega', 'despacho',
                    'delivery', 'llega', 'demora', 'tiempo de entrega',
                    'cuánto tarda', 'cuanto tarda', 'días de entrega',
                    'plazo de entrega', 'cuando llega', 'cuándo llega',
                    'cuando recibo', 'cuándo recibo', 'envían a', 'envian a',
                    'llega a', 'envío a provincias', 'envio a provincias',
                ],
                'icon'     => 'truck',
                'response' => "Realizamos envíos a todo el país. Los tiempos estimados son:\n\n• **Lima:** 1 a 3 días hábiles\n• **Provincias:** 3 a 7 días hábiles\n\nRecibirás un código de seguimiento por correo al confirmar tu pedido.",
            ],

            // Costo de envío
            [
                'keywords' => [
                    'costo de envío', 'costo envio', 'precio envío', 'precio de envio',
                    'cuánto es el envío', 'cuanto es el envio', 'envío gratis',
                    'envio gratis', 'flete', 'es gratis el envío', 'cobran envío',
                    'hay cargo por envío',
                ],
                'icon'     => 'truck',
                'response' => 'El costo de envío se calcula en el checkout según tu ubicación. Puedes tener **envío gratuito** si superas cierto monto de compra. ¡Verifica el detalle en tu carrito!',
            ],

            // Seguimiento
            [
                'keywords' => [
                    'seguimiento', 'rastrear', 'rastreo', 'tracking',
                    'dónde está', 'donde esta', 'dónde está mi pedido',
                    'donde esta mi pedido', 'número de seguimiento',
                    'cómo rastro', 'como rastro', 'estado del envío',
                    'ver mi envío', 'ver mi envio',
                ],
                'icon'     => 'map-pin',
                'response' => 'Una vez confirmado tu pedido recibirás un correo con el número de seguimiento. También puedes revisar el estado en **Mi cuenta → Mis pedidos** en cualquier momento.',
            ],

            // Métodos de pago
            [
                'keywords' => [
                    'pago', 'pagar', 'método de pago', 'metodo de pago',
                    'formas de pago', 'cómo pago', 'como pago',
                    'medios de pago', 'opciones de pago', 'aceptan',
                    'qué aceptan', 'que aceptan', 'pago en efectivo',
                    'efectivo', 'pago online', 'pago digital',
                ],
                'icon'     => 'credit-card',
                'response' => "Aceptamos los siguientes métodos de pago:\n\n• **Yape** – Pago inmediato con QR\n• **Transferencia bancaria** – A nuestras cuentas registradas\n\nTodos los pagos son verificados antes de procesar tu pedido.",
            ],

            // Yape
            [
                'keywords' => [
                    'yape', 'yapear', 'plin', 'código qr', 'codigo qr',
                    'pagar con yape', 'pago con yape',
                ],
                'icon'     => 'smartphone',
                'response' => "Aceptamos pagos por **Yape**:\n\n1. En el checkout selecciona **Yape**\n2. Escanea el código QR que aparecerá\n3. Confirma el pago desde tu app\n\nTu pedido se procesará al verificar el pago.",
            ],

            // Transferencia
            [
                'keywords' => [
                    'transferencia', 'deposito', 'depósito', 'banco',
                    'cuenta bancaria', 'bcp', 'interbank', 'bbva', 'scotiabank',
                    'número de cuenta', 'numero de cuenta', 'pagar con transferencia',
                    'datos bancarios', 'transferir',
                ],
                'icon'     => 'landmark',
                'response' => "Aceptamos **transferencias bancarias**:\n\n1. En el checkout selecciona **Transferencia bancaria**\n2. Recibirás los datos de la cuenta\n3. Realiza el depósito\n4. Sube el comprobante de pago\n\nProcesamos tu pedido al verificarlo.",
            ],

            // Seguridad
            [
                'keywords' => [
                    'seguro', 'seguridad', 'confiable', 'fraude', 'estafa',
                    'es seguro comprar', 'puedo confiar', 'son confiables',
                    'protección', 'mis datos', 'información personal',
                ],
                'icon'     => 'shield-check',
                'response' => 'Tu seguridad es nuestra prioridad. Los pagos son verificados manualmente antes de procesar cualquier pedido. Nunca compartimos tu información con terceros.',
            ],

            // Mis pedidos
            [
                'keywords' => [
                    'mis pedidos', 'ver pedidos', 'historial de pedidos',
                    'ver mis compras', 'historial de compras', 'pedidos anteriores',
                    'compras anteriores', 'donde veo mis pedidos',
                    'dónde veo mis pedidos', 'consultar pedido', 'ver orden',
                ],
                'icon'     => 'clipboard-list',
                'response' => 'Inicia sesión y ve a **Mi cuenta → Mis pedidos** para ver el historial y estado de todas tus compras.',
            ],

            // Estado del pedido
            [
                'keywords' => [
                    'estado del pedido', 'estado de mi pedido',
                    'estado de mi compra', 'cómo va mi pedido',
                    'como va mi pedido', 'qué pasó con mi pedido',
                    'que paso con mi pedido', 'fue confirmado',
                    'fue enviado', 'procesando pedido', 'en qué estado',
                ],
                'icon'     => 'bar-chart-2',
                'response' => "Consulta el estado de tu pedido en **Mi cuenta → Mis pedidos**.\n\nLos estados posibles son:\n\nPendiente → Confirmado → En camino → Entregado",
            ],

            // Cancelar pedido
            [
                'keywords' => [
                    'cancelar pedido', 'cancelar compra', 'anular pedido',
                    'deshacer pedido', 'no quiero mi pedido', 'quiero cancelar',
                    'puedo cancelar', 'cómo cancelo', 'como cancelo',
                ],
                'icon'     => 'x-circle',
                'response' => 'Para cancelar un pedido contáctanos lo antes posible. Solo podemos cancelar pedidos que aún no han sido despachados. Si ya fue enviado, aplica nuestra política de devoluciones.',
            ],

            // Devoluciones
            [
                'keywords' => [
                    'devolución', 'devolucion', 'devolver', 'devuelvo',
                    'quiero devolver', 'cambio', 'cambios', 'cambiar producto',
                    'reembolso', 'retorno', 'garantía', 'garantia',
                    'cómo devuelvo', 'como devuelvo', 'política de devolución',
                    'politica de devolucion', 'plazo de devolución',
                ],
                'icon'     => 'rotate-ccw',
                'response' => "Aceptamos devoluciones dentro de los **7 días** posteriores a la recepción, siempre que:\n\n• El producto esté sin uso\n• Cuente con su empaque original\n• Se encuentre en buen estado\n\nContáctanos para iniciar el proceso.",
            ],

            // Producto dañado
            [
                'keywords' => [
                    'producto defectuoso', 'producto dañado', 'llegó mal',
                    'llegó roto', 'llegó defectuoso', 'llegó en mal estado',
                    'está roto', 'esta roto', 'no funciona', 'falla',
                    'vino malo', 'vino roto', 'vino dañado',
                    'no es lo que pedí', 'no es lo que pedi', 'me enviaron mal',
                    'producto incorrecto', 'equivocado',
                ],
                'icon'     => 'alert-triangle',
                'response' => 'Lamentamos que hayas tenido ese problema. Contáctanos de inmediato con **fotos del producto** y tu **número de pedido**. Lo resolveremos a la brevedad.',
            ],

            // Favoritos
            [
                'keywords' => [
                    'favorito', 'favoritos', 'guardar producto', 'lista de deseos',
                    'wishlist', 'guardar para después', 'guardados',
                    'productos guardados', 'cómo guardo', 'como guardo',
                ],
                'icon'     => 'heart',
                'response' => 'Haz clic en el ícono de corazón en cualquier producto para guardarlo en favoritos. Accede a tu lista desde **Mi cuenta → Mis favoritos**.',
            ],

            // Contacto
            [
                'keywords' => [
                    'contacto', 'contactar', 'comunicarse', 'hablar con',
                    'hablar con alguien', 'atención al cliente', 'atencion al cliente',
                    'soporte', 'ayuda', 'asistencia', 'quiero hablar',
                    'número de contacto', 'correo de contacto',
                    'cómo los contacto', 'como los contacto',
                ],
                'icon'     => 'phone',
                'response' => "Puedes contactarnos a través de:\n\n• **WhatsApp** – En el footer de la página\n• **Correo electrónico** – En el footer\n• **Instagram y Facebook** – Redes sociales\n\nAtendemos de lunes a sábado de 9am a 6pm.",
            ],

            // Horarios
            [
                'keywords' => [
                    'horario', 'horarios', 'atienden', 'horario de atención',
                    'horario de atencion', 'cuándo atienden', 'cuando atienden',
                    'están disponibles', 'estan disponibles', 'qué días',
                    'que dias', 'abren', 'cierran',
                ],
                'icon'     => 'clock',
                'response' => "Nuestro horario de atención es:\n\n• **Lun – Vie:** 9:00 am – 6:00 pm\n• **Sábados:** 9:00 am – 1:00 pm\n• **Domingos y feriados:** Cerrado",
            ],

            // WhatsApp
            [
                'keywords' => [
                    'whatsapp', 'wsp', 'teléfono', 'telefono', 'celular',
                    'llamar', 'número de teléfono', 'numero de telefono',
                    'número de whatsapp', 'numero de whatsapp',
                    'por whatsapp', 'al whatsapp',
                ],
                'icon'     => 'message-circle',
                'response' => 'Nuestro número de WhatsApp está disponible en la parte inferior de la página. Te atenderemos con gusto en horario de atención.',
            ],

            // Reclamos
            [
                'keywords' => [
                    'reclamo', 'queja', 'reclamación', 'reclamacion',
                    'problema', 'inconveniente', 'libro de reclamaciones',
                    'poner una queja', 'hacer un reclamo', 'reportar problema',
                ],
                'icon'     => 'file-text',
                'response' => 'Puedes presentar tu reclamo en el **Libro de Reclamaciones** disponible en el footer. Nos comprometemos a responderte en un máximo de 15 días hábiles.',
            ],

            // FAQ
            [
                'keywords' => [
                    'preguntas frecuentes', 'faq', 'dudas frecuentes',
                    'preguntas comunes', 'preguntas y respuestas',
                ],
                'icon'     => 'help-circle',
                'response' => 'Tenemos una sección de **Preguntas Frecuentes** en el footer de la página con las consultas más comunes respondidas.',
            ],
        ];
    }
}