import {QuizType, IQuiz} from "../model/quiz"
import {useEffect, useState} from "react"
import {IonProgressBar} from "@ionic/react"
import {MultipleChoiceQuiz} from "./MultipleChoiceQuiz"
import {IMultipleChoiceQuiz} from "../model/quiz"

interface QuizzesProps {
  quizzes: IQuiz[]
  onQuizChange?: (index: number) => void
  onQuizzesFinish?: () => void
}

export const Quizzes = (props: QuizzesProps) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)

  useEffect(() => {
    if (currentQuizIndex >= props.quizzes.length) {
      props.onQuizzesFinish?.()
    } else {
      props.onQuizChange?.(currentQuizIndex)
    }
  }, [currentQuizIndex])

  const handleNextQuiz = () => {
    setCurrentQuizIndex((prevIndex) => prevIndex + 1)
  }

  return (
    <div style={{paddingTop: ".35rem"}}>
      <IonProgressBar value={(currentQuizIndex + 1) / props.quizzes.length} style={{height: '1rem'}}/>
      {props.quizzes[currentQuizIndex].type === QuizType.MultipleChoice &&
        <MultipleChoiceQuiz
          quiz={props.quizzes[currentQuizIndex] as IMultipleChoiceQuiz}
          onNext={handleNextQuiz}
        />
      }
    </div>
  )
}