// Small set of inline SVG icons that Aurexo's own source keeps inline (not <img src=".svg">)
// because their stroke color needs to follow CSS (e.g. dark-mode / theme overrides) — see the
// icon rule in .claude/rules/nextjs-architecture.md. Repeated verbatim from the source markup,
// extracted into components instead of duplicated at every call site (~15+ chevrons alone).

export function ChevronDownIcon({ className, stroke = "#9FA1A4" }: { className?: string; stroke?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6.5L8 10.5L12 6.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIcon({ stroke = "#1C1C1C" }: { stroke?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8047 15.8047L21.0012 21.0012"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SignInIcon({ stroke = "#1C1C1C" }: { stroke?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 20.25C4.81594 17.1122 8.11406 15 12 15C15.8859 15 19.1841 17.1122 21 20.25"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AddListingIcon({ color = "white" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.25 12H15.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8.25V15.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CompareIcon({ stroke = "#1C1C1C" }: { stroke?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 13.5L19.5 16.5L16.5 19.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 16.5H19.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 10.5L4.5 7.5L7.5 4.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.5 7.5H4.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WishlistIcon({ stroke = "#1C1C1C" }: { stroke?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21C12 21 2.25 15.75 2.25 9.5625C2.25 8.21984 2.78337 6.93217 3.73277 5.98277C4.68217 5.03337 5.96984 4.5 7.3125 4.5C9.43031 4.5 11.2444 5.65406 12 7.5C12.7556 5.65406 14.5697 4.5 16.6875 4.5C18.0302 4.5 19.3178 5.03337 20.2672 5.98277C21.2166 6.93217 21.75 8.21984 21.75 9.5625C21.75 15.75 12 21 12 21Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseXIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.125 6.87499H5.70312C5.84081 7.41275 6.15356 7.88939 6.59207 8.22976C7.03057 8.57014 7.56989 8.75489 8.125 8.75489C8.68011 8.75489 9.21943 8.57014 9.65793 8.22976C10.0964 7.88939 10.4092 7.41275 10.5469 6.87499H16.875C17.0408 6.87499 17.1997 6.80914 17.3169 6.69193C17.4342 6.57472 17.5 6.41575 17.5 6.24999C17.5 6.08423 17.4342 5.92526 17.3169 5.80805C17.1997 5.69084 17.0408 5.62499 16.875 5.62499H10.5469C10.4092 5.08723 10.0964 4.61059 9.65793 4.27021C9.21943 3.92984 8.68011 3.74509 8.125 3.74509C7.56989 3.74509 7.03057 3.92984 6.59207 4.27021C6.15356 4.61059 5.84081 5.08723 5.70312 5.62499H3.125C2.95924 5.62499 2.80027 5.69084 2.68306 5.80805C2.56585 5.92526 2.5 6.08423 2.5 6.24999C2.5 6.41575 2.56585 6.57472 2.68306 6.69193C2.80027 6.80914 2.95924 6.87499 3.125 6.87499ZM8.125 4.99999C8.37223 4.99999 8.6139 5.0733 8.81946 5.21065C9.02502 5.348 9.18524 5.54323 9.27985 5.77163C9.37446 6.00004 9.39921 6.25138 9.35098 6.49385C9.30275 6.73633 9.1837 6.95906 9.00888 7.13387C8.83407 7.30869 8.61134 7.42774 8.36886 7.47597C8.12639 7.5242 7.87505 7.49945 7.64665 7.40484C7.41824 7.31023 7.22301 7.15001 7.08566 6.94445C6.94831 6.73889 6.875 6.49722 6.875 6.24999C6.875 5.91847 7.0067 5.60053 7.24112 5.36611C7.47554 5.13169 7.79348 4.99999 8.125 4.99999ZM16.875 13.125H15.5469C15.4092 12.5872 15.0964 12.1106 14.6579 11.7702C14.2194 11.4298 13.6801 11.2451 13.125 11.2451C12.5699 11.2451 12.0306 11.4298 11.5921 11.7702C11.1536 12.1106 10.8408 12.5872 10.7031 13.125H3.125C2.95924 13.125 2.80027 13.1908 2.68306 13.308C2.56585 13.4253 2.5 13.5842 2.5 13.75C2.5 13.9157 2.56585 14.0747 2.68306 14.1919C2.80027 14.3091 2.95924 14.375 3.125 14.375H10.7031C10.8408 14.9127 11.1536 15.3894 11.5921 15.7298C12.0306 16.0701 12.5699 16.2549 13.125 16.2549C13.6801 16.2549 14.2194 16.0701 14.6579 15.7298C15.0964 15.3894 15.4092 14.9127 15.5469 14.375H16.875C17.0408 14.375 17.1997 14.3091 17.3169 14.1919C17.4342 14.0747 17.5 13.9157 17.5 13.75C17.5 13.5842 17.4342 13.4253 17.3169 13.308C17.1997 13.1908 17.0408 13.125 16.875 13.125ZM13.125 15C12.8778 15 12.6361 14.9267 12.4305 14.7893C12.225 14.652 12.0648 14.4568 11.9701 14.2283C11.8755 13.9999 11.8508 13.7486 11.899 13.5061C11.9472 13.2636 12.0663 13.0409 12.2411 12.8661C12.4159 12.6913 12.6387 12.5722 12.8811 12.524C13.1236 12.4758 13.3749 12.5005 13.6034 12.5951C13.8318 12.6897 14.027 12.85 14.1643 13.0555C14.3017 13.2611 14.375 13.5028 14.375 13.75C14.375 14.0815 14.2433 14.3995 14.0089 14.6339C13.7745 14.8683 13.4565 15 13.125 15Z"
        fill="#1C1C1C"
      />
    </svg>
  );
}

export function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21C12 21 2.25 15.75 2.25 9.5625C2.25 8.21984 2.78337 6.93217 3.73277 5.98277C4.68217 5.03337 5.96984 4.5 7.3125 4.5C9.43031 4.5 11.2444 5.65406 12 7.5C12.7556 5.65406 14.5697 4.5 16.6875 4.5C18.0302 4.5 19.3178 5.03337 20.2672 5.98277C21.2166 6.93217 21.75 8.21984 21.75 9.5625C21.75 15.75 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
