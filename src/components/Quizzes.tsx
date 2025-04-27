import {IMultipleChoiceQuiz, IQuiz, QuizDataType, QuizType} from "../model/quiz"
import {useEffect, useState} from "react"
import {IonProgressBar} from "@ionic/react"
import {MultipleChoiceQuiz} from "./MultipleChoiceQuiz"
import {CongratsAnimation} from "./CongratsAnimation"

interface QuizzesProps {
  quizzes: IQuiz[]
  onQuizChange?: (index: number) => void
  onQuizzesFinish?: () => void
}

export const Quizzes = (props: QuizzesProps) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [showCongrats, setShowCongrats] = useState(false)
  const [isQuizzesDone, setIsQuizzesDone] = useState(false)

  useEffect(() => {
    setCurrentQuizIndex(0) // set to props.quizzes.length - 1 to test
    setShowCongrats(false)
    setIsQuizzesDone(false)
  }, [])

  useEffect(() => {
    if (currentQuizIndex >= 0 && currentQuizIndex < props.quizzes.length) {
      props.onQuizChange?.(currentQuizIndex)
    }
  }, [currentQuizIndex])

  const handleNextQuiz = () => {
    if (currentQuizIndex === props.quizzes.length - 1) {
      setShowCongrats(true)
      setIsQuizzesDone(true)
    }
    else if (currentQuizIndex >= props.quizzes.length) {
      console.error("Invalid quiz index")
    }
    else {
      setCurrentQuizIndex((prevIndex) => prevIndex + 1)
    }
  }

  return (
    <div style={{paddingTop: ".35rem"}}>
      {!isQuizzesDone && <IonProgressBar value={(currentQuizIndex + 1) / props.quizzes.length} style={{height: '1rem'}}/>}
      {!isQuizzesDone && props.quizzes[currentQuizIndex].type === QuizType.MultipleChoice &&
        <MultipleChoiceQuiz
          quiz={props.quizzes[currentQuizIndex] as IMultipleChoiceQuiz}
          onNext={handleNextQuiz}
        />
      }
      {isQuizzesDone && <>
        {showCongrats && (
          <CongratsAnimation visible={true} onClose={() => {
            setShowCongrats(false)
            props.onQuizzesFinish?.()
          }}/>
        )}
      </>}
    </div>
  )
}