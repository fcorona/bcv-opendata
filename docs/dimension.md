# Dimensión

Una dimensión es una subclasificación de la información de los informes en
tópicos:

```json
{
  "dimensionId": {type: Number, index: true, unique: true},
  "name": String,
  "dataset": String
}

```

* **dimensionId**: es un valor único que identifica a la dimensión.
* **name**: el nombre descriptivo de la dimensión.
* **dataset**: el identificador del dataset al que hace parte esta dimensión.


## Obtener dimensión

**url** GET dimensions/{dimensionId}

### Descripción

Devuelve la dimensión cuyo identificador es {dimensionId}, la dimensión es
retornada junto con las categorías que contiene.


### Ejemplo de solicitud

GET http://api.bogotacomovamos.org/api/dimensions/0?key=whatever

#### Resultado

* HTTP Status: 200 (ok)
* Response Body:

```json
{
  "dimensionId": 0,
  "dataset": "52b1d45fecdf70df0a000001",
  "name": "Educación",
  "categories": [
    {
      "categoryId": 0,
      "name": "Cobertura",
      "href": "http://api.bogotacomovamos.org/api/categories/0?key=whatever"
    },
    {
      "categoryId": 1,
      "name": "Eficiencia Interna",
      "href": "http://api.bogotacomovamos.org/api/categories/1?key=whatever"
    },
    {
      "categoryId": 2,
      "name": "Años promedio de educación",
      "href": "http://api.bogotacomovamos.org/api/categories/2?key=whatever"
    },
    {
      "categoryId": 3,
      "name": "Analfabetismo",
      "href": "http://api.bogotacomovamos.org/api/categories/3?key=whatever"
    },
    {
      "categoryId": 4,
      "name": "Calidad de la Educación",
      "href": "http://api.bogotacomovamos.org/api/categories/4?key=whatever"
    }
  ]
}
```

#### Errores

* 500 Database error
* 404 Not found