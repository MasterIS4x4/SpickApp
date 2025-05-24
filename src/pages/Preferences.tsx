import { useAppDispatch, useAppSelector } from '../store'
import { preferencesSelector, setPreferences } from '../reducers/preferences'
import { useEffect, useRef, useState } from 'react'
import { setCurrentTab } from '../reducers/navigation'
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPopover,
  IonRange,
  IonToggle,
} from '@ionic/react'
import { useDarkMode } from '../hooks/useDarkMode'
import { savePreferencesToStorage } from '../storage/preferences'
import { trashBinOutline, trashOutline } from 'ionicons/icons'
import { clearLessonsFromStorage } from '../storage/lessons'
import { getLessons } from '../service/lesson'
import { setLessons, setLessonsWithQuizzes } from '../reducers/lessons'

export const Preferences = () => {
  const dispatch = useAppDispatch()
  const preferences = useAppSelector(preferencesSelector)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  const popoverRef = useRef<HTMLIonPopoverElement>(null)
  const [isClearDataPopoverOpen, setIsClearDataPopoverOpen] = useState(false)

  useEffect(() => {
    dispatch(setCurrentTab({ title: 'Preferences' }))
  }, [])

  const setDarkMode = (darkMode: boolean) => {
    if (darkMode !== isDarkMode) {
      toggleDarkMode()
    }
    setPreference('darkMode', darkMode)
    savePreferencesToStorage({ ...preferences, darkMode }).then(r =>
      console.log('Saved preferences'),
    )
  }

  const setPreference = (key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value }
    dispatch(setPreferences(newPreferences))
    savePreferencesToStorage(newPreferences).then(r => console.log('Saved preferences'))
  }

  const clearData = async () => {
    dispatch(setLessons({ lessons: [] }))
    await clearLessonsFromStorage()
    setIsClearDataPopoverOpen(false)
  }

  return (
    <IonContent className="ion-padding">
      <IonListHeader style={{ fontSize: '1.5em' }}> Aspect </IonListHeader>
      <IonList inset>
        <IonItem>
          <IonToggle
            checked={preferences.darkMode}
            onIonChange={e => setDarkMode(e.detail.checked)}
            justify="space-between"
          >
            Dark Mode
          </IonToggle>
        </IonItem>
      </IonList>
      <IonListHeader style={{ fontSize: '1.5em' }}> Data </IonListHeader>
      <IonList inset>
        <IonItem>
          <IonLabel id="clear-label" slot="start">
            Clear progress
          </IonLabel>
          <IonPopover trigger="clear-label" triggerAction="click">
            <IonContent className="ion-padding">
              Useful in case of bugs or if you want to reset the app. All the progress will be lost.
            </IonContent>
          </IonPopover>
          <IonButton
            id="clear-button"
            onClick={() => setIsClearDataPopoverOpen(true)}
            slot="end"
            color="danger"
            style={{
              width: '2.5em',
              height: '2.5em',
              transform: 'scale(1.2)',
            }}
          >
            <IonIcon
              slot="icon-only"
              icon={trashOutline}
              style={{
                fontSize: '2em',
              }}
            />
          </IonButton>
          <IonPopover
            trigger="clear-button"
            ref={popoverRef}
            isOpen={isClearDataPopoverOpen}
            onDidDismiss={() => setIsClearDataPopoverOpen(false)}
          >
            <IonContent className="ion-padding">
              <h3>Are you sure you want to clear all your progress?</h3>
              <p>This will remove all your learned words and reset the app to its initial state.</p>
              <IonButton color="danger" onClick={clearData} style={{ width: '100%' }}>
                Yes
              </IonButton>
            </IonContent>
          </IonPopover>
        </IonItem>
      </IonList>
    </IonContent>
  )
}
