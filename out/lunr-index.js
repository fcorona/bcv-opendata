
var index = lunr(function () {
    this.field('body');
    this.ref('url');
});

var documentTitles = {};



documentTitles["index.html#api-rest-para-bogot-cmo-vamos"] = "API REST para Bogotá Cómo Vamos";
index.add({
    url: "index.html#api-rest-para-bogot-cmo-vamos",
    title: "API REST para Bogotá Cómo Vamos",
    body: "# API REST para Bogotá Cómo Vamos  "
});

documentTitles["index.html#introduccin"] = "Introducción";
index.add({
    url: "index.html#introduccin",
    title: "Introducción",
    body: "## Introducción Bógota cómo vamos ha recolectado desde el año 1998 información tanto de opinión como de indicadores de la ciudad de Bogotá.  La información recolectada se ha puesto a disposición de la ciudadania en  diferentes publicaciones y notas de prensa, los datos abiertos sin embargo son una opción para que diferentes desarrolladores puedan usar esta información y construir aplicaciones y soluciones que empoderen a la ciudadania.  En estos documentos se expone como estan estructurados los datos recolectados y como se puede acceder a ellos a traves del API.   "
});

documentTitles["index.html#estructura"] = "Estructura";
index.add({
    url: "index.html#estructura",
    title: "Estructura",
    body: "## Estructura Existen dos tipos de informes que se generan cada año: los indicadores de calidad de vida y la encuesta de participación ciudadana.  Cada informe se agrupa en un dataset independiente, un dataset no es mas que un conjunto de datos organizados.   "
});

documentTitles["index.html#informe-de-indicadores-de-calidad-de-vida"] = "Informe de Indicadores de Calidad de Vida";
index.add({
    url: "index.html#informe-de-indicadores-de-calidad-de-vida",
    title: "Informe de Indicadores de Calidad de Vida",
    body: "## Informe de Indicadores de Calidad de Vida El informe de calidad de vida es un conjunto de indicadores de la ciudad estructurados en diferentes dimensiones y categorías. Son datos puntuales acerca de algún aspecto de la ciudad y pueden ser medidos en porcentajes, tasas, números, miles o descriptivos.  "
});

documentTitles["index.html#estructura"] = "Estructura";
index.add({
    url: "index.html#estructura",
    title: "Estructura",
    body: "## Estructura  "
});



documentTitles["dataset.html#dataset"] = "Dataset";
index.add({
    url: "dataset.html#dataset",
    title: "Dataset",
    body: "# Dataset  Un dataset agrupa el conjunto de datos de cada informe:  ```json {   \&quot;name\&quot;: {type: String, index: true, unique: true},   \&quot;type\&quot;: Number }  ```  * **name**: el nombre e identificador del dataset, es una cadena de texto y unico.  * **type**: describe el tipo de informe, 1 para el informe de indicadores y 2 para el informe de encuestas.  La diferencia entre un tipo u otro radica en la forma en que son presentados sus datos:  * **tipo 1**: la información es un indicador único y absoluto que se entrega por año, no puede ser segmentado.  * **tipo 2**: cada dato es la agregación de la información entregada por varios individuos, esta información puede ser segmentada por: genero, edad, nivel socioeconomico y zona geografica.   "
});

documentTitles["dataset.html#listar-datasets"] = "Listar datasets";
index.add({
    url: "dataset.html#listar-datasets",
    title: "Listar datasets",
    body: "## Listar datasets  **url** GET datasets  "
});

documentTitles["dataset.html#descripcin"] = "Descripción";
index.add({
    url: "dataset.html#descripcin",
    title: "Descripción",
    body: "### Descripción  Lista todos los datasets registrados en la plataforma.   "
});

documentTitles["dataset.html#ejemplo-de-solicitud"] = "Ejemplo de solicitud";
index.add({
    url: "dataset.html#ejemplo-de-solicitud",
    title: "Ejemplo de solicitud",
    body: "### Ejemplo de solicitud  GET http://54.203.249.245/api/datasets/?key=whatever  "
});

