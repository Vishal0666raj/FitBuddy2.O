import React, { memo } from 'react';
import { Card } from '../../styles/ui';
import styled from 'styled-components';
const Title = styled.h3` margin:0 0 6px; font-family:'Space Grotesk'; font-size:18px; `;
const Sub = styled.p` margin:0 0 14px; color:${p=>p.theme.colors.muted}; font-size:13px; `;
function ChartCard({ title, subtitle, action, children }){
  return (
    <Card>
      <div style={{display:'flex', justifyContent:'space-between', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:8}}>
        <div><Title>{title}</Title>{subtitle && <Sub>{subtitle}</Sub>}</div>
        <div>{action}</div>
      </div>
      <div style={{width:'100%', height: 280}}>{children}</div>
    </Card>
  );
}
export default memo(ChartCard);
