import type { LucideProps } from 'lucide-react'

type GithubIconProps = Omit<LucideProps, 'absoluteStrokeWidth'>

const hasA11yProp = (props: LucideProps) =>
  Object.keys(props).some(
    (prop) => prop.startsWith('aria-') || prop === 'role' || prop === 'title',
  )

function RectangleTerminalIcon({
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
      viewBox="0 0 512 512"
      fill={color}
      strokeWidth={strokeWidth}
      className={['lucide', className].filter(Boolean).join(' ')}
      {...(!children && !hasA11yProp(props) && { 'aria-hidden': true })}
      {...props}
    >
      <path d="M448 32H64C28.654 32 0 60.656 0 96v320c0 35.344 28.654 64 64 64h384c35.346 0 64-28.656 64-64V96c0-35.344-28.654-64-64-64ZM120 368a23.959 23.959 0 0 1-17.688-7.781c-8.953-9.782-8.296-24.969 1.469-33.907L180.484 256l-76.703-70.312c-9.765-8.938-10.422-24.126-1.469-33.907s24.141-10.406 33.907-1.468l96 88A24 24 0 0 1 240 256a24.004 24.004 0 0 1-7.781 17.688l-96 88A23.96 23.96 0 0 1 120 368Zm272 16H248c-13.25 0-24-10.75-24-24s10.75-24 24-24h144c13.25 0 24 10.75 24 24s-10.75 24-24 24Z" />
      {children}
    </svg>
  )
}

export default RectangleTerminalIcon
