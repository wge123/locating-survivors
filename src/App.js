import React from 'react';
import { Amplify, API } from 'aws-amplify'; //provisions front end to speak with back end
import config from './aws-exports';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import './App.css';

Amplify.configure(config);
function App() {
  return (
    <div className="App">
      <header className="App-header">
        hello
      </header>
    </div>
  );
}

export default withAuthenticator(App);
