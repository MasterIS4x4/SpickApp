import { useEffect, useRef, useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '../store';
import { preferencesSelector, setIsAppInstalled } from '../reducers/preferences';

export const InstallAppButton = () => {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector(preferencesSelector);
  const [isVisible, setIsVisible] = useState(!preferences.isAppInstalled);
  const installPromptRef = useRef(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported in this browser.');
      return;
    }

    // use media query to check if the app is already installed
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    if (mediaQuery.matches || preferences.isAppInstalled) {
      console.log('App is already installed.');
      setIsVisible(false);
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setIsVisible(true);
      installPromptRef.current = e;
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      dispatch(setIsAppInstalled(true)); // note: save to storage is not called because maybe the user will uninstall the app and we won't know
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const onInstallClick = () => {
    if (installPromptRef.current) {
      installPromptRef.current.prompt();
      installPromptRef.current.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          setIsVisible(false);
        } else {
          console.log('User dismissed the A2HS prompt');
        }
      });
    }
  };

  return (
    <IonButton
      color="primary"
      className="ion-margin-end"
      onClick={onInstallClick}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <IonIcon slot="start" icon={downloadOutline} />
      Download
    </IonButton>
  );
};