documentTitles["dataset.html#resultado"] = "Resultado";
index.add({
    url: "dataset.html#resultado",
    title: "Resultado",
    body: "#### Resultado  * HTTP Status: 200 (ok) * Response Body:  ```json [    {     \&quot;name\&quot;: \&quot;iicv\&quot;,     \&quot;type\&quot;: 1,     \&quot;href\&quot;: \&quot;http://54.203.249.245/api/datasets/iicv?key=whatever\&quot;   },   {     \&quot;name\&quot;: \&quot;epc\&quot;,     \&quot;type\&quot;: 2,     \&quot;href\&quot;: \&quot;http://54.203.249.245/api/datasets/epc?key=whatever\&quot;   }  ] ```  "
});

documentTitles["dataset.html#errores"] = "Errores";
index.add({
    url: "dataset.html#errores",
    title: "Errores",
    body: "#### Errores  * 500 Database error   "
});

documentTitles["dataset.html#obtener-dataset"] = "Obtener dataset";
index.add({
    url: "dataset.html#obtener-dataset",
    title: "Obtener dataset",
    body: "## Obtener dataset  **url** GET datasets/{datasetName}  "
});

documentTitles["dataset.html#descripcin"] = "Descripción";
index.add({
    url: "dataset.html#descripcin",
    title: "Descripción",
    body: "### Descripción  Devuelve el dataset cuyo nombre es {datasetName}   "
});

documentTitles["dataset.html#ejemplo-de-solicitud"] = "Ejemplo de solicitud";
index.add({
    url: "dataset.html#ejemplo-de-solicitud",
    title: "Ejemplo de solicitud",
    body: "### Ejemplo de solicitud  GET http://54.203.249.245/api/datasets/iicv?key=whatever  "
});

documentTitles["dataset.html#resultado"] = "Resultado";
index.add({
    url: "dataset.html#resultado",
    title: "Resultado",
    body: "#### Resultado  * HTTP Status: 200 (ok) * Response Body:  ```json {   \&quot;name\&quot;: \&quot;iicv\&quot;,   \&quot;type\&quot;: 1,   \&quot;dimensions\&quot;: [     {       \&quot;dimensionId\&quot;: 0,       \&quot;name\&quot;: \&quot;Educación\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/dimensions/0?key=whatever\&quot;     },     {       \&quot;dimensionId\&quot;: 1,       \&quot;name\&quot;: \&quot;Salud\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/dimensions/1?key=whatever\&quot;     }, ...     {       \&quot;dimensionId\&quot;: 17,       \&quot;name\&quot;: \&quot;Demográfica\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/dimensions/17?key=whatever\&quot;     }   ] } ```  "
});

documentTitles["dataset.html#errores"] = "Errores";
index.add({
    url: "dataset.html#errores",
    title: "Errores",
    body: "#### Errores  * 500 Database error * 404 Not found"
});



documentTitles["dimension.html#dimensin"] = "Dimensión";
index.add({
    url: "dimension.html#dimensin",
    title: "Dimensión",
    body: "# Dimensión  Una dimensión es una subclasificación de la información de los informes en tópicos:  ```json {   \&quot;dimensionId\&quot;: {type: Number, index: true, unique: true},   \&quot;name\&quot;: String,   \&quot;dataset\&quot;: String }  ```  * **dimensionId**: es un valor único que identifica a la dimensión. * **name**: el nombre descriptivo de la dimensión. * **dataset**: el identificador del dataset al que hace parte esta dimensión.   "
});

documentTitles["dimension.html#obtener-dimensin"] = "Obtener dimensión";
index.add({
    url: "dimension.html#obtener-dimensin",
    title: "Obtener dimensión",
    body: "## Obtener dimensión  **url** GET dimensions/{dimensionId}  "
});

documentTitles["dimension.html#descripcin"] = "Descripción";
index.add({
    url: "dimension.html#descripcin",
    title: "Descripción",
    body: "### Descripción  Devuelve la dimensión cuyo identificador es {dimensionId}, la dimensión es retornada junto con las categorías que contiene.   "
});

documentTitles["dimension.html#ejemplo-de-solicitud"] = "Ejemplo de solicitud";
index.add({
    url: "dimension.html#ejemplo-de-solicitud",
    title: "Ejemplo de solicitud",
    body: "### Ejemplo de solicitud  GET http://54.203.249.245/api/dimensions/0?key=whatever  "
});

