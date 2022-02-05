import React from 'react';
import { StyledEntryCard } from './style';

function EntryCard({ children, ...props }) {
  return <StyledEntryCard {...props}>{children}</StyledEntryCard>;
}

export default EntryCard;
