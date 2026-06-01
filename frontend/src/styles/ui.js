import styled, { css } from 'styled-components';
export const Container = styled.div`
  width:100%; max-width:1280px; margin:0 auto; padding: 20px clamp(14px,3vw,28px);
`;
export const Glass = styled.div`
  background:${p=>p.theme.colors.surface};
  border:1px solid ${p=>p.theme.colors.border};
  backdrop-filter: blur(14px);
  border-radius:${p=>p.theme.radii.lg};
  box-shadow:${p=>p.theme.shadow.card};
`;
export const Card = styled(Glass)`
  padding: clamp(14px,2.4vw,22px);
`;
export const Row = styled.div`
  display:flex; gap:${p=>p.gap||'12px'}; flex-wrap:${p=>p.wrap||'wrap'};
  align-items:${p=>p.align||'center'}; justify-content:${p=>p.justify||'flex-start'};
`;
export const Grid = styled.div`
  display:grid; gap:${p=>p.gap||'14px'};
  grid-template-columns: repeat(${p=>p.cols||1}, minmax(0,1fr));
  @media (min-width:640px){ grid-template-columns: repeat(${p=>p.sm||p.cols||2}, minmax(0,1fr)); }
  @media (min-width:960px){ grid-template-columns: repeat(${p=>p.md||p.sm||p.cols||3}, minmax(0,1fr)); }
  @media (min-width:1200px){ grid-template-columns: repeat(${p=>p.lg||p.md||p.sm||p.cols||4}, minmax(0,1fr)); }
`;
export const Btn = styled.button`
  display:inline-flex; align-items:center; gap:8px;
  border:1px solid ${p=>p.theme.colors.border}; background:${p=>p.theme.colors.surface2};
  color:${p=>p.theme.colors.text};
  padding: ${p=>p.size==='sm'?'8px 12px':'12px 18px'};
  min-height: ${p=>p.size==='sm'?'36px':'44px'}; // touch friendly
  border-radius:${p=>p.theme.radii.md}; font-weight:600; cursor:pointer;
  transition: transform .15s ease, background .2s ease, border-color .2s;
  &:hover{ background:rgba(255,255,255,.1) }
  &:active{ transform: translateY(1px) }
  ${p=>p.variant==='primary' && css`
    background: linear-gradient(135deg, ${p.theme.colors.primary}, ${p.theme.colors.primary2});
    border:none; color:#fff; box-shadow:${p.theme.shadow.glow};
  `}
  ${p=>p.variant==='ghost' && css` background:transparent; `}
  ${p=>p.variant==='danger' && css` background:rgba(239,68,68,.15); border-color:rgba(239,68,68,.3); color:#fecaca; `}
  &:disabled{ opacity:.5; cursor:not-allowed }
`;
export const Input = styled.input`
  width:100%; min-height:44px; padding:10px 14px; border-radius:12px;
  background:${p=>p.theme.colors.bg2}; border:1px solid ${p=>p.theme.colors.border};
  color:${p=>p.theme.colors.text}; outline:none; font-size:15px;
  &:focus{ border-color:${p=>p.theme.colors.primary}; box-shadow:0 0 0 3px rgba(255,106,61,.18) }
`;
export const Select = styled.select`
  width:100%; min-height:44px; padding:10px 14px; border-radius:12px;
  background:${p=>p.theme.colors.bg2}; border:1px solid ${p=>p.theme.colors.border};
  color:${p=>p.theme.colors.text}; outline:none; font-size:15px;
`;
export const Label = styled.label`
  display:block; font-size:12px; text-transform:uppercase; letter-spacing:.08em;
  color:${p=>p.theme.colors.muted}; margin-bottom:6px;
`;
export const H1 = styled.h1` font-family:'Space Grotesk'; font-size: clamp(26px,4vw,38px); margin:0; letter-spacing:-.02em; `;
export const H2 = styled.h2` font-family:'Space Grotesk'; font-size: clamp(20px,2.6vw,26px); margin:0; `;
export const Sub = styled.p` color:${p=>p.theme.colors.muted}; margin:6px 0 0; font-size:14px; `;
export const Pill = styled.span`
  display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px;
  background:${p=>p.theme.colors.surface2}; border:1px solid ${p=>p.theme.colors.border};
  font-size:12px; color:${p=>p.theme.colors.muted};
`;
export const Divider = styled.hr` border:0; border-top:1px solid ${p=>p.theme.colors.border}; margin:16px 0; `;
