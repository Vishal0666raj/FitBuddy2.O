import React, { memo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
function LineProgress({ data, dataKey='volume', color='#ff6a3d', xKey='label' }){
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false}/>
        <XAxis dataKey={xKey} tick={{fill:'#9aa1ad', fontSize: 12}} interval="preserveStartEnd"/>
        <YAxis tick={{fill:'#9aa1ad', fontSize: 12}} width={42}/>
        <Tooltip contentStyle={{background:'#111319', border:'1px solid rgba(255,255,255,.1)', borderRadius: 12}} labelStyle={{color:'#fff'}}/>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{r:3, stroke:color, fill:'#111'}} activeDot={{r:5}}/>
      </LineChart>
    </ResponsiveContainer>
  );
}
export default memo(LineProgress);
