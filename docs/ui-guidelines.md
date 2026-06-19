# UI Guidelines

This document defines the UI standards and conventions for the todo app.

## Design System

- Use [Material Design](https://m3.material.io/) as the foundational design system for components, spacing, color, and typography.

## Buttons

- Only two button variants are allowed: **primary** and **secondary**.
- Buttons must be implemented as reusable React components to ensure visual consistency across the app.
- Use the primary button for the main action on a screen (e.g., "Add Task", "Save").
- Use the secondary button for supporting or destructive actions (e.g., "Cancel", "Delete").

## Feedback & Notifications

- All action results (success, error, warning) must be communicated through toast notifications — avoid inline alerts or modal dialogs for transient feedback.
- Toasts should auto-dismiss after a reasonable timeout (e.g., 3–5 seconds).
- Error toasts should persist until dismissed by the user.

## Layout & Spacing

- Use Material Design's 8-point grid system for spacing and sizing.
- Maintain consistent padding inside cards and list items (16px recommended).

## Typography

- Follow Material Design type scale (Display, Headline, Title, Body, Label).
- Do not mix more than two font families.

## Color

- Define a primary and secondary color in the theme; avoid hardcoding colors outside the theme configuration.
- Ensure sufficient contrast ratios (WCAG AA minimum) for all text on backgrounds.

## Accessibility

- All interactive elements must have descriptive `aria-label` attributes when the label is not visible.
- Keyboard navigation must be fully supported across all interactive components.
- Avoid relying solely on color to convey meaning (e.g., pair color with an icon or text).

## Icons

- Use a single icon library consistently throughout the app (e.g., Material Icons).
- Icons used alongside text should be decorative (`aria-hidden="true"`); standalone icons must have an accessible label.
