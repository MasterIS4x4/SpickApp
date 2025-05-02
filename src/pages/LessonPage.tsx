import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
} from '@ionic/react'
import { useAppDispatch, useAppSelector } from '../store'
import { useEffect, useState } from 'react'
import { setCurrentTab } from '../reducers/navigation'
import { ILesson } from '../model/lesson'
import { getLesson, getNextLesson } from '../service/lesson'
import { LearnLesson } from '../components/LearnLesson'
import { generateQuizzes } from '../service/quiz'
import { Quizzes } from '../components/Quizzes'
import { useParams } from 'react-router'
import { IQuiz, QuizDataType } from '../model/quiz'
import { WordCard } from '../components/WordCard'
import { basePath } from '../App'

enum LessonStatus {
  LEARNING,
  QUIZ,
  DONE,
}

export const LessonPage = ({ history }) => {
  const dispatch = useAppDispatch()
  const params = useParams<{ id: string }>()
  const id = params.id
  const [lesson, setLesson] = useState<ILesson | undefined>()
  const [quizzes, setQuizzes] = useState<IQuiz[]>([])
  const [status, setStatus] = useState<LessonStatus>(LessonStatus.LEARNING)
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1)

  useEffect(() => {
    dispatch(setCurrentTab({ title: 'Lesson ' + id }))
    // Fetch lessons from the API or local storage
    getLesson(id)
      .then(lesson => {
        setLesson(lesson)
        const quizzes = generateQuizzes(lesson)
        console.log('Quizzes: ', quizzes)
        setQuizzes(quizzes)
        setStatus(LessonStatus.LEARNING)
      })
      .catch(err => {
        alert('Error fetching lessons. DB may be not available')
      })
    // reset status to learning
  }, [params.id])

  const startQuiz = () => {
    setStatus(LessonStatus.QUIZ)
  }

  const continueLearning = () => {
    getNextLesson(id)
      .then(nextLesson => {
        if (nextLesson) {
          history.push(basePath + 'lessons/' + nextLesson.id)
        } else {
          // go to lessons page. no next lesson available
          history.push(basePath + 'lessons')
        }
      })
      .catch(err => {
        // go to lessons page. no next lesson available
      })
  }

  return (
    <IonContent
      className="ion-no-padding"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {status === LessonStatus.LEARNING && (
        <>
          <LearnLesson lesson={lesson} onVideoEnd={startQuiz} autoPlay={true} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: '.5rem',
            }}
          >
            <IonButton onClick={startQuiz} style={{ margin: '1em' }}>
              Start Quiz
            </IonButton>
          </div>
        </>
      )}
      {status === LessonStatus.QUIZ && (
        <>
          <Quizzes quizzes={quizzes} onQuizzesFinish={() => setStatus(LessonStatus.DONE)} />
        </>
      )}
      {status === LessonStatus.DONE && (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: '.5rem',
            }}
          >
            <IonButton onClick={continueLearning} style={{ margin: '1em' }}>
              Continue Learning
            </IonButton>
            {/*TODO: add icon(s)*/}
          </div>
          <LearnLesson lesson={lesson} />
          <h3 className="ion-padding">Words learned:</h3>
          <div style={{ width: '100%' }}>
            {lesson.words.map((word, index) => (
              <div
                style={{
                  backgroundColor:
                    hoveredIndex === index ? 'var(--ion-color-light-tint)' : 'transparent',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => setHoveredIndex(index)}
              >
                <WordCard
                  word={word}
                  types={[QuizDataType.Text, QuizDataType.Audio, QuizDataType.Image]}
                  key={index}
                  showLabel={true}
                />
                <IonItemDivider
                  style={{
                    // TODO: make divider smaller
                    backgroundColor: 'var(--ion-color-medium-tint)', // Optional: make it more visible
                    opacity: 0.7, // Optional: subtle appearance
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </IonContent>
  )
}
