import { useParams } from 'react-router'
import { IonContent } from '@ionic/react'
import { useAppDispatch, useAppSelector } from '../store'
import { lessonsSelector, setLessonStatus } from '../reducers/lessons'
import { SpeakingQuiz } from '../components/SpeakingQuiz'
import { basePath } from '../App'
import { LessonStatus } from '../model/states'

export const SpeakingPage = ({ history }) => {
  const dispatch = useAppDispatch()
  const params = useParams<{ id: string }>()
  const searchParams = new URLSearchParams(window.location.search)
  const lessonsState = useAppSelector(lessonsSelector)
  const id = params.id
  const words = lessonsState.lessons.find(lesson => lesson.lesson.id === id)?.lesson.words || []

  const onNext = () => {
    history.push(basePath + 'lessons/' + id)
    const to = parseInt(searchParams.get('to'))
    if (to) dispatch(setLessonStatus({ lessonId: id, status: to as unknown as LessonStatus }))
  }

  return (
    <IonContent className="ion-padding">
      <SpeakingQuiz words={words} onNext={onNext} />
    </IonContent>
  )
}
