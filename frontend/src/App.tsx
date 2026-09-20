import React from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import { BrowserRouter } from 'react-router-dom';

import { AiAssistantProvider } from '@/components/ui/support/AiAssistant';
import {AuthRoutes} from '@/routes/AuthRoutes';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <BrowserRouter>
      <AiAssistantProvider>
        <AuthRoutes />
      </AiAssistantProvider>
    </BrowserRouter>
  </IonApp>
);

export default App;