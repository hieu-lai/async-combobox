import type { LucideProps } from 'lucide-react'

type GithubIconProps = Omit<LucideProps, 'absoluteStrokeWidth'>

const hasA11yProp = (props: LucideProps) =>
  Object.keys(props).some(
    (prop) => prop.startsWith('aria-') || prop === 'role' || prop === 'title',
  )

function TypeScriptIcon({
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  className = '',
  children,
  ref,
  ...props
}: GithubIconProps) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 640 640"
      fill={color}
      strokeWidth={strokeWidth}
      className={['lucide', className].filter(Boolean).join(' ')}
      {...(!children && !hasA11yProp(props) && { 'aria-hidden': true })}
      {...props}
    >
      <path d="M112.8 96h414.4c9.3 0 16.8 7.5 16.8 16.8v414.4c0 9.3-7.5 16.8-16.8 16.8H112.8c-9.3 0-16.8-7.5-16.8-16.8V112.8c0-9.3 7.5-16.8 16.8-16.8zM345 334.3v-36.7H185.6v36.7h56.9v163.6h45.3V334.3H345zm18.1 159.3c7.3 3.7 15.9 6.5 25.9 8.4 10 1.9 20.5 2.8 31.5 2.8 10.8 0 21-1 30.7-3.1s18.2-5.4 25.5-10.1c7.3-4.7 13.1-10.9 17.4-18.4 4.3-7.5 6.4-17 6.4-28.2 0-8.1-1.2-15.2-3.7-21.3-2.5-6.1-5.9-11.5-10.5-16.3-4.6-4.8-10.1-9-16.5-12.8-6.4-3.8-13.7-7.3-21.7-10.7-5.9-2.4-11.2-4.8-15.9-7.1-4.7-2.3-8.7-4.6-11.9-7-3.2-2.4-5.8-4.9-7.6-7.5-1.8-2.6-2.7-5.7-2.7-9 0-3.1.8-5.8 2.4-8.3 1.6-2.5 3.8-4.6 6.7-6.4 2.9-1.8 6.5-3.1 10.7-4.1 4.2-1 8.9-1.5 14.1-1.5 3.7 0 7.7.3 11.9.8s8.4 1.4 12.6 2.6c4.2 1.2 8.3 2.6 12.3 4.4 4 1.8 7.7 3.8 11 6.1v-41.8c-6.8-2.6-14.3-4.5-22.4-5.8-8.1-1.3-17.4-1.9-27.9-1.9-10.7 0-20.8 1.1-30.4 3.4-9.6 2.3-18 5.8-25.2 10.7-7.2 4.9-13 11-17.2 18.5-4.2 7.5-6.3 16.5-6.3 26.9 0 13.3 3.9 24.7 11.6 34.1 7.7 9.4 19.5 17.4 35.2 23.9 6.2 2.5 11.9 5 17.3 7.4 5.4 2.4 10 4.9 13.8 7.5 3.8 2.6 7 5.4 9.2 8.5 2.2 3.1 3.4 6.6 3.4 10.5 0 2.9-.7 5.6-2.1 8-1.4 2.4-3.5 4.6-6.4 6.4-2.9 1.8-6.4 3.2-10.7 4.3-4.3 1.1-9.3 1.5-15 1.5-9.7 0-19.4-1.7-28.9-5.1-9.5-3.4-18.4-8.5-26.6-15.3v44.7z" />
      {children}
    </svg>
  )
}

export default TypeScriptIcon
