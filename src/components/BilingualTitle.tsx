import { IonText, IonRow, IonCol, IonGrid, IonImg } from '@ionic/react';

export const BilingualTitle = ({ ro, eng }: { ro: string; eng: string }) => {
  // display ro in the left and eng in the right
  // TODO: add flags
  return (
    <div className="ion-padding">
      <IonGrid>
        <IonRow>
          <IonCol size="6" className="ion-no-padding">
            <h1 color="primary" className="ion-text-left">
              {ro}
            </h1>
          </IonCol>
          <IonCol size="6" className="ion-no-padding">
            <h1 color="primary" style={{ width: '100%', textAlign: 'right' }}>
              {eng}
            </h1>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};
