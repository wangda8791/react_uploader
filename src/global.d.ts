declare const module: { hot: { accept: () => void } }

interface IconProps {
  color?: string
  className?: string
  size?: number
  onClick?: () => void
}

type FCProps = {
  className?: string
  value?: string | null
  onChange?: (url: string | null | undefined) => void
}
type FC<T = {}> = React.FC<Readonly<T & FCProps>>
