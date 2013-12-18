# Categoría

Una categoría es una agrupación de datos de los informes en subtópicos:

```json
{
  "categoryId": {type: Number, index: true, unique: true},
  "name": String,
  "dataset": String,
  "dimension": String
}

```

* **categoryId**: es un valor único que identifica a la dimensión.
* **name**: el nombre descriptivo de la categoría.
* **dataset**: el identificador del dataset al que hace parte esta categoría.
* **dimension**: el identificador de la dimensión al que hace parte esta
categoría.


## Obtener categoría

**url** GET categories/{categoryId}

### Descripción

Devuelve la categoría cuyo identificador es {categoryId}, la categoría es
retornada junto con los datos(indicadores ó preguntas) que contiene.


### Ejemplo de solicitud

GET http://54.203.249.245/api/categories/0?key=whatever

#### Resultado

* HTTP Status: 200 (ok)
* Response Body:

```json
{
  "categoryId": 0,
  "dimension": "52b1d45fecdf70df0a000002",
  "dataset": "52b1d45fecdf70df0a000001",
  "name": "Cobertura",
  "datas": [
    {
      "_id": 0,
      "name": "Tasa de cobertura bruta en básica primaria",
      "href": "http://54.203.249.245/api/datas/0?key=whatever"
    },
    {
      "_id": 1,
      "name": "Tasa de cobertura bruta en preescolar",
      "href": "http://54.203.249.245/api/datas/1?key=whatever"
    },
    {
      "_id": 2,
      "name": "Tasa de cobertura bruta en media vocacional",
      "href": "http://54.203.249.245/api/datas/2?key=whatever"
    },
...
    {
      "_id": 21,
      "name": "Tasa de cobertura neta en media vocacional",
      "href": "http://54.203.249.245/api/datas/21?key=whatever"
    }
  ]
}
```

#### Errores

* 500 Database error
* 404 Not found