import {IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList} from "@ionic/react"
import {useAppDispatch, useAppSelector} from "../store"
import {useEffect, useState} from "react"
import {setCurrentTab} from "../reducers/navigation"
import {ILesson} from "../model/lesson"
import {getLesson} from "../service/lesson"
import {BilingualTitle} from "../components/BilingualTitle"
import {LearnLesson} from "../components/LearnLesson"
import {generateQuizzes} from "../service/quiz"
import {Quizzes} from "../components/Quizzes"
import {useParams} from "react-router"
import {IQuiz} from "../model/quiz"

enum LessonStatus {
  LEARNING, QUIZ, DONE
}

export const LessonPage = () => {
  const dispatch = useAppDispatch()
  const params = useParams<{id: string}>()
  const id = params.id
  const [lesson, setLesson] = useState<ILesson|undefined>()
  const [quizzes, setQuizzes] = useState<IQuiz[]>([])
  const [status, setStatus] = useState<LessonStatus>(LessonStatus.LEARNING)

  useEffect(() => {
    //@ts-ignore
    dispatch(setCurrentTab({title: 'Lesson'}))
    // Fetch lessons from the API or local storage
    getLesson(id).then(lesson => {
      setLesson(lesson)
      const quizzes = generateQuizzes(lesson)
      console.log("Quizzes: ", quizzes)
      setQuizzes(quizzes)
    }).catch(err => {
      alert("Error fetching lessons. DB may be not available")
    })
  }, [])

  const startQuiz = () => {
    setStatus(LessonStatus.QUIZ)
  }

  return (
    <IonContent className="ion-no-padding" style={{display: "flex", flexDirection: "column", height: "100%"}}>
      {status === LessonStatus.LEARNING && <>
        <BilingualTitle ro={"Lecția " + id} eng={"Lesson "+id} />
        {/*<LearnLesson lesson={lesson} onVideoEnd={startQuiz} />*/}
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: ".5rem"}}>
          <IonButton onClick={startQuiz} style={{margin: "1em"}}>Start Quiz</IonButton>
        </div>
      </>}
      {status === LessonStatus.QUIZ && <>
        <Quizzes quizzes={quizzes} />
      </>}
    </IonContent>
  )
}