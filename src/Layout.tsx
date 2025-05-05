import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useAppSelector } from './store'
import { navigationSelector } from './reducers/navigation'
import { basePath } from './App'
import { InstallAppButton } from './components/InstallAppButton'
import { bookOutline, flaskOutline, optionsOutline, play } from 'ionicons/icons'
import { lessonsSelector } from './reducers/lessons'
import { getFirstNextLesson } from './service/lesson'

const MenuEntry = ({
  title,
  path,
  icon,
  menu = 'left-menu',
}: {
  title: string
  path: string
  icon: string
  menu?: string
}) => (
  <IonItem
    button
    routerLink={path}
    routerDirection="root"
    detail={false}
    lines="none"
    className={[location.pathname === path ? 'selected' : '', 'ion-margin-end'].join(' ')}
    style={{
      border: '1px solid var(--ion-color-dark)',
      borderRadius: '.65em',
      marginBottom: '0.5em',
      marginLeft: '2px',
    }}
  >
    <IonIcon icon={icon} slot="start" />
    <IonLabel>{title}</IonLabel>
  </IonItem>
)

export const Layout = ({ children }) => {
  const navigationState = useAppSelector(navigationSelector)
  const lessonsState = useAppSelector(lessonsSelector)
  const nextLesson = getFirstNextLesson(lessonsState)

  return (
    <>
      <IonMenu menuId="left-menu" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonImg
              slot="start"
              src={basePath + 'spickapp-small.png'}
              style={{ width: 'auto', height: 40, marginLeft: '1em' }}
            />
            <IonTitle>SpickApp</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonMenuToggle menu="left-menu" autoHide={false}>
            {nextLesson && (
              <IonButton
                color="success"
                routerLink={basePath + 'lessons/' + nextLesson.lessonId}
                className="ion-padding-end ion-margin-bottom"
                style={{
                  width: '100%',
                  paddingRight: '1em',
                  paddingTop: '0.5em',
                }}
              >
                <IonIcon slot="start" icon={play} />
                <IonLabel>{nextLesson.text} Lesson</IonLabel>
              </IonButton>
            )}
            <IonList style={{ marginBottom: '.5em' }}>
              <MenuEntry title="Lessons" path={basePath + 'lessons'} icon={bookOutline} />
              <MenuEntry
                title="Preferences"
                path={basePath + 'preferences'}
                icon={optionsOutline}
              />
              {/*<MenuEntry title="Test" path={basePath + 'test'} icon={flaskOutline} />*/}
            </IonList>
            <InstallAppButton />
          </IonMenuToggle>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>{navigationState.title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {children}
      </IonPage>
    </>
  )
}