documentTitles["dimension.html#resultado"] = "Resultado";
index.add({
    url: "dimension.html#resultado",
    title: "Resultado",
    body: "#### Resultado  * HTTP Status: 200 (ok) * Response Body:  ```json {   \&quot;dimensionId\&quot;: 0,   \&quot;dataset\&quot;: \&quot;52b1d45fecdf70df0a000001\&quot;,   \&quot;name\&quot;: \&quot;Educación\&quot;,   \&quot;categories\&quot;: [     {       \&quot;categoryId\&quot;: 0,       \&quot;name\&quot;: \&quot;Cobertura\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/categories/0?key=whatever\&quot;     },     {       \&quot;categoryId\&quot;: 1,       \&quot;name\&quot;: \&quot;Eficiencia Interna\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/categories/1?key=whatever\&quot;     },     {       \&quot;categoryId\&quot;: 2,       \&quot;name\&quot;: \&quot;Años promedio de educación\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/categories/2?key=whatever\&quot;     },     {       \&quot;categoryId\&quot;: 3,       \&quot;name\&quot;: \&quot;Analfabetismo\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/categories/3?key=whatever\&quot;     },     {       \&quot;categoryId\&quot;: 4,       \&quot;name\&quot;: \&quot;Calidad de la Educación\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/categories/4?key=whatever\&quot;     }   ] } ```  "
});

documentTitles["dimension.html#errores"] = "Errores";
index.add({
    url: "dimension.html#errores",
    title: "Errores",
    body: "#### Errores  * 500 Database error * 404 Not found"
});



documentTitles["categoria.html#categora"] = "Categoría";
index.add({
    url: "categoria.html#categora",
    title: "Categoría",
    body: "# Categoría  Una categoría es una agrupación de datos de los informes en subtópicos:  ```json {   \&quot;categoryId\&quot;: {type: Number, index: true, unique: true},   \&quot;name\&quot;: String,   \&quot;dataset\&quot;: String,   \&quot;dimension\&quot;: String }  ```  * **categoryId**: es un valor único que identifica a la dimensión. * **name**: el nombre descriptivo de la categoría. * **dataset**: el identificador del dataset al que hace parte esta categoría. * **dimension**: el identificador de la dimensión al que hace parte esta categoría.   "
});

documentTitles["categoria.html#obtener-categora"] = "Obtener categoría";
index.add({
    url: "categoria.html#obtener-categora",
    title: "Obtener categoría",
    body: "## Obtener categoría  **url** GET categories/{categoryId}  "
});

documentTitles["categoria.html#descripcin"] = "Descripción";
index.add({
    url: "categoria.html#descripcin",
    title: "Descripción",
    body: "### Descripción  Devuelve la categoría cuyo identificador es {categoryId}, la categoría es retornada junto con los datos(indicadores ó preguntas) que contiene.   "
});

documentTitles["categoria.html#ejemplo-de-solicitud"] = "Ejemplo de solicitud";
index.add({
    url: "categoria.html#ejemplo-de-solicitud",
    title: "Ejemplo de solicitud",
    body: "### Ejemplo de solicitud  GET http://54.203.249.245/api/categories/0?key=whatever  "
});

documentTitles["categoria.html#resultado"] = "Resultado";
index.add({
    url: "categoria.html#resultado",
    title: "Resultado",
    body: "#### Resultado  * HTTP Status: 200 (ok) * Response Body:  ```json {   \&quot;categoryId\&quot;: 0,   \&quot;dimension\&quot;: \&quot;52b1d45fecdf70df0a000002\&quot;,   \&quot;dataset\&quot;: \&quot;52b1d45fecdf70df0a000001\&quot;,   \&quot;name\&quot;: \&quot;Cobertura\&quot;,   \&quot;datas\&quot;: [     {       \&quot;_id\&quot;: 0,       \&quot;name\&quot;: \&quot;Tasa de cobertura bruta en básica primaria\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/datas/0?key=whatever\&quot;     },     {       \&quot;_id\&quot;: 1,       \&quot;name\&quot;: \&quot;Tasa de cobertura bruta en preescolar\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/datas/1?key=whatever\&quot;     },     {       \&quot;_id\&quot;: 2,       \&quot;name\&quot;: \&quot;Tasa de cobertura bruta en media vocacional\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/datas/2?key=whatever\&quot;     }, ...     {       \&quot;_id\&quot;: 21,       \&quot;name\&quot;: \&quot;Tasa de cobertura neta en media vocacional\&quot;,       \&quot;href\&quot;: \&quot;http://54.203.249.245/api/datas/21?key=whatever\&quot;     }   ] } ```  "
});

