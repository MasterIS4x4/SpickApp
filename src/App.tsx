import {
  IonApp,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Redirect, Route } from 'react-router-dom'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css' */
import '@ionic/react/css/palettes/dark.class.css'
// import '@ionic/react/css/palettes/dark.system.css'

/* Theme variables */
import './theme.css'

import { Layout } from './Layout'
import { Test } from './pages/Test'
import { LessonsPage } from './pages/LessonsPage'
import { useAppDispatch, useAppSelector } from './store'
import { useEffect } from 'react'
import { Preferences } from './pages/Preferences'
import { useDarkMode } from './hooks/useDarkMode'
import { initialPreferences, preferencesSelector, setPreferences } from './reducers/preferences'
import { getPreferencesFromStorage } from './storage/preferences'
import { LessonPage } from './pages/LessonPage'
import { getLessonsFromStorage, saveLessonsToStorage } from './storage/lessons'
import { getLessonQuizIndex, getLessons, updateLessonsState } from './service/lesson'
import { lessonsSelector, setLessons, setLessonsWithQuizzes } from './reducers/lessons'
import { LessonsState } from './model/states'

setupIonicReact()

const App = () => {
  const dispatch = useAppDispatch()
  const lessonsState = useAppSelector(lessonsSelector)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  useEffect(() => {
    getPreferencesFromStorage()
      .then(preferences => {
        if (preferences.darkMode !== isDarkMode) toggleDarkMode()
        dispatch(setPreferences(preferences))
      })
      .catch(err => {
        console.error('Error fetching preferences', err)
        dispatch(setPreferences(initialPreferences))
      })
    getLessonsFromStorage()
      .then(oldLessons => {
        // merge local storage lessons with the ones from the server
        getLessons()
          .then(newLessons => {
            const updated = updateLessonsState(oldLessons, newLessons)
            dispatch(setLessons(updated))
          })
          .catch(() => {
            dispatch(setLessons(oldLessons))
          })
      })
      .catch(() => {
        // if local storage lessons are not available, fetch from server
        getLessons()
          .then(lessons => {
            dispatch(setLessonsWithQuizzes(lessons))
          })
          .catch(err => {
            console.error('Error fetching lessons', err)
          })
      })
  }, [])

  useEffect(() => {
    if (!lessonsState || !lessonsState.lessons || lessonsState.lessons.length === 0)
      getLessons()
        .then(lessons => {
          dispatch(setLessonsWithQuizzes(lessons))
        })
        .catch(err => {
          console.error('Error fetching lessons', err)
        })
    saveLessonsToStorage(lessonsState)
      .then(() => console.log('Saved lessons', lessonsState))
      .catch(err => console.error('Error saving lessons', err))
  }, [lessonsState])

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Layout>
            <Route exact path={basePath} render={() => <Redirect to={basePath + 'lessons'} />} />
            <Route exact path={basePath + 'lessons'} component={LessonsPage} />
            <Route exact path={basePath + 'lessons/:id'} component={LessonPage} />
            <Route exact path={basePath + 'preferences'} component={Preferences} />
            <Route exact path={basePath + 'test'} component={Test} />

            {/* Catch-all route to redirect to home */}
            <Route path="*" render={() => <Redirect to={basePath + 'lessons'} />} />
          </Layout>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
export const basePath = import.meta.env.BASE_URL
