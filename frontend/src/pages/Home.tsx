/**
 * @file        Home.tsx
 * @description Placeholder landing page. Not used by the current routes
 *              but kept as a scaffold target.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-18
 * @updated     2026-09-28
 * @version     1.0.0
 */

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
//import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Home;