documentTitles["categoria.html#errores"] = "Errores";
index.add({
    url: "categoria.html#errores",
    title: "Errores",
    body: "#### Errores  * 500 Database error * 404 Not found"
});



documentTitles["datos.html#datos"] = "Datos";
index.add({
    url: "datos.html#datos",
    title: "Datos",
    body: "# Datos  Los datos recopilan la información puntual de un indicador o una pregunta dependiendo del tipo de dataset al que hagan parte, contienen un conjunto de valores llamados datas que registra año por año el valor que tuvieron esos datos.   "
});

documentTitles["datos.html#indicadores"] = "Indicadores";
index.add({
    url: "datos.html#indicadores",
    title: "Indicadores",
    body: "## Indicadores Los datos reciben el nombre de indicador para los datasets del tipo 1 como el informe de calidad de vida.  ```json {   \&quot;id\&quot;: {type: Number, index: true, unique: true},   \&quot;name\&quot;: String,   \&quot;dataset\&quot;: String,   \&quot;dimension\&quot;: String,   \&quot;category\&quot;: String,   \&quot;description\&quot;: String,   \&quot;measureType\&quot;: String,   \&quot;source\&quot;: String,   \&quot;coverage\&quot;: String,   \&quot;period\&quot;: String,   \&quot;datas\&quot;: {     \&quot;year\&quot;: \&quot;value\&quot;   } }  ```  * **id**: es un valor único que identifica al indicador. * **name**: el nombre del indicador. * **dataset**: el identificador del dataset al que hace parte este indicador. * **dimension**: el identificador de la dimensión al que hace parte este indicador. * **category**: el identificador de la categoría al que hace parte este indicador. * **description**: la descripción del indicador. * **measureType**: el tipo de medida que puede tener este indicador:    * Alfabético   * Índice   * Numérico   * Numérico en Años   * Numérico en Kilómetros   * Numérico en Metros Cuadrados   * Numérico en Micras   * Numérico en Toneladas   * Porcentual   * Tasa  * **source**: la fuente oficial de donde fueron recaudados los datos de este indicador * **coverage**: la cobertura del indicador:   * Distrital   * 13 areas   * Colombia  * **period**: la periodicidad con la que los datos del indicador son recaudados:   * Anual   * Bianual   * Censo  * **datas**: el conjunto de valores año por año para este indicador.  "
});

documentTitles["datos.html#filtros"] = "Filtros";
index.add({
    url: "datos.html#filtros",
    title: "Filtros",
    body: "### Filtros  * Años: Los indicadores pueden filtrarse para que muestre uno o varios años.   "
});

documentTitles["datos.html#preguntas"] = "Preguntas";
index.add({
    url: "datos.html#preguntas",
    title: "Preguntas",
    body: "## Preguntas Los datos reciben el nombre de preguntas para los datasets del tipo 2 como la encuesta de participación ciudadana.  ```json {   \&quot;id\&quot;: {type: Number, index: true, unique: true},   \&quot;name\&quot;: String,   \&quot;dataset\&quot;: String,   \&quot;dimension\&quot;: String,   \&quot;category\&quot;: String,   \&quot;description\&quot;: String,   \&quot;measureType\&quot;: String,   \&quot;source\&quot;: String,   \&quot;coverage\&quot;: String,   \&quot;period\&quot;: String,   \&quot;datas\&quot;: {     \&quot;year\&quot;: \&quot;value\&quot;   } }  ```  * **id**: es un valor único que identifica a la pregunta. * **name**: el nombre de la pregunta. * **dataset**: el identificador del dataset al que hace parte esta pregunta. * **description**: la descripción de la pregunta. * **typeResponse**: distingue el tipo de respuesta: \&quot;multiple\&quot; ó \&quot;simple\&quot; * **datas**: el conjunto de valores año por año para este indicador, agrupados  por valores de respuestas.  "
});

