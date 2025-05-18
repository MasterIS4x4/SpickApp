import { IonRow, IonCol, IonGrid } from '@ionic/react'

export const BilingualTitle = ({ ro, eng }: { ro: string; eng: string }) => {
  // display ro in the left and eng in the right
  return (
    <div className="ion-padding">
      <IonGrid>
        <IonRow>
          <IonCol size="6" className="ion-no-padding">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <h1 color="primary" className="ion-text-left">
                {ro}
              </h1>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/900px-Flag_of_Romania.svg.png?20160520173724"
                style={{ height: '1.25em' }}
                alt="RO"
              />
            </div>
          </IonCol>
          <IonCol size="6" className="ion-no-padding">
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem',
                justifyContent: 'flex-end',
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
                style={{ height: '1.25em' }}
                alt="EN"
              />
              <h1 color="primary" style={{ textAlign: 'right' }}>
                {eng}
              </h1>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  )
}
