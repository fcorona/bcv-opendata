file = open('ConsolidadoTotalDatos.csv')
matrix = []

res = file.next()

while res:
    matrix.append(res.strip().split(','))
    res = file.next()

#anio_variable