documentTitles["datos.html#filtros"] = "Filtros";
index.add({
    url: "datos.html#filtros",
    title: "Filtros",
    body: "### Filtros  Las preguntas tienen una caracterización que permite realizar diferentes tipos de filtros según las personas que las contestaron:  * Años: Las preguntas pueden filtrarse para que muestre uno o varios años.  * Género: Las preguntas pueden filtrarse por el género de las personas  (Masculino,Femenino).  * Edad: Las preguntas pueden filtrarse para que muestre las respuestas de las personas en un rango de edad.  * Nivel Socio Economico: Las preguntas pueden filtrarse para que muestre las respuestas de las personas con cierto nivel socio economico.  * Zona: Las preguntas pueden filtrarse para que muestre las respuestas de las personas que viven en ciertas zonas de la ciudad.   "
});

documentTitles["datos.html#obtener-datos"] = "Obtener datos";
index.add({
    url: "datos.html#obtener-datos",
    title: "Obtener datos",
    body: "## Obtener datos  **url** GET datas/{id}  "
});

documentTitles["datos.html#descripcin"] = "Descripción";
index.add({
    url: "datos.html#descripcin",
    title: "Descripción",
    body: "### Descripción  Devuelve el conjunto de datos cuyo identificador es {id}.   "
});

documentTitles["datos.html#ejemplo-de-solicitud-para-indicadores"] = "Ejemplo de solicitud para indicadores";
index.add({
    url: "datos.html#ejemplo-de-solicitud-para-indicadores",
    title: "Ejemplo de solicitud para indicadores",
    body: "### Ejemplo de solicitud para indicadores  GET http://54.203.249.245/api/datas/0?key=whatever  "
});

documentTitles["datos.html#resultado"] = "Resultado";
index.add({
    url: "datos.html#resultado",
    title: "Resultado",
    body: "#### Resultado  * HTTP Status: 200 (ok) * Response Body:  ```json {   \&quot;_id\&quot;: 0,   \&quot;dataset\&quot;: \&quot;52b1d45fecdf70df0a000001\&quot;,   \&quot;dimension\&quot;: \&quot;52b1d45fecdf70df0a000002\&quot;,   \&quot;category\&quot;: \&quot;52b1d45fecdf70df0a000003\&quot;,   \&quot;name\&quot;: \&quot;Tasa de cobertura bruta en básica primaria\&quot;,   \&quot;description\&quot;: \&quot;Mide la población matriculada en educación primaria (grados 1º a 5º)  sobre la población de 6 a 10 años\&quot;,   \&quot;measureType\&quot;: \&quot;Porcentual\&quot;,   \&quot;source\&quot;: \&quot;Secretaría de Educación del Distrito\&quot;,   \&quot;coverage\&quot;: \&quot;Distrital\&quot;,   \&quot;period\&quot;: \&quot;Anual\&quot;,   \&quot;datas\&quot;: {     \&quot;1998\&quot;: 0.9490000000000001,     \&quot;1999\&quot;: 1.023,     \&quot;2000\&quot;: 1.0070000000000001,     \&quot;2001\&quot;: 1.022,     \&quot;2002\&quot;: 1.141,     \&quot;2003\&quot;: 1.07,     \&quot;2004\&quot;: 1.062,     \&quot;2005\&quot;: 1.062,     \&quot;2006\&quot;: 1.057,     \&quot;2007\&quot;: 1.0759999999999998,     \&quot;2008\&quot;: 1.088,     \&quot;2009\&quot;: 1.0859999999999999,     \&quot;2010\&quot;: 1.067,     \&quot;2011\&quot;: 1.026,     \&quot;2012\&quot;: 0.972   } } ```  "
});

documentTitles["datos.html#errores"] = "Errores";
index.add({
    url: "datos.html#errores",
    title: "Errores",
    body: "#### Errores  * 500 Database error * 404 Not found    "
});

