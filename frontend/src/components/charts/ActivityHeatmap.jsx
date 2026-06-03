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
    
    // Start date: go back (total-1) days from today
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (total - 1));
    
    // Align start to Sunday (go back to nearest Sunday)
    const sunday = new Date(startDate);
    sunday.setDate(sunday.getDate() - sunday.getDay());
    
    // Generate cells from Sunday to today
    const result = [];
    for (let i = 0; i < total; i++) {
      const d = new Date(sunday);
      d.setDate(d.getDate() + i);
      const k = d.toISOString().slice(0,10);
      result.push({ k, v: map?.[k] || 0 });
    }
    
    return result;
  }, [map, weeks]);
  return (
    <Wrap>
      <Grid>
        {cells && cells.length > 0 ? cells.map(c => <Cell key={c.k} title={`${c.k}: ${c.v.toFixed(1)}`} $c={shade(c.v)}/>) : <div>No cells</div>}
      </Grid>
    </Wrap>
  );
}
export default memo(ActivityHeatmap);
