import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
} from '@ionic/react'
import { useAppDispatch, useAppSelector } from '../store'
import { useEffect } from 'react'
import { setCurrentTab } from '../reducers/navigation'
import { ILesson } from '../model/lesson'
import { BilingualTitle } from '../components/BilingualTitle'
import { book, checkmarkCircleOutline, refreshCircle } from 'ionicons/icons'
import { basePath } from '../App'
import { lessonsSelector } from '../reducers/lessons'
import { LessonState, LessonStatus } from '../model/states'

export const LessonsPage = () => {
  const dispatch = useAppDispatch()
  const lessonsState = useAppSelector(lessonsSelector)

  useEffect(() => {
    dispatch(setCurrentTab({ title: 'Lessons' }))
  }, [])

  const isLessonCompleted = (lesson: LessonState) => {
    return lesson.status === LessonStatus.DONE
  }

  return (
    <IonContent className="ion-padding">
      <BilingualTitle ro={'Lecții'} eng={'Lessons'} />
      <IonGrid>
        <IonRow>
          {lessonsState.lessons.map((lessonState, index) => {
            const isNotStarted = lessonState.status === LessonStatus.LEARNING || lessonState.status === LessonStatus.SPEAKING
            const isInProgress = lessonState.status === LessonStatus.QUIZ
            const isCompleted = isLessonCompleted(lessonState)
            const lesson: ILesson = lessonState.lesson
            return (
              <IonCol key={lesson.id} size="12" sizeMd="6" sizeLg="4">
                <IonCard
                  button
                  routerLink={basePath + `lessons/${lesson.id}`}
                  style={{
                    textAlign: 'center',
                    padding: '1em',
                    border: isNotStarted
                      ? undefined //'2px solid var(--ion-color-success)'
                      : isInProgress
                        ? '2px solid var(--ion-color-warning)'
                        : '2px solid var(--ion-color-success)',
                    opacity: isNotStarted ? 0.95 : 1,
                    position: 'relative',
                  }}
                >
                  {isCompleted && (
                    <IonIcon
                      icon={checkmarkCircleOutline}
                      color="success"
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        fontSize: '1.8rem',
                      }}
                    />
                  )}

                  {isInProgress && (
                    <IonIcon
                      icon={refreshCircle}
                      color="warning"
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        fontSize: '1.8rem',
                      }}
                    />
                  )}

                  <IonCardHeader>
                    <div style={{ fontSize: '2rem' }}>
                      <IonIcon icon={book} />
                      {/* TODO: Replace with a custom icon per lesson */}
                    </div>
                    <IonCardTitle>
                      {index + 1}. {lesson.nameRO}
                    </IonCardTitle>
                    <IonCardSubtitle>{lesson.nameEN}</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {isCompleted && (
                      <IonBadge color="success" style={{ marginTop: '0.5rem' }}>
                        Lesson completed
                      </IonBadge>
                    )}
                    {isInProgress && (
                      <IonBadge color="warning" style={{ marginTop: '0.5rem' }}>
                        Quiz{' '}
                        {lessonState.currentQuiz !== undefined ? lessonState.currentQuiz + 1 : 0} /{' '}
                        {lessonState.quizzes.length}
                      </IonBadge>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            )
          })}
        </IonRow>
      </IonGrid>
    </IonContent>
  )
}