documentTitles["datos.html#ejemplo-de-solicitud-para-preguntas"] = "Ejemplo de solicitud para preguntas";
index.add({
    url: "datos.html#ejemplo-de-solicitud-para-preguntas",
    title: "Ejemplo de solicitud para preguntas",
    body: "### Ejemplo de solicitud para preguntas  GET http://54.203.249.245/api/datas/1004?key=whatever  "
});

documentTitles["datos.html#resultado"] = "Resultado";
index.add({
    url: "datos.html#resultado",
    title: "Resultado",
    body: "#### Resultado  * HTTP Status: 200 (ok) * Response Body:  ```json {      \&quot;_id\&quot;: 1004,     \&quot;name\&quot;: \&quot;P826\&quot;,     \&quot;description\&quot;: \&quot;La cantidad de árboles en la ciudad\&quot;,     \&quot;dataset\&quot;: \&quot;52b11ed3dd0d63aa27000004\&quot;,     \&quot;typeResponse\&quot;: \&quot;simple\&quot;,     \&quot;datas\&quot;: {         \&quot;1998\&quot;: {             \&quot;empty\&quot;: 1524,             \&quot;\&quot;: 1524         },         \&quot;1999\&quot;: {             \&quot;empty\&quot;: 1500,             \&quot;\&quot;: 1500         },         \&quot;2000\&quot;: {             \&quot;empty\&quot;: 1507,             \&quot;\&quot;: 1507         },         \&quot;2002\&quot;: {             \&quot;empty\&quot;: 1516,             \&quot;\&quot;: 1516         },         \&quot;2003\&quot;: {             \&quot;empty\&quot;: 1511,             \&quot;\&quot;: 1511         },         \&quot;2004\&quot;: {             \&quot;empty\&quot;: 1667,             \&quot;\&quot;: 1667         },         \&quot;2005\&quot;: {             \&quot;empty\&quot;: 1663,             \&quot;\&quot;: 1663         },         \&quot;2006\&quot;: {             \&quot;empty\&quot;: 1521,             \&quot;\&quot;: 1521         },         \&quot;2007\&quot;: {             \&quot;empty\&quot;: 1517,             \&quot;\&quot;: 1517         },         \&quot;2008\&quot;: {             \&quot;1\&quot;: 39,             \&quot;2\&quot;: 80,             \&quot;3\&quot;: 190,             \&quot;4\&quot;: 446,             \&quot;5\&quot;: 751         },         \&quot;2009\&quot;: {             \&quot;1\&quot;: 109,             \&quot;2\&quot;: 139,             \&quot;3\&quot;: 297,             \&quot;4\&quot;: 402,             \&quot;5\&quot;: 653         },         \&quot;2010\&quot;: {             \&quot;1\&quot;: 83,             \&quot;2\&quot;: 150,             \&quot;3\&quot;: 309,             \&quot;4\&quot;: 400,             \&quot;5\&quot;: 571         },         \&quot;2011\&quot;: {             \&quot;1\&quot;: 276,             \&quot;2\&quot;: 394,             \&quot;3\&quot;: 563,             \&quot;4\&quot;: 222,             \&quot;5\&quot;: 53         },         \&quot;2012\&quot;: {             \&quot;1\&quot;: 538,             \&quot;2\&quot;: 523,             \&quot;3\&quot;: 311,             \&quot;4\&quot;: 109,             \&quot;5\&quot;: 19         }     }  } ```  "
});

documentTitles["datos.html#errores"] = "Errores";
index.add({
    url: "datos.html#errores",
    title: "Errores",
    body: "#### Errores  * 500 Database error * 404 Not found  "
});

documentTitles["datos.html#obtener-datos-filtrados"] = "Obtener datos filtrados";
index.add({
    url: "datos.html#obtener-datos-filtrados",
    title: "Obtener datos filtrados",
    body: "## Obtener datos filtrados  "
});

