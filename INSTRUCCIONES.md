# Instalación del chatbot dinámico

## 1. Copia los archivos a tu proyecto

```
app/Http/Services/ChatbotKnowledgeBase.php   → reemplaza/crea
app/Http/Services/ChatbotProductMatcher.php  → crea (nuevo)
app/Http/Services/ChatbotResponseFinder.php  → reemplaza el que ya tienes
app/Observers/ProductObserver.php            → crea (nuevo)
app/Observers/CategoryObserver.php           → crea (nuevo)
app/Observers/BrandObserver.php              → crea (nuevo)
app/Observers/PromotionObserver.php          → crea (nuevo)
app/Console/Commands/RebuildChatbotKnowledge.php → crea (nuevo)
resources/js/Components/Chatbot.tsx          → reemplaza el que ya tienes
                                                (ajusta la ruta si tu componente
                                                 está en otra carpeta)
```

`ChatbotDataset.php`, `TextNormalizer.php` y `ChatbotController.php` **no cambian**,
se quedan igual.

## 2. Registra los Observers

Abre `app/Providers/AppServiceProvider.php` y dentro del método `boot()` agrega:

```php
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Promotion;
use App\Observers\ProductObserver;
use App\Observers\CategoryObserver;
use App\Observers\BrandObserver;
use App\Observers\PromotionObserver;

public function boot(): void
{
    // ...lo que ya tengas...

    Product::observe(ProductObserver::class);
    Category::observe(CategoryObserver::class);
    Brand::observe(BrandObserver::class);
    Promotion::observe(PromotionObserver::class);
}
```

Con esto, cada vez que en el panel admin creas, editas o eliminas un producto,
categoría, marca o promoción, el chatbot se entera automáticamente — no
tienes que tocar nada más.

## 3. Genera la base de conocimiento por primera vez

En el servidor (o local), corre:

```bash
php artisan chatbot:rebuild
```

Esto es opcional en realidad: si no lo corres, el chatbot la genera solo la
primera vez que alguien le escribe (queda cacheada "para siempre" hasta el
próximo cambio real). Pero es buena práctica correrlo después de cada deploy
o después de correr seeders, por si acaso.

Puedes revisar qué "sabe" el chatbot en cualquier momento abriendo:
`storage/app/chatbot/knowledge-base.json`

## 4. (Opcional) Botón de "Regenerar chatbot" en el admin

Si en algún momento quieres un botón manual en tu panel de Settings, en tu
controlador de settings (o donde prefieras) agrega:

```php
use App\Http\Services\ChatbotKnowledgeBase;

Route::post('/admin/chatbot/rebuild', function (ChatbotKnowledgeBase $kb) {
    $kb->rebuild();
    return back()->with('success', 'Chatbot actualizado.');
})->name('admin.chatbot.rebuild');
```

Y desde React, un botón que haga `router.post(route('admin.chatbot.rebuild'))`.

## 5. Probar

Ejemplos de mensajes que ahora debería poder responder con datos reales
(usando el nombre real de tus productos/categorías/marcas):

- "cuanto cuesta la Zapatillas Nike Air Max" → precio, descuento y stock actual
- "tienen zapatillas nike?" → coincide por palabras aunque no sea el nombre exacto
- "que hay en la categoria Ropa Deportiva" → lista de productos + link
- "productos Adidas" → lista de productos de esa marca

Si el mensaje no coincide con ningún producto/categoría/marca, cae
automáticamente al dataset de preguntas frecuentes (envíos, pagos,
devoluciones, etc.) como ya tenías.

## 6. Sobre el botón "volver al menú"

En el widget de React ahora:
- El panel de preguntas frecuentes se puede cerrar con la ❌ de su cabecera.
- Cuando está cerrado, aparece una pequeña píldora **"Menú principal"**
  justo encima del input, siempre visible, para volver a abrirlo cuando
  quieras.
- Las respuestas que incluyen un link a un producto o categoría ahora se
  muestran como "Ver más" clicable (usa `<Link>` de Inertia para no
  recargar la página).
