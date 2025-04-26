import {IMultipleChoiceQuiz, QuizDataType} from "../model/quiz"
import {IonBadge, IonButton, IonCol, IonGrid, IonLabel, IonRow} from "@ionic/react"
import {DataTypeRenderer} from "./DataTypeRenderer"

interface MultipleChoiceQuizProps {
  quiz: IMultipleChoiceQuiz
  onNext: () => void
}

export const MultipleChoiceQuiz = (props: MultipleChoiceQuizProps) => {
  const correctWord = props.quiz.words[props.quiz.correct]
  const inputTypes = props.quiz.inputTypes
  const outputType = props.quiz.outputType
  const words = props.quiz.words
  const correct = props.quiz.correct

  return (
    <div className="ion-padding">
      <h2>{props.quiz.question}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
        {inputTypes.map((inputType, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {/*<IonLabel key={index} style={{ marginRight: '1em' }}>*/}
            {/*  {inputType}:*/}
            {/*</IonLabel>*/}
            <DataTypeRenderer word={correctWord} type={inputType} />
          </div>
        ))}
      </div>
      <IonGrid style={{ marginTop: '1rem' }}>
        <IonRow className="ion-justify-content-center">
          {words.map((word, index) => (
            <IonCol
              key={index}
              size="12"
              sizeLg={(12 / words.length).toString()}
              style={{
                textAlign: 'center',
                marginBottom: '.5rem', // Add some spacing between rows on mobile
                border: index === correct ? '3px solid green' : '3px solid red',
                borderRadius: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', //justifyContent: 'center',
                flexDirection: outputType === QuizDataType.Image ? 'column-reverse' : 'row'}}>
                <IonBadge style={{padding: ".75rem", fontSize: "1.5rem"}}>
                  {index + 1}
                </IonBadge>
                <DataTypeRenderer word={word} type={props.quiz.outputType} />
              </div>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <IonButton onClick={props.onNext} color="primary">
          Next
        </IonButton>
      </div>
    </div>
  )
}