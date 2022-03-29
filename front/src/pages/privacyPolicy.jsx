import React from 'react';
import { EntryPage } from './style';
import EntryCard from '../components/EntryCard';

/**
 * Placeholder page for privacy policy.
 * @returns {JSX.Element}
 */
function privacyPolicy() {
  return (
    <EntryPage>
      <EntryCard>
        <h2 style={{ fontFamily: 'Halyard' }}>Privacy Policy placeholder</h2>
      </EntryCard>
    </EntryPage>
  );
}

export default privacyPolicy;
