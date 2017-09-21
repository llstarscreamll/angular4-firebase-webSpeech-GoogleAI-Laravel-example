# Web Speech API y Google AI

Este es un sencillo prototipo donde es usada la [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), un agente de [inteligencia artificial de Google](https://api.ai/), una web app en [Angular 4](https://angular.io/), un backend hecho en [Laravel 5.5](https://laravel-news.com/category/laravel-5.5) y [Firebase](https://firebase.google.com). Los casos de uso que aquí se demuestran son la _"Creación de una Solicitud"_ y _"Aprobación de solicutd"_.

## Crear una solicitud de compra

Una solicitud de compra tiene un nombre, un estado (abierta, finizalizada o rechazada) y artículos asociados, dichos artículos viven en una base de datos en Firebase, de modo que cuando el usuario menciona las palabras _"añadir 4 peras"_, se añaden 4 artículos con nombre _"peras"_ a dicha solicitud y una vez el usuario dice _"finalizar solicitud"_ o _"cancelar solicitud"_ la solicitud en cuestión se actualiza con el respectivo estado.

Si al mencionar un artículo con nombre _"mouse"_ y en la base de datos tenemos los artículos _"mouse inalámbrico"_ y _"mouse estándar"_, la app mostrará dichas coincidencias para que el usuario diga el nombre exacto del producto que desea añadir a la solicitud.

## Aprobar solicitudes

Las solicitudes que son creadas en la base de datos se pueden aprobar con comandos de voz también, si el usuario dice _"aprobar solicitud compra de computadores"_, se realizará la busqueda en la base de datos de una solicitud con el nombre _"compra de computadores"_, si hay una sola coincidencia, la app aprobará dicha solicitud, si hay mas de una coincidencia, entonces las mostrará y el usuario deberá decir cual de ellas aprobar por el orden en que son presentadas, por ejemplo _"aprobar la segunda"_. Si no hay coincidencias la app te avisará de que nada ha encontrado.

## Flow de la app

![flow chart](https://user-images.githubusercontent.com/2442445/30672502-6d62ba3e-9e32-11e7-9f12-a4f0863e3644.jpg)

## Como montar el ejemplo?

### Firebase

Crea una instancia de Firebase, deja el acceso a la base de datos público e importa el archivo `firebase_data_example.json`.

### Google AI

Crea un agente en Google AI y en el apartado **Options -> Export and Import** importa el archivo `googleAI_agent.zip`.

### Laravel

El repo del backend en Laravel está [aquí](https://github.com/llstarscreamll/Laravel-firebase-webSpeech-GoogleAI-angular4-example), clonarla, llenar las respectivas variables en los ficheros `.env` (ver .env.example para ver qué es obligatorio) y `speech-dev-82e23ee59e9f` con los datos correspondientes, hacer el deploy a Heroku (obligatorio y opción más rápida pues requerimos https) y poner la url a la cual acceder a dicho backend en el agente creado en Google API, apartado **Fullfilment -> Webhook -> URL**.

### Angular

Luego actualiza el atributo `developerToken` de la clase `AgentService` ubicada en `src/app/ai.service.ts` con los de tu agente, puedes hayar el token en el apartado **Options -> General -> API Keys**. Puede crear hacer el deploy a Heroku si lo deseas o puedes ejecutar el comando `ng serve` para probar la app.