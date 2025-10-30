import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ children, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {children}
    </svg>
);

export const DhozziLogo: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <defs>
        <linearGradient id='logoGradient' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor='var(--color-primary-start)' />
            <stop offset='100%' stopColor='var(--color-primary-end)' />
        </linearGradient>
    </defs>
    <path fillRule='evenodd' clipRule='evenodd' d='M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C9.34448 20 7.02553 18.7214 5.63784 16.8113C6.51659 15.421 7 13.7858 7 12C7 10.2142 6.51659 8.57898 5.63784 7.18868C7.02553 5.27863 9.34448 4 12 4Z' fill='url(#logoGradient)'/>
  </svg>
);

export const DhollaPayIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <clipPath id="dhollaClip">
                <circle cx="12" cy="12" r="10" />
            </clipPath>
        </defs>
        <circle cx="12" cy="12" r="10" fill="#82C2F9"/>
        <circle cx="8" cy="8" r="10" fill="#1A294A" clipPath="url(#dhollaClip)" />
    </svg>
);

export const UserIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></IconWrapper>;
export const ImagenIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></IconWrapper>;
export const DownloadIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></IconWrapper>;
export const VeoIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.357-.466.557-.327l5.603 3.112z" /></IconWrapper>;
export const GlobeIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.916 17.916 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></IconWrapper>;
export const XCircleIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;
export const SpeakerWaveIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></IconWrapper>;
export const StopCircleIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" /></IconWrapper>;
export const PencilIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></IconWrapper>;
export const MapPinIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></IconWrapper>;
export const CheckIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></IconWrapper>;
export const ShieldIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></IconWrapper>;
export const DhozziProIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15-3.75h1.5m12 0h1.5M8.25 21v-1.5M12 4.5v-1.5m3.75 15h-1.5m-3.75-15h1.5m-1.5 15h1.5M12 21v-1.5m0-15V3" /><path d="M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0" /></IconWrapper>;
export const SparklesIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.471-1.471L12.969 18l1.188-.648a2.25 2.25 0 011.471-1.471L16.25 15l.648 1.188a2.25 2.25 0 011.471 1.471L19.531 18l-1.188.648a2.25 2.25 0 01-1.471 1.471z" /></IconWrapper>;
export const StarIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.324l5.584.426a.563.563 0 01.31.958l-4.118 3.984a.563.563 0 00-.182.557l1.285 5.385a.563.563 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.54a.563.563 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.118-3.984a.563.563 0 01.31-.958l5.584-.426a.563.563 0 00.475-.324L11.48 3.5z" /></IconWrapper>;
export const PlusIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></IconWrapper>;
export const FolderIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></IconWrapper>;
export const MessageSquareIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.257c-1.056.074-1.987.836-2.232 1.865l-.332 1.292c-.252 1.034-1.246 1.7-2.33 1.52l-3.355-.447c-1.034-.138-1.943-.754-2.34-1.688l-1.928-4.63c-.457-1.099.308-2.356 1.536-2.356h1.259c.777 0 1.48.447 1.824 1.125l1.628 2.894c.342.608 1.02.99 1.734.99h1.343c1.11 0 2.022-.882 2.124-1.992l.332-3.645c.083-.913-.418-1.778-1.22-2.132l-4.04-1.728c-1.03-.44-1.523-1.57-1.1-2.65l1.79-4.329c.42-1.016 1.48-1.688 2.585-1.688h2.554c.957 0 1.81.592 2.18 1.458l2.115 4.23z" /></IconWrapper>;
export const ChevronDownIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></IconWrapper>;
export const ChevronLeftIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></IconWrapper>;
export const LogOutIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></IconWrapper>;
export const SettingsIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></IconWrapper>;
export const MoreHorizontalIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></IconWrapper>;
export const LightbulbIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-7.5 0C4.505 20.995 2.25 18.257 2.25 15c0-1.35.225-2.652.63-3.868M21.75 9.132c.405 1.216.63 2.518.63 3.868 0 3.257-2.255 6-5.04 6.689m-1.5-1.125a.375.375 0 01-.75 0V3.75c0-.207.168-.375.375-.375h.008c.207 0 .375.168.375.375v8.25z" /></IconWrapper>;
export const CodeIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></IconWrapper>;
export const EyeIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></IconWrapper>;
export const EyeSlashIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" /></IconWrapper>;
export const CreditCardIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></IconWrapper>;
export const DhozziChatIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></IconWrapper>;
export const DhozziUltraIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.25 8.25 0 0112 21 8.25 8.25 0 018.638 5.214m-2.234 2.234A8.25 8.25 0 013 12a8.25 8.25 0 015.404-7.952m10.192 0A8.25 8.25 0 0121 12a8.25 8.25 0 01-5.404 7.952M12 12a3 3 0 100-6 3 3 0 000 6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v.01M12 21v-.01M21 12h-.01M3 12h.01M5.636 5.636l-.01.01M18.364 18.364l-.01.01M5.636 18.364l-.01-.01M18.364 5.636l-.01-.01" /></IconWrapper>;
export const DhozziVisionIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M12 12m-3.75 0a3.75 3.75 0 107.5 0 3.75 3.75 0 10-7.5 0" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 4.142-7.5 6.75-7.5 6.75S4.5 16.142 4.5 12 7.858 5.25 12 5.25s7.5 2.608 7.5 6.75z" /></IconWrapper>;
export const DhozziCodeIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></IconWrapper>;
export const DalleIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.25 14.25M9.75 3.104a2.25 2.25 0 014.5 0v5.714a2.25 2.25 0 00.5 1.591L18.75 14.25M12 15.75h.008v.008H12v-.008z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18M3 21h18" /></IconWrapper>;
export const MidjourneyIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75L12 7.5M12 3.75L14.47 5.25M12 3.75L9.53 5.25M12 7.5L14.47 5.25M12 7.5L9.53 5.25m4.522 1.48a9 9 0 10-9.044 0M16.5 21L12 17.25M12 17.25L7.5 21M12 17.25V12" /></IconWrapper>;
export const AlphaCodeIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L7.5 21l2.25-9.75H3.75z" /></IconWrapper>;
export const DhozziFinanceIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517l2.74-1.22m0 0l-3.94-3.94m3.94 3.94l-3.94 3.94" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 6.75h-15v10.5h15V6.75z" /></IconWrapper>;
export const DhozziLegalIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-6.75-9H18.75M5.25 6H3m18 0h-2.25M5.25 18H3m18 0h-2.25" /><path d="M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0" /></IconWrapper>;
export const DhozziScienceIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 12a2.25 2.25 0 00-2.25-2.25H6.375a2.25 2.25 0 00-2.25 2.25v3.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125v-3.375z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12h3.375a2.25 2.25 0 012.25 2.25v3.375c0 .621-.504 1.125-1.125 1.125h-2.25c-.621 0-1.125-.504-1.125-1.125v-3.375z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12V6.375a2.25 2.25 0 012.25-2.25h3.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-3.375A2.25 2.25 0 0112 9.75V12z" /></IconWrapper>;
export const AudioIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12-9l-3 3m0 0l-3-3m3 3v12" /></IconWrapper>;
export const MusicIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 19.22a2.25 2.25 0 01-1.07-1.916V9.01M9 9V4.5M9 9l-3 1.5M15 5.25l3 1.5M15 5.25V2.25" /></IconWrapper>;
export const BusinessIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6m-6 4.5h6M6.75 21v-2.25a2.25 2.25 0 012.25-2.25h6a2.25 2.25 0 012.25 2.25V21" /></IconWrapper>;
export const GameIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 3.126L18 12M6 12l-2.25-1.5M18 12l2.25-1.5m-12 3.75l-2.25 1.5m16.5 0l2.25 1.5M12 18.75l-2.25-1.5M12 18.75l2.25-1.5" /><path d="M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0" /></IconWrapper>;
export const ThreeDIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25m9 5.25l9-5.25" /></IconWrapper>;
export const EducationIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M12 12m-3.75 0a3.75 3.75 0 107.5 0 3.75 3.75 0 10-7.5 0" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-3.75m-6.428-2.571a6 6 0 1112.857 0M12 21a6 6 0 00-6.428-5.321" /></IconWrapper>;
export const HealthIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></IconWrapper>;
export const LifestyleIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214C14.734 4.545 13.921 4.028 13.05 3.763L12 3.313l-.01.002-.01-.002-1.04 1.456c-.96.678-2.128 1.05-3.35 1.05-2.78 0-5.04-2.26-5.04-5.04 0-1.222.43-2.338 1.14-3.212" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></IconWrapper>;
export const PhoneIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></IconWrapper>;
export const BookOpenIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></IconWrapper>;

