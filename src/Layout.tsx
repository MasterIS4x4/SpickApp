import {
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
import { bookOutline, flaskOutline, optionsOutline } from 'ionicons/icons'

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
  <IonMenuToggle autoHide={false} menu={menu}>
    <IonItem
      button
      routerLink={path}
      routerDirection="root"
      detail={false}
      lines="none"
      className={location.pathname === path ? 'selected' : ''}
    >
      <IonIcon icon={icon} slot="start" />
      <IonLabel>{title}</IonLabel>
    </IonItem>
  </IonMenuToggle>
)

export const Layout = ({ children }) => {
  const navigationState = useAppSelector(navigationSelector)

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
          <IonList>
            <MenuEntry title="Lessons" path={basePath + 'lessons'} icon={bookOutline} />
            <MenuEntry title="Preferences" path={basePath + 'preferences'} icon={optionsOutline} />
            <MenuEntry title="Test" path={basePath + 'test'} icon={flaskOutline} />
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>{navigationState.title}</IonTitle>
            <div slot="end">
              {' '}
              <InstallAppButton />{' '}
            </div>
          </IonToolbar>
        </IonHeader>
        {children}
      </IonPage>
    </>
  )
}
