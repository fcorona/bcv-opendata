# Dataset

Un dataset agrupa el conjunto de datos de cada informe:

```json
{
  "name": {type: String, index: true, unique: true},
  "type": Number
}

```

* **name**: el nombre e identificador del dataset, es una cadena de texto y unico.

* **type**: describe el tipo de informe, 1 para el informe de indicadores y 2 para
el informe de encuestas.

La diferencia entre un tipo u otro radica en la forma en que son presentados sus
datos:

* **tipo 1**: la información es un indicador único y absoluto que se entrega por
año, no puede ser segmentado.

* **tipo 2**: cada dato es la agregación de la información entregada por varios
individuos, esta información puede ser segmentada por: genero, edad, nivel
socioeconomico y zona geografica.


## Listar datasets

**url** GET datasets

### Descripción

Lista todos los datasets registrados en la plataforma.


### Ejemplo de solicitud

GET http://54.203.249.245/api/datasets/?key=whatever

#### Resultado

* HTTP Status: 200 (ok)
* Response Body:

```json
[

  {
    "name": "iicv",
    "type": 1,
    "href": "http://54.203.249.245/api/datasets/iicv?key=whatever"
  },
  {
    "name": "epc",
    "type": 2,
    "href": "http://54.203.249.245/api/datasets/epc?key=whatever"
  }

]
```

#### Errores

* 500 Database error


## Obtener dataset

**url** GET datasets/{datasetName}

### Descripción

Devuelve el dataset cuyo nombre es {datasetName}


### Ejemplo de solicitud

GET http://54.203.249.245/api/datasets/iicv?key=whatever

#### Resultado

* HTTP Status: 200 (ok)
* Response Body:

```json
{
  "name": "iicv",
  "type": 1,
  "dimensions": [
    {
      "dimensionId": 0,
      "name": "Educación",
      "href": "http://54.203.249.245/api/dimensions/0?key=whatever"
    },
    {
      "dimensionId": 1,
      "name": "Salud",
      "href": "http://54.203.249.245/api/dimensions/1?key=whatever"
    },
...
    {
      "dimensionId": 17,
      "name": "Demográfica",
      "href": "http://54.203.249.245/api/dimensions/17?key=whatever"
    }
  ]
}
```

#### Errores

* 500 Database error
* 404 Not found