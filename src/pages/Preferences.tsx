import { useAppDispatch, useAppSelector } from '../store';
import { preferencesSelector, setPreferences } from '../reducers/preferences';
import { useEffect, useState } from 'react';
import { setCurrentTab } from '../reducers/navigation';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRange,
  IonToggle,
} from '@ionic/react';
import { useDarkMode } from '../hooks/useDarkMode';
import { savePreferencesToStorage } from '../storage/preferences';

export const Preferences = () => {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector(preferencesSelector);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    dispatch(setCurrentTab({ title: 'Preferences' }));
  }, []);

  const setDarkMode = (darkMode: boolean) => {
    if (darkMode !== isDarkMode) {
      toggleDarkMode();
    }
    setPreference('darkMode', darkMode);
    savePreferencesToStorage({ ...preferences, darkMode }).then(r =>
      console.log('Saved preferences')
    );
  };

  const setPreference = (key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    dispatch(setPreferences(newPreferences));
    savePreferencesToStorage(newPreferences).then(r => console.log('Saved preferences'));
  };

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
    </IonContent>
  );
};