export const PaperAirplaneIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);
export const PaperClipIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.735l-7.662 7.662a4.5 4.5 0 01-6.364-6.364l7.662-7.662a3 3 0 014.242 4.242l-6.101 6.101a1.5 1.5 0 01-2.121-2.121l4.586-4.586" /></IconWrapper>;
export const VideoCameraIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" /></IconWrapper>;
export const CaptionsIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 5.25h7.5m-7.5 3H12m-3.75 3h7.5M3 3h18v18H3V3z" /></IconWrapper>;
export const XIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></IconWrapper>;

// --- Dhozzi Group Icons ---
export const GalaIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" {...props}>
        <style>
            {`.gala-text { font-family: 'Inter', sans-serif; font-size: 48px; font-weight: bold; fill: white; }`}
        </style>
        <text x="0" y="45" className="gala-text">Gala</text>
        <circle cx="175" cy="32" r="12" fill="#f43f5e"/>
    </svg>
);
export const CassiIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 100 85" xmlns="http://www.w3.org/2000/svg" {...props}>
        <style>
            {`.cassi-text { font-family: 'Inter', sans-serif; font-size: 18px; font-weight: bold; fill: #e9d5ff; text-anchor: middle; letter-spacing: 3px; }`}
        </style>
        <defs>
            <filter id="cassi-neon-glow-filter" x="-0.5" y="-0.5" width="2" height="2">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <linearGradient id="cassi-diamond-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e9d5ff"/>
                <stop offset="100%" stopColor="#c084fc"/>
            </linearGradient>
        </defs>
        <g filter="url(#cassi-neon-glow-filter)">
            <g transform="translate(50, 28) rotate(45)">
                <path d="M 0,-22 L 22,0 0,22 -22,0 Z" strokeWidth="2.5" stroke="url(#cassi-diamond-grad)" fill="none" />
                <path d="M 0,-22 L 22,0 0,22 -22,0 Z" fill="#c084fc" fillOpacity="0.15" />
                <line x1="0" y1="-22" x2="0" y2="22" stroke="white" strokeWidth="1.5"/>
            </g>
            <text
                x="50"
                y="75"
                className="cassi-text"
            >
                CASSI
            </text>
        </g>
    </svg>
);
export const MicpocIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 220 50" xmlns="http://www.w3.org/2000/svg" {...props}>
        <style>
            {`.micpoc-text { font-family: 'Inter', sans-serif; font-size: 30px; font-weight: bold; }`}
        </style>
        {/* Colorful blocks */}
        <rect x="5" y="18" width="12" height="12" fill="#a78bfa" rx="2"/>
        <rect x="5" y="32" width="12" height="12" fill="#a78bfa" rx="2"/>
        <rect x="20" y="18" width="12" height="26" fill="#facc15" rx="2"/>
        <rect x="35" y="5" width="12" height="39" fill="#fb923c" rx="2"/>
        <rect x="50" y="32" width="12" height="12" fill="#4ade80" rx="2"/>
        {/* Text */}
        <text x="75" y="40" className="micpoc-text">
            <tspan fill="#4ade80">M</tspan>
            <tspan fill="#a78bfa">I</tspan>
            <tspan fill="#fb923c">C</tspan>
            <tspan fill="#f472b6">P</tspan>
            <tspan fill="#38bdf8">O</tspan>
            <tspan fill="#facc15">C</tspan>
        </text>
    </svg>
);


export default IconWrapper;