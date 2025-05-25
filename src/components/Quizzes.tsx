import { IMultipleChoiceQuiz, IQuiz, QuizType } from '../model/quiz'
import { useEffect, useState } from 'react'
import { IonProgressBar } from '@ionic/react'
import { MultipleChoiceQuiz } from './MultipleChoiceQuiz'
import { CongratsAnimation } from './CongratsAnimation'
import { useAppDispatch } from '../store'
import { setCurrentQuiz } from '../reducers/lessons'

interface QuizzesProps {
  quizzes: IQuiz[]
  currentQuiz?: number
  onQuizChange?: (index: number) => void
  onQuizzesFinish?: () => void
  onBackToLearning?: () => void
}

export const Quizzes = (props: QuizzesProps) => {
  const dispatch = useAppDispatch()

  const [currentQuizIndex, setCurrentQuizIndex] = useState(props?.currentQuiz ?? 0)
  const [showCongrats, setShowCongrats] = useState(false)
  const [isQuizzesDone, setIsQuizzesDone] = useState(false)

  const setQuizNumber = (index: number) => {
    if (index >= 0 && index < props.quizzes.length) {
      setCurrentQuizIndex(index)
      dispatch(setCurrentQuiz(index))
    }
  }

  useEffect(() => {
    setQuizNumber(props.currentQuiz ?? 0)
    setShowCongrats(false)
    setIsQuizzesDone(false)
  }, [])

  useEffect(() => {
    if (currentQuizIndex >= 0 && currentQuizIndex < props.quizzes.length) {
      props.onQuizChange?.(currentQuizIndex)
    }
  }, [currentQuizIndex])

  const handleNextQuiz = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (currentQuizIndex === props.quizzes.length - 1) {
      setShowCongrats(true)
      setIsQuizzesDone(true)
    } else if (currentQuizIndex >= props.quizzes.length) {
      console.error('Invalid quiz index')
    } else {
      setQuizNumber(currentQuizIndex + 1)
    }
  }

  const backToLearning = () => {
    props.onBackToLearning?.()
  }

  return (
    <div style={{ paddingTop: '.35rem' }}>
      {!isQuizzesDone && (
        <IonProgressBar
          value={(currentQuizIndex + 0.5) / props.quizzes.length}
          style={{ height: '1rem' }}
        />
      )}
      {!isQuizzesDone && props.quizzes[currentQuizIndex].type === QuizType.MultipleChoice && (
        <MultipleChoiceQuiz
          quiz={props.quizzes[currentQuizIndex] as IMultipleChoiceQuiz}
          onNext={handleNextQuiz}
          onBackToLearning={backToLearning}
        />
      )}
      {isQuizzesDone && (
        <>
          {showCongrats && (
            <CongratsAnimation
              visible={true}
              onClose={() => {
                setShowCongrats(false)
                props.onQuizzesFinish?.()
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