documentTitles["datos.html#ejemplo-de-solicitud-para-preguntas-filtrando-por-aos"] = "Ejemplo de solicitud para preguntas filtrando por años";
index.add({
    url: "datos.html#ejemplo-de-solicitud-para-preguntas-filtrando-por-aos",
    title: "Ejemplo de solicitud para preguntas filtrando por años",
    body: "### Ejemplo de solicitud para preguntas filtrando por años  GET http://54.203.249.245/api/datas/1004?year=2008&amp;key=whatever  para mostrar más de un año solo hace falta agregar una coma: GET http://54.203.249.245/api/datas/1004?year=2008,2009&amp;key=whatever  "
});

documentTitles["datos.html#resultado"] = "Resultado";
index.add({
    url: "datos.html#resultado",
    title: "Resultado",
    body: "#### Resultado  * HTTP Status: 200 (ok) * Response Body:  ```json {      \&quot;_id\&quot;: 1004,     \&quot;name\&quot;: \&quot;P826\&quot;,     \&quot;description\&quot;: \&quot;La cantidad de árboles en la ciudad\&quot;,     \&quot;dataset\&quot;: \&quot;52b11ed3dd0d63aa27000004\&quot;,     \&quot;typeResponse\&quot;: \&quot;simple\&quot;,     \&quot;datas\&quot;: {         \&quot;2008\&quot;: {             \&quot;1\&quot;: 39,             \&quot;2\&quot;: 80,             \&quot;3\&quot;: 190,             \&quot;4\&quot;: 446,             \&quot;5\&quot;: 751         }     }  } ```  "
});

documentTitles["datos.html#errores"] = "Errores";
index.add({
    url: "datos.html#errores",
    title: "Errores",
    body: "#### Errores  * 500 Database error * 404 Not found    "
});

documentTitles["datos.html#ejemplo-de-solicitud-para-preguntas-filtrando-por-gnero"] = "Ejemplo de solicitud para preguntas filtrando por género";
index.add({
    url: "datos.html#ejemplo-de-solicitud-para-preguntas-filtrando-por-gnero",
    title: "Ejemplo de solicitud para preguntas filtrando por género",
    body: "### Ejemplo de solicitud para preguntas filtrando por género  GET http://54.203.249.245/api/datas/1004?genre=1&amp;key=whatever   "
});

documentTitles["datos.html#resultado"] = "Resultado";
index.add({
    url: "datos.html#resultado",
    title: "Resultado",
    body: "#### Resultado  * HTTP Status: 200 (ok) * Response Body:  ```json {      \&quot;_id\&quot;: 1004,     \&quot;name\&quot;: \&quot;P826\&quot;,     \&quot;description\&quot;: \&quot;La cantidad de árboles en la ciudad\&quot;,     \&quot;dataset\&quot;: \&quot;52b11ed3dd0d63aa27000004\&quot;,     \&quot;typeResponse\&quot;: \&quot;simple\&quot;,     \&quot;datas\&quot;: {       ...         \&quot;2008\&quot;: {             \&quot;1\&quot;: 52,             \&quot;2\&quot;: 68,             \&quot;3\&quot;: 139,             \&quot;4\&quot;: 205,             \&quot;5\&quot;: 336         },       ...     }  } ```  "
});

documentTitles["datos.html#errores"] = "Errores";
index.add({
    url: "datos.html#errores",
    title: "Errores",
    body: "#### Errores  * 500 Database error * 404 Not found     "
});

documentTitles["datos.html#ejemplo-de-solicitud-para-preguntas-filtrando-por-edad"] = "Ejemplo de solicitud para preguntas filtrando por edad";
index.add({
    url: "datos.html#ejemplo-de-solicitud-para-preguntas-filtrando-por-edad",
    title: "Ejemplo de solicitud para preguntas filtrando por edad",
    body: "### Ejemplo de solicitud para preguntas filtrando por edad  GET http://54.203.249.245/api/datas/1004?age=1&amp;key=whatever   "
});

