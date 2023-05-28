import Button, { ButtonProps } from 'components/button'
import React from 'react'

type Props = {
  className?: string,
  style?: React.CSSProperties
  children: React.ReactElement
  buttonProps?: ButtonProps
}

const DropDown = ({ className="", style = {}, children, buttonProps }: Props) => {
  return (
    <div className={`dropup ${className}`} style={style}>
      <Button id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" {...buttonProps}>
        {buttonProps?.render ? buttonProps?.render() : null}
      </Button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
      {children}
      </div>
    </div>
  )
}

export default DropDown
