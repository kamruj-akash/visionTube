# **App Name**: VisionTube

## Core Features:

- Downloader Card: Display the download form, featuring a URL input and a "Get Formats" button.
- Formats Card: Display available download formats in a clear, selectable list with video/audio segmented control and download button.
- Fetch Formats: Fetch the available video and audio formats from the given URL.
- Layout Animation: Use framer-motion for the transition of the format card on user interaction with a 3D perspective shift effect.
- Crafted By footer: Footer bar showing Crafted by statement and linked social icons

## Style Guidelines:

- Background color: Deep, near-black (#0D0D0F) for a sophisticated dark mode experience.
- Card/Surface color: Semi-transparent, blurry dark gray (rgba(28, 28, 30, 0.7)) with a subtle white inner glow (border: 1px solid rgba(255, 255, 255, 0.1)) to enhance glassmorphism.
- Accent color: Vibrant, electric blue (#0A84FF) used for buttons and active states to provide clear visual cues. This is used to convey a tech and sophisticated vibe.
- Text color: Primary text white (#FFFFFF), and secondary text light gray (#8E8E93) for improved readability and visual hierarchy.
- Font: 'SF Pro' (sans-serif) to maintain consistency with the iOS and VisionOS design language and for a modern, clean aesthetic.
- Icons: Use clean, line-based `lucide-react` icons to complement the minimalist UI.
- Layout: Employ a centered layout with floating cards and fixed footer. The primary 'Downloader Card' takes center stage, with the animated 'Formats Card' sliding in from behind.
- Animation: Utilize `framer-motion` to create smooth, choreographed layout transitions, particularly for the appearance of the 'Formats Card,' enhancing user experience with 3D-like perspective shifts.