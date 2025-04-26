import {IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList} from "@ionic/react"
import {useAppDispatch, useAppSelector} from "../store"
import {useEffect, useState} from "react"
import {setCurrentTab} from "../reducers/navigation"
import {Lesson} from "../model/lesson"
import {getLesson} from "../service/lesson"
import {BilingualTitle} from "../components/BilingualTitle"
import {LearnLesson} from "../components/LearnLesson"
import {Quiz} from "../model/quiz"
import {generateQuizzes} from "../service/quiz"
import { SelectWordLesson } from "../components/SelectWord"

enum LessonStatus {
  LEARNING, QUIZ, DONE
}

export const LessonPage = () => {
  const dispatch = useAppDispatch()
  const id = "1"
  const [lesson, setLesson] = useState<Lesson|undefined>()
  const [quizes, setQuizes] = useState<Quiz[]>([])
  const [status, setStatus] = useState<LessonStatus>(LessonStatus.LEARNING)

  useEffect(() => {
    //@ts-ignore
    dispatch(setCurrentTab({title: 'Lesson'}))
    // Fetch lessons from the API or local storage
    getLesson(id).then(lesson => {
      setLesson(lesson)
      const quizzes = generateQuizzes(lesson)
      console.log("Quizzes: ", quizzes)
      setQuizes(quizzes)
    }).catch(err => {
      alert("Error fetching lessons. DB may be not available")
    })
  }, [])

  const startQuiz = () => {
    setStatus(LessonStatus.QUIZ)
  }

  return (
    <IonContent className="ion-no-padding" style={{display: "flex", flexDirection: "column", height: "100%"}}>
      <BilingualTitle ro={"Lecția " + id} eng={"Lesson "+id} />
      {status === LessonStatus.LEARNING && <>
        <LearnLesson lesson={lesson} onVideoEnd={startQuiz} />
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: ".5rem"}}>
          <IonButton onClick={startQuiz} style={{margin: "1em"}}>Start Quiz</IonButton>
        </div>
      </>}
      {status === LessonStatus.QUIZ && lesson && (
        <SelectWordLesson
          lesson={lesson}
          onComplete={() => setStatus(LessonStatus.QUIZ)} // TODO: handle completion
        />
      )}

    </IonContent>
  )
}