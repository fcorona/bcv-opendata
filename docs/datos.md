# Datos

Los datos recopilan la información puntual de un indicador o una pregunta
dependiendo del tipo de dataset al que hagan parte, contienen un conjunto de
valores llamados datas que registra año por año el valor que tuvieron esos datos.


## Indicadores
Los datos reciben el nombre de indicador para los datasets del tipo 1 como el
informe de calidad de vida.

```json
{
  "id": {type: Number, index: true, unique: true},
  "name": String,
  "dataset": String,
  "dimension": String,
  "category": String,
  "description": String,
  "measureType": String,
  "source": String,
  "coverage": String,
  "period": String,
  "datas": {
    "year": "value"
  }
}

```

* **id**: es un valor único que identifica al indicador.
* **name**: el nombre del indicador.
* **dataset**: el identificador del dataset al que hace parte este indicador.
* **dimension**: el identificador de la dimensión al que hace parte este
indicador.
* **category**: el identificador de la categoría al que hace parte este
indicador.
* **description**: la descripción del indicador.
* **measureType**: el tipo de medida que puede tener este indicador: 
  * Alfabético
  * Índice
  * Numérico
  * Numérico en Años
  * Numérico en Kilómetros
  * Numérico en Metros Cuadrados
  * Numérico en Micras
  * Numérico en Toneladas
  * Porcentual
  * Tasa

* **source**: la fuente oficial de donde fueron recaudados los datos de este
indicador
* **coverage**: la cobertura del indicador:
  * Distrital
  * 13 areas
  * Colombia

* **period**: la periodicidad con la que los datos del indicador son recaudados:
  * Anual
  * Bianual
  * Censo

* **datas**: el conjunto de valores año por año para este indicador.

### Filtros

* Años: Los indicadores pueden filtrarse para que muestre uno o varios años.


## Preguntas
Los datos reciben el nombre de preguntas para los datasets del tipo 2 como la
encuesta de participación ciudadana.

```json
{
  "id": {type: Number, index: true, unique: true},
  "name": String,
  "dataset": String,
  "dimension": String,
  "category": String,
  "description": String,
  "measureType": String,
  "source": String,
  "coverage": String,
  "period": String,
  "datas": {
    "year": "value"
  }
}

```

* **id**: es un valor único que identifica a la pregunta.
* **name**: el nombre de la pregunta.
* **dataset**: el identificador del dataset al que hace parte esta pregunta.
* **description**: la descripción de la pregunta.
* **typeResponse**: distingue el tipo de respuesta: "multiple" ó "simple"
* **datas**: el conjunto de valores año por año para este indicador, agrupados 
por valores de respuestas.

### Filtros

Las preguntas tienen una caracterización que permite realizar diferentes tipos
de filtros según las personas que las contestaron:

* Años: Las preguntas pueden filtrarse para que muestre uno o varios años.

* Género: Las preguntas pueden filtrarse por el género de las personas 
(Masculino,Femenino).

* Edad: Las preguntas pueden filtrarse para que muestre las respuestas de las
personas en un rango de edad.

* Nivel Socio Economico: Las preguntas pueden filtrarse para que muestre las
respuestas de las personas con cierto nivel socio economico.

* Zona: Las preguntas pueden filtrarse para que muestre las respuestas de las
personas que viven en ciertas zonas de la ciudad.


## Obtener datos

**url** GET datas/{id}

### Descripción

Devuelve el conjunto de datos cuyo identificador es {id}.


### Ejemplo de solicitud para indicadores

GET http://54.203.249.245/api/datas/0?key=whatever

#### Resultado

* HTTP Status: 200 (ok)
* Response Body:

```json
{
  "_id": 0,
  "dataset": "52b1d45fecdf70df0a000001",
  "dimension": "52b1d45fecdf70df0a000002",
  "category": "52b1d45fecdf70df0a000003",
  "name": "Tasa de cobertura bruta en básica primaria",
  "description": "Mide la población matriculada en educación primaria (grados 1º a 5º)  sobre la población de 6 a 10 años",
  "measureType": "Porcentual",
  "source": "Secretaría de Educación del Distrito",
  "coverage": "Distrital",
  "period": "Anual",
  "datas": {
    "1998": 0.9490000000000001,
    "1999": 1.023,
    "2000": 1.0070000000000001,
    "2001": 1.022,
    "2002": 1.141,
    "2003": 1.07,
    "2004": 1.062,
    "2005": 1.062,
    "2006": 1.057,
    "2007": 1.0759999999999998,
    "2008": 1.088,
    "2009": 1.0859999999999999,
    "2010": 1.067,
    "2011": 1.026,
    "2012": 0.972
  }
}
```

#### Errores

* 500 Database error
* 404 Not found



### Ejemplo de solicitud para preguntas

GET http://54.203.249.245/api/datas/1004?key=whatever

#### Resultado

* HTTP Status: 200 (ok)
* Response Body:

