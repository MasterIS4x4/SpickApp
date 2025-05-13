import { IonButton, IonContent, IonItemDivider } from '@ionic/react'
import { useAppDispatch, useAppSelector } from '../store'
import { useEffect, useState } from 'react'
import { setCurrentTab } from '../reducers/navigation'
import { ILesson } from '../model/lesson'
import { getLesson, getNextLesson } from '../service/lesson'
import { LearnLesson } from '../components/LearnLesson'
import { Quizzes } from '../components/Quizzes'
import { useParams } from 'react-router'
import { IQuiz, ISpeakingQuiz, QuizDataType, QuizType } from '../model/quiz'
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
  const [speakingQuiz, setSpeakingQuiz] = useState<ISpeakingQuiz | null>(null)

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

        const speakingWords = [...lesson.words].sort(() => 0.5 - Math.random()).slice(0, 5)
        setSpeakingQuiz({
          question: 'Say the words out loud',
          type: QuizType.Speaking,
          words: speakingWords,
          inputTypes: [QuizDataType.Text],
        })
      })
      .catch(err => {
        alert('Error fetching lessons. DB may be not available')
      })
    // reset status to learning
  }, [params.id])

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
          <Quizzes currentQuiz={currentQuiz} quizzes={quizzes} onQuizzesFinish={onQuizFinish} />
        </>
        <Quizzes quizzes={quizzes} onQuizzesFinish={() => setStatus(LessonStatus.SPEAKING)} />
      )}
      {status === LessonStatus.SPEAKING && speakingQuiz && (
        <SpeakingQuiz
          quiz={speakingQuiz as ISpeakingQuiz}
          onNext={() => setStatus(LessonStatus.DONE)}
        />
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
