import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
const Wrap = styled.div`
  overflow-x:auto; padding:8px 2px 4px; -webkit-overflow-scrolling: touch;
`;
const Grid = styled.div`
  display:grid; grid-auto-flow: column; grid-template-rows: repeat(7, 14px);
  gap:4px; min-width: max-content;
`;
const Cell = styled.div`
  width:14px; height:14px; border-radius:3px; background:${p=>p.$c};
  @media (min-width:640px){ width:16px; height:16px; }
`;
function shade(v){
  if (!v) return 'rgba(200,200,200,.3)';
  if (v < 1) return 'rgba(255,106,61,.25)';
  if (v < 2) return 'rgba(255,106,61,.5)';
  if (v < 3) return 'rgba(255,106,61,.75)';
  return '#ff3d7f';
}
function ActivityHeatmap({ since, map, weeks = 17 }){
  const cells = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const total = weeks * 7;
    const startDate = new Date(today); startDate.setDate(startDate.getDate() - total + 1);
    const d0 = new Date(startDate); d0.setDate(d0.getDate() - d0.getDay());
    return Array.from({length: total}).map((_, i) => {
      const d = new Date(d0.getTime()); 
      d.setDate(d.getDate() + i);
      const k = d.toISOString().slice(0,10);
      return { k, v: map?.[k] || 0 };
    });
  }, [map, weeks]);
  return (
    <Wrap>
      <Grid>
        {cells.map(c => <Cell key={c.k} title={`${c.k}: ${c.v.toFixed(1)}`} $c={shade(c.v)}/>)}
      </Grid>
    </Wrap>
  );
}
export default memo(ActivityHeatmap);
