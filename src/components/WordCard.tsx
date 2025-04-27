import {IWord} from "../model/lesson"
import {QuizDataType} from "../model/quiz"
import {IonCard, IonCol, IonGrid, IonItem, IonLabel, IonList, IonRow, IonText} from "@ionic/react"
import {DataTypeRenderer} from "./DataTypeRenderer"
import {Fragment} from "react"

interface WordCardProps {
  word: IWord
  types: QuizDataType[]
  showLabel?: boolean
}

export const WordCard = (props: WordCardProps) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: props.showLabel ? 'auto 1fr' : '1fr',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem'
    }}>
      {props.types.map((inputType, index) => (
        <Fragment key={index}>
          {props.showLabel && (
            <IonText style={{ whiteSpace: 'nowrap' }}>{inputType}:</IonText>
          )}
          <DataTypeRenderer word={props.word} type={inputType} />
        </Fragment>
      ))}
    </div>
  )
}