# Figma Mockup Description: Signup Page

## Frame

- Desktop frame: `1440 x 1024`
- Mobile frame: `390 x 844`

## Layout

- Split layout on desktop:
  - Left panel in deep navy with XWZ LTD brand and supporting message
  - Right panel centered white signup card
- Single-column stacked layout on mobile

## Card

- Width: `520px`
- Radius: `20px`
- Soft shadow
- Padding: `32px`
- White background

## Fields

In this exact order:

1. First name
2. Last name
3. Email
4. Password
5. Role
6. Submit button

## Visual styling

- Heading: bold, dark slate, large enough to lead the page
- Labels: clear and medium weight
- Inputs: 44px to 48px height, rounded corners, light border
- Primary button: strong blue fill with white text
- Supporting text: muted gray
- Generous vertical spacing between groups

## Responsiveness

- On mobile, all fields span full width
- On desktop, first and last name sit side-by-side
- Button remains full width for a clean call to action

## Suggested palette

- Navy: `#14213D`
- Blue: `#2563EB`
- Slate text: `#0F172A`
- Muted text: `#64748B`
- Surface: `#FFFFFF`
- Background: `#F8FAFC`

## Figma build checklist

- Use Auto Layout for the entire form card
- Create reusable input component variants
- Create one role dropdown component
- Add desktop and mobile constraints
- Keep the final frame visually aligned with the implemented React page
