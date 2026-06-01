import React from 'react';
import styled, { keyframes } from 'styled-components';
const spin = keyframes`to{transform:rotate(360deg)}`;
const Wrap = styled.div` min-height:60vh; display:grid; place-items:center; `;
const Dot = styled.div`
  width:36px; height:36px; border-radius:50%;
  border:3px solid rgba(255,255,255,.1); border-top-color:${p=>p.theme.colors.primary};
  animation: ${spin} .8s linear infinite;
`;
export default function Loading(){ return <Wrap><Dot/></Wrap>; }
