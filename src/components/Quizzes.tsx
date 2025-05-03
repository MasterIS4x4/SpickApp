import { IMultipleChoiceQuiz, IQuiz, ISpeakingQuiz, QuizDataType, QuizType } from '../model/quiz'
import { useEffect, useState } from 'react'
import { IonProgressBar } from '@ionic/react'
import { MultipleChoiceQuiz } from './MultipleChoiceQuiz'
import { CongratsAnimation } from './CongratsAnimation'
import { useAppDispatch, useAppSelector } from '../store'
import { lessonsSelector, setCurrentQuiz } from '../reducers/lessons'
import { saveLessonsToStorage } from '../storage/lessons'
import { getLessonQuizIndex } from '../service/lesson'
import { SpeakingQuiz } from './SpeakingQuiz'

interface QuizzesProps {
  quizzes: IQuiz[]
  currentQuiz?: number
  onQuizChange?: (index: number) => void
  onQuizzesFinish?: () => void
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
    if (currentQuizIndex === props.quizzes.length - 1) {
      setShowCongrats(true)
      setIsQuizzesDone(true)
    } else if (currentQuizIndex >= props.quizzes.length) {
      console.error('Invalid quiz index')
    } else {
      setQuizNumber(currentQuizIndex + 1)
    }
  }

  // TODO: button to go back to learning (YT)

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
        />
      )}
      {!isQuizzesDone && props.quizzes[currentQuizIndex].type === QuizType.Speaking && (
        <SpeakingQuiz
          quiz={props.quizzes[currentQuizIndex] as ISpeakingQuiz}
          onNext={handleNextQuiz}
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
