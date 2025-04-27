import {IMultipleChoiceQuiz, QuizDataType} from "../model/quiz"
import {IonBadge, IonButton, IonCard, IonCol, IonGrid, IonItem, IonLabel, IonList, IonRow} from "@ionic/react"
import {DataTypeRenderer} from "./DataTypeRenderer"
import {WordCard} from "./WordCard"
import {useEffect, useState} from "react"

interface MultipleChoiceQuizProps {
  quiz: IMultipleChoiceQuiz
  onNext: () => void
}

/**
 * MultipleChoiceQuiz component - from multiple choices, select *ONLY* the correct ONE
 */
export const MultipleChoiceQuiz = (props: MultipleChoiceQuizProps) => {
  const correctWord = props.quiz.words[props.quiz.correct]
  const inputTypes = props.quiz.inputTypes
  const outputType = props.quiz.outputType
  const words = props.quiz.words
  const correct = props.quiz.correct

  const [selected, setSelected] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)

  const onElementClick = (index: number) => {
    if (!selected.includes(index) && !isSuccess) {
      setSelected((prevSelected) => [...prevSelected, index])
      if (index === correct) {
        setIsSuccess(true)
        // TODO: handle correct answer: play audio, vibrate, etc.
      }
      else {
        // TODO: handle wrong answer: play audio, vibrate, etc.
      }
    }
  }

  const nextWord = () => {
    setSelected([])
    setIsSuccess(false)
    props.onNext()
  }

  return (
    <div className="ion-padding">
      <h2>{props.quiz.question}</h2>
      <WordCard word={correctWord} types={inputTypes} showLabel={true} />
      <IonGrid>
        <IonRow className="ion-justify-content-center">
          {words.map((word, index) => (
            <IonCol
              key={index}
              size="12"
              sizeLg={(12 / words.length).toString()}
              style={{
                textAlign: 'center',
                marginBottom: '.5rem', // Add some spacing between rows on mobile
                border: '2px solid ' + (selected.includes(index) ?
                  (isSuccess && index === correct ? 'var(--ion-color-success)' : 'var(--ion-color-danger)') : 'var(--ion-color-primary)'),
                borderRadius: 10,
              }}
              onClick={() => outputType !== QuizDataType.Audio && onElementClick(index)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', //justifyContent: 'center',
                flexDirection: outputType === QuizDataType.Image ? 'column-reverse' : 'row'}}>
                <IonBadge style={{padding: ".75rem", fontSize: "1.5rem",
                  backgroundColor: selected.includes(index) ?
                    (isSuccess && index === correct ? 'var(--ion-color-success)' : 'var(--ion-color-danger)') : 'var(--ion-color-primary)',
                  }} onClick={() => onElementClick(index) }>
                  {index + 1}
                </IonBadge>
                <DataTypeRenderer word={word} type={props.quiz.outputType} />
              </div>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
      {isSuccess &&
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IonButton onClick={nextWord} color="primary">
            Next
          </IonButton>
        </div>
      }
    </div>
  )
}