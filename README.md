# Todo Card - Stage 1

An interactive, stateful Todo Card component built with Vanilla JS and CSS.

## Enhancements from Stage 0

- **Edit Mode**: Full form to edit title, description, priority, and due date.
- **Status Management**: Synchronized status transitions between checkbox and a new status dropdown control.
- **Priority Indicators**: Strong visual cues (left border accent and colored badges) that update dynamically.
- **Expand/Collapse**: Accessible description section that collapses for long content.
- **Granular Timing**: Real-time updates showing "Due in X hours/minutes" or "Overdue by X hours/minutes".
- **Enhanced Accessibility**: Improved ARIA attributes, focus management, and keyboard navigation.
- **Responsive Design**: Mobile-first layout that stacks form fields and adapts to various screen sizes.

## Design Decisions

- **State-Driven Rendering**: The component now uses a `render()` pattern to ensure the UI stays in sync with the underlying data.
- **Left Border Accent**: Used as a high-visibility priority indicator, keeping the card's surface clean while providing clear status at a glance.
- **Glassmorphism**: Maintained the backdrop-filter and subtle borders for a modern, "alive" feel.
- **Focus Management**: Focus is programmatically moved to the first input when entering edit mode and returned to the edit button when saving/cancelling.

## Accessibility Notes

- **ARIA Attributes**: Uses `aria-expanded` and `aria-controls` for the collapsible section.
- **Live Regions**: The time remaining element uses `aria-live="polite"` to announce updates to screen readers.
- **Semantic HTML**: Uses `<article>`, `<header>`, `<time>`, and proper `<label>` associations for all form fields.
- **SR-Only Labels**: Hidden labels provide context for icon buttons and status controls without cluttering the visual UI.

## Responsive Behavior

- **Mobile (320px - 480px)**: Card takes full width, border-radius is removed for a "sheet" look, and edit form fields stack vertically.
- **Tablet (768px)**: Increased padding and wider max-width.
- **Desktop (1024px+)**: Form fields and meta info may align horizontally to utilize space efficiently.

## Known Limitations

- **Browser Support**: Uses `backdrop-filter` and `-webkit-line-clamp`, which are widely supported in modern browsers but may have fallbacks in older ones.
- **Form Validation**: Basic `required` attribute on the title; more complex validation could be added in future stages.