documentTitles["datos.html#resultado"] = "Resultado";
index.add({
    url: "datos.html#resultado",
    title: "Resultado",
    body: "#### Resultado  * HTTP Status: 200 (ok) * Response Body:  ```json {      \&quot;_id\&quot;: 1004,     \&quot;name\&quot;: \&quot;P826\&quot;,     \&quot;description\&quot;: \&quot;La cantidad de árboles en la ciudad\&quot;,     \&quot;dataset\&quot;: \&quot;52b11ed3dd0d63aa27000004\&quot;,     \&quot;typeResponse\&quot;: \&quot;simple\&quot;,     \&quot;datas\&quot;: {       ...         \&quot;2008\&quot;: {           \&quot;1\&quot;: 10,           \&quot;2\&quot;: 23,           \&quot;3\&quot;: 35,           \&quot;4\&quot;: 89,           \&quot;5\&quot;: 136         },       ...     }  } ```  "
});

documentTitles["datos.html#errores"] = "Errores";
index.add({
    url: "datos.html#errores",
    title: "Errores",
    body: "#### Errores  * 500 Database error * 404 Not found     "
});

documentTitles["datos.html#ejemplo-de-solicitud-para-preguntas-filtrando-por-nivel-socio-economico"] = "Ejemplo de solicitud para preguntas filtrando por nivel socio economico";
index.add({
    url: "datos.html#ejemplo-de-solicitud-para-preguntas-filtrando-por-nivel-socio-economico",
    title: "Ejemplo de solicitud para preguntas filtrando por nivel socio economico",
    body: "### Ejemplo de solicitud para preguntas filtrando por nivel socio economico  GET http://54.203.249.245/api/datas/1004?nse=1&amp;key=whatever   "
});

documentTitles["datos.html#resultado"] = "Resultado";
index.add({
    url: "datos.html#resultado",
    title: "Resultado",
    body: "#### Resultado  * HTTP Status: 200 (ok) * Response Body:  ```json {      \&quot;_id\&quot;: 1004,     \&quot;name\&quot;: \&quot;P826\&quot;,     \&quot;description\&quot;: \&quot;La cantidad de árboles en la ciudad\&quot;,     \&quot;dataset\&quot;: \&quot;52b11ed3dd0d63aa27000004\&quot;,     \&quot;typeResponse\&quot;: \&quot;simple\&quot;,     \&quot;datas\&quot;: {       ...         \&quot;2008\&quot;: {           \&quot;1\&quot;: 3,           \&quot;2\&quot;: 11,           \&quot;3\&quot;: 26,           \&quot;4\&quot;: 43,           \&quot;5\&quot;: 56         },       ...     }  } ```  "
});

documentTitles["datos.html#errores"] = "Errores";
index.add({
    url: "datos.html#errores",
    title: "Errores",
    body: "#### Errores  * 500 Database error * 404 Not found     "
});

documentTitles["datos.html#ejemplo-de-solicitud-para-preguntas-filtrando-por-zona"] = "Ejemplo de solicitud para preguntas filtrando por zona";
index.add({
    url: "datos.html#ejemplo-de-solicitud-para-preguntas-filtrando-por-zona",
    title: "Ejemplo de solicitud para preguntas filtrando por zona",
    body: "### Ejemplo de solicitud para preguntas filtrando por zona  GET http://54.203.249.245/api/datas/1004?zone=1&amp;key=whatever   "
});

documentTitles["datos.html#resultado"] = "Resultado";
index.add({
    url: "datos.html#resultado",
    title: "Resultado",
    body: "#### Resultado  * HTTP Status: 200 (ok) * Response Body:  ```json {      \&quot;_id\&quot;: 1004,     \&quot;name\&quot;: \&quot;P826\&quot;,     \&quot;description\&quot;: \&quot;La cantidad de árboles en la ciudad\&quot;,     \&quot;dataset\&quot;: \&quot;52b11ed3dd0d63aa27000004\&quot;,     \&quot;typeResponse\&quot;: \&quot;simple\&quot;,     \&quot;datas\&quot;: {       ...         \&quot;2008\&quot;: {           \&quot;1\&quot;: 4,           \&quot;2\&quot;: 11,           \&quot;3\&quot;: 36,           \&quot;4\&quot;: 83,           \&quot;5\&quot;: 116         },       ...     }  } ```  "
});

documentTitles["datos.html#errores"] = "Errores";
index.add({
    url: "datos.html#errores",
    title: "Errores",
    body: "#### Errores  * 500 Database error * 404 Not found"
});


