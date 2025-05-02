import { IonContent, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react'
import { useAppDispatch, useAppSelector } from '../store'
import { useEffect, useState } from 'react'
import { setCurrentTab } from '../reducers/navigation'
import { ILesson } from '../model/lesson'
import { getLessons } from '../service/lesson'
import { BilingualTitle } from '../components/BilingualTitle'
import { book } from 'ionicons/icons'
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

  // TODO: mark current lesson
  // - display number of quizes done per lesson
  // add icon per lesson

  return (
    <IonContent>
      <BilingualTitle ro={'Lecții'} eng={'Lessons'} />
      <IonList>
        {lessons.map((lesson, index) => (
          <IonItem key={index} routerLink={basePath + `lessons/${lesson.id}`}>
            <IonIcon icon={book} slot="start" />
            <IonLabel>
              <h2>
                {index + 1}. {lesson.nameRO} - {lesson.nameEN}
              </h2>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </IonContent>
  )
}
