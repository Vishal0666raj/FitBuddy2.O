import { createGlobalStyle } from 'styled-components';
export const theme = {
  colors: {
    bg: '#0b0c10', bg2: '#111319', surface: 'rgba(255,255,255,0.04)',
    surface2: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.08)',
    text: '#f3f4f6', muted: '#9aa1ad', primary: '#ff6a3d', primary2: '#ff3d7f',
    success: '#22c55e', warn: '#f59e0b', danger: '#ef4444', info: '#38bdf8',
  },
  radii: { sm: '8px', md: '14px', lg: '20px', pill: '999px' },
  shadow: { glow: '0 10px 40px -10px rgba(255,106,61,.45)', card: '0 8px 30px rgba(0,0,0,.35)' },
  bp: { sm: '480px', md: '768px', lg: '1024px', xl: '1280px' },
};
export const GlobalStyle = createGlobalStyle`
  *,*::before,*::after{box-sizing:border-box}
  html,body,#root{height:100%}
  html{ -webkit-text-size-adjust:100%; }
  body{ margin:0; font-family:Inter,system-ui,sans-serif; color:${p=>p.theme.colors.text};
    background:
      radial-gradient(1200px 600px at 80% -10%, rgba(255,61,127,.18), transparent 60%),
      radial-gradient(900px 600px at -10% 10%, rgba(255,106,61,.18), transparent 60%),
      ${p=>p.theme.colors.bg};
    overflow-x:hidden;
  }
  a{color:inherit; text-decoration:none}
  button{font-family:inherit}
  input,select,textarea{font-family:inherit}
  .display{font-family:'Space Grotesk',Inter,sans-serif; letter-spacing:-.01em}
  ::-webkit-scrollbar{width:8px;height:8px}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:8px}
`;
