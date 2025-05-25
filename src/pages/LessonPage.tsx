import { IonButton, IonContent, IonItemDivider } from '@ionic/react'
import { useAppDispatch, useAppSelector } from '../store'
import { useEffect, useState } from 'react'
import { setCurrentTab } from '../reducers/navigation'
import { ILesson } from '../model/lesson'
import { getLesson, getNextLesson } from '../service/lesson'
import { LearnLesson } from '../components/LearnLesson'
import { Quizzes } from '../components/Quizzes'
import { useParams } from 'react-router'
import { IQuiz, QuizDataType } from '../model/quiz'
import { WordCard } from '../components/WordCard'
import { basePath } from '../App'
import { lessonsSelector, setCurrentLesson, setLessonStatus } from '../reducers/lessons'
import { saveLessonsToStorage } from '../storage/lessons'
import { LessonStatus } from '../model/states'
import { SpeakingQuiz } from '../components/SpeakingQuiz'

export const LessonPage = ({ history }) => {
  const dispatch = useAppDispatch()
  const params = useParams<{ id: string }>()
  const id = params.id
  const lessonsState = useAppSelector(lessonsSelector)
  const lessonState = getLesson(lessonsState, id)
  const lesson: ILesson = lessonState?.lesson
  const status = lessonState?.status || LessonStatus.LEARNING
  const quizzes: IQuiz[] = lessonState?.quizzes
  const currentQuiz = lessonState?.currentQuiz

  const [hoveredIndex, setHoveredIndex] = useState<number>(-1)

  useEffect(() => {
    dispatch(setCurrentTab({ title: 'Lesson ' + id }))
    dispatch(setCurrentLesson(id))
  }, [params.id])

  const startSpeaking = () => {
    dispatch(setLessonStatus({ lessonId: id, status: LessonStatus.SPEAKING }))
  }

  const startQuiz = () => {
    dispatch(setLessonStatus({ lessonId: id, status: LessonStatus.QUIZ }))
  }

  const onQuizFinish = async () => {
    dispatch(setLessonStatus({ lessonId: id, status: LessonStatus.DONE }))
    await saveLessonsToStorage(lessonsState)
  }

  const continueLearning = () => {
    const nextLessonState = getNextLesson(lessonsState, id)
    if (nextLessonState) {
      history.push(basePath + 'lessons/' + nextLessonState.lesson.id)
    } else {
      // go to lessons page. no next lesson available
      history.push(basePath + 'lessons')
    }
  }

  return (
    <IonContent
      className="ion-no-padding"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {status === LessonStatus.LEARNING && (
        <>
          <LearnLesson lesson={lesson} onVideoEnd={startSpeaking} autoPlay={true} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: '.5rem',
            }}
          >
            <IonButton onClick={startSpeaking} style={{ margin: '1em' }}>
              Start Quiz
            </IonButton>
          </div>
        </>
      )}
      {status === LessonStatus.SPEAKING && <SpeakingQuiz words={lesson.words} onNext={startQuiz} />}
      {status === LessonStatus.QUIZ && (
        <>
          <Quizzes currentQuiz={currentQuiz} quizzes={quizzes} onQuizzesFinish={onQuizFinish} />
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
