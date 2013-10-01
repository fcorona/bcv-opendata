file = open('ConsolidadoTotalDatos.csv')
matrix = []

res = file.next()

while res:
    try:
        matrix.append(res.strip().split(','))
        res = file.next()
    except:
        break

all_questions = []

year_questions = []
current_year = 0


def type_of_answer(value):
    if len(value)==0:
        return 'empty'

    return 'multi' if len(value.split(';')) > 1 else 'simple'

for answers in matrix[1:]:
    if current_year != answers[8]:
        if len(year_questions)>0:
            all_questions.append(year_questions)

        year_questions = answers[8:]
        current_year = answers[8]
        for index, answer in enumerate(answers[8:]):
            if index == 0:
                continue

            year_questions[index] = type_of_answer(answer)

    else:
        for index, answer in enumerate(answers[8:]):
            try:
                if index == 0 or year_questions[index]=='multi':
                    continue
            except:
                print 'index: %d, len(array): %d' % (index, len(year_questions))
                continue
            type_answer = type_of_answer(answer)
            if type_answer == 'multi':
                year_questions[index] = type_answer
            else:
                year_questions[index] = type_answer if type_answer=='simple' else year_questions[index]

all_questions.append(year_questions)

print 'eche cuadro'

main_types = all_questions[0]
bad_questions = {}
for year_answers in all_questions[1:]:
    for index, type_answer in enumerate(year_answers):
        if index==0:
            print type_answer
            continue
        if type_answer == 'empty':
            continue
        if main_types[index] == 'empty':
            main_types[index] = type_answer

        if main_types[index] != type_answer:
            if( (index+9) not in bad_questions):
                bad_questions[index+9]=year_answers[0]
            else:
                bad_questions[index+9]+= ', ' +year_answers[0]

            print 'bad thing in the %d column' % (index+9)

print '*'*100
print 'results:'
print sorted(bad_questions.keys())
for bad_result in sorted(bad_questions.keys()):
    print '%d: %s' % (bad_result, bad_questions[bad_result])

