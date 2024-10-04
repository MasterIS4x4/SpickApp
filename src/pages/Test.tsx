import {IonContent} from "@ionic/react"
import {useAppDispatch, useAppSelector} from "../store"
import {useEffect} from "react"
import {setCurrentTab} from "../reducers/navigation"

export const Test = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    //@ts-ignore
    dispatch(setCurrentTab({title: 'Test'}))
  }, [])

  return (
    <IonContent>
      <h1>Test</h1>
    </IonContent>
  )
}