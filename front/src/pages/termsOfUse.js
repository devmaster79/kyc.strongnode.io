import React from 'react';
import { EntryPage } from './style';
import EntryCard from '../components/EntryCard';

/**
 * Placeholder page for terms of use.
 * @returns {JSX.Element}
 */
function termsOfUse() {
    return (<EntryPage>
        <EntryCard>
            <h2 style={{ fontFamily: 'Halyard' }}>Terms of Use placeholder</h2>
        </EntryCard>
    </EntryPage>);
}

export default termsOfUse;
