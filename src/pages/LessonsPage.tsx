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
import { useEffect, useState } from 'react'
import { setCurrentTab } from '../reducers/navigation'
import { ILesson } from '../model/lesson'
import { getLessons } from '../service/lesson'
import { BilingualTitle } from '../components/BilingualTitle'
import { book, checkmarkCircleOutline } from 'ionicons/icons'
import { basePath } from '../App'

export const LessonsPage = () => {
  const dispatch = useAppDispatch()
  const [lessons, setLessons] = useState<ILesson[]>([])

  useEffect(() => {
    dispatch(setCurrentTab({ title: 'Lessons' }))
    // Fetch lessons from the API or local storage
    getLessons()
      .then(lessons => {
        setLessons(lessons)
      })
      .catch(err => {
        alert('Error fetching lessons. DB may be not available')
      })
  }, [])

  const isLessonCompleted = (lesson: ILesson) => {
    return lesson.id === '1' // TODO: replace with actual logic
  }

  // TODO: mark current lesson
  // - display number of quizes done per lesson
  // add icon per lesson

  return (
    <IonContent className="ion-padding">
      <BilingualTitle ro={'Lecții'} eng={'Lessons'} />
      <IonGrid>
        <IonRow>
          {lessons.map((lesson, index) => {
            const isCompleted = isLessonCompleted(lesson)
            return (
              <IonCol key={lesson.id} size="12" sizeMd="6" sizeLg="4">
                <IonCard
                  button
                  routerLink={basePath + `lessons/${lesson.id}`}
                  style={{
                    textAlign: 'center',
                    padding: '1em',
                    border: isCompleted ? '2px solid var(--ion-color-success)' : undefined,
                    opacity: isCompleted ? 1 : 0.95,
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