```json
{

    "_id": 1004,
    "name": "P826",
    "description": "La cantidad de árboles en la ciudad",
    "dataset": "52b11ed3dd0d63aa27000004",
    "typeResponse": "simple",
    "datas": {
        "1998": {
            "empty": 1524,
            "": 1524
        },
        "1999": {
            "empty": 1500,
            "": 1500
        },
        "2000": {
            "empty": 1507,
            "": 1507
        },
        "2002": {
            "empty": 1516,
            "": 1516
        },
        "2003": {
            "empty": 1511,
            "": 1511
        },
        "2004": {
            "empty": 1667,
            "": 1667
        },
        "2005": {
            "empty": 1663,
            "": 1663
        },
        "2006": {
            "empty": 1521,
            "": 1521
        },
        "2007": {
            "empty": 1517,
            "": 1517
        },
        "2008": {
            "1": 39,
            "2": 80,
            "3": 190,
            "4": 446,
            "5": 751
        },
        "2009": {
            "1": 109,
            "2": 139,
            "3": 297,
            "4": 402,
            "5": 653
        },
        "2010": {
            "1": 83,
            "2": 150,
            "3": 309,
            "4": 400,
            "5": 571
        },
        "2011": {
            "1": 276,
            "2": 394,
            "3": 563,
            "4": 222,
            "5": 53
        },
        "2012": {
            "1": 538,
            "2": 523,
            "3": 311,
            "4": 109,
            "5": 19
        }
    }

}
```

#### Errores

* 500 Database error
* 404 Not found

## Obtener datos filtrados

### Ejemplo de solicitud para preguntas filtrando por años

GET http://54.203.249.245/api/datas/1004?year=2008&key=whatever

para mostrar más de un año solo hace falta agregar una coma:
GET http://54.203.249.245/api/datas/1004?year=2008,2009&key=whatever

#### Resultado

* HTTP Status: 200 (ok)
* Response Body:

```json
{

    "_id": 1004,
    "name": "P826",
    "description": "La cantidad de árboles en la ciudad",
    "dataset": "52b11ed3dd0d63aa27000004",
    "typeResponse": "simple",
    "datas": {
        "2008": {
            "1": 39,
            "2": 80,
            "3": 190,
            "4": 446,
            "5": 751
        }
    }

}
```

#### Errores

* 500 Database error
* 404 Not found



### Ejemplo de solicitud para preguntas filtrando por género

GET http://54.203.249.245/api/datas/1004?genre=1&key=whatever


#### Resultado

* HTTP Status: 200 (ok)
* Response Body:

```json
{

    "_id": 1004,
    "name": "P826",
    "description": "La cantidad de árboles en la ciudad",
    "dataset": "52b11ed3dd0d63aa27000004",
    "typeResponse": "simple",
    "datas": {
      ...
        "2008": {
            "1": 52,
            "2": 68,
            "3": 139,
            "4": 205,
            "5": 336
        },
      ...
    }

}
```

#### Errores

* 500 Database error
* 404 Not found




### Ejemplo de solicitud para preguntas filtrando por edad

GET http://54.203.249.245/api/datas/1004?age=1&key=whatever


#### Resultado

* HTTP Status: 200 (ok)
* Response Body:

```json
{

    "_id": 1004,
    "name": "P826",
    "description": "La cantidad de árboles en la ciudad",
    "dataset": "52b11ed3dd0d63aa27000004",
    "typeResponse": "simple",
    "datas": {
      ...
        "2008": {
          "1": 10,
          "2": 23,
          "3": 35,
          "4": 89,
          "5": 136
        },
      ...
    }

}
```

#### Errores

* 500 Database error
* 404 Not found




### Ejemplo de solicitud para preguntas filtrando por nivel socio economico

GET http://54.203.249.245/api/datas/1004?nse=1&key=whatever


#### Resultado

* HTTP Status: 200 (ok)
* Response Body:

```json
{

    "_id": 1004,
    "name": "P826",
    "description": "La cantidad de árboles en la ciudad",
    "dataset": "52b11ed3dd0d63aa27000004",
    "typeResponse": "simple",
    "datas": {
      ...
        "2008": {
          "1": 3,
          "2": 11,
          "3": 26,
          "4": 43,
          "5": 56
        },
      ...
    }

}
```

#### Errores

* 500 Database error
* 404 Not found




### Ejemplo de solicitud para preguntas filtrando por zona

GET http://54.203.249.245/api/datas/1004?zone=1&key=whatever


#### Resultado

* HTTP Status: 200 (ok)
* Response Body:

```json
{

    "_id": 1004,
    "name": "P826",
    "description": "La cantidad de árboles en la ciudad",
    "dataset": "52b11ed3dd0d63aa27000004",
    "typeResponse": "simple",
    "datas": {
      ...
        "2008": {
          "1": 4,
          "2": 11,
          "3": 36,
          "4": 83,
          "5": 116
        },
      ...
    }

}
```

#### Errores

* 500 Database error
* 404 Not found