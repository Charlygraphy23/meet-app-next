import Button from 'components/button'
import React from 'react'
import css from './style.module.scss'

class ErrorBoundary extends React.Component<React.PropsWithChildren> {
    constructor(props: React.PropsWithChildren) {
      super(props)
  
      // Define a state variable to track whether is an error or not
      this.state = { hasError: false }
    }
    static getDerivedStateFromError(error: any) {
      // Update state so the next render will show the fallback UI
  
      return { hasError: true }
    }
    componentDidCatch(error:any, errorInfo: any) {
      // You can use your own error logging service here
      console.error({ error, errorInfo })
    }
    render() {
      // Check if the error is thrown
      // @ts-expect-error
      if (this.state?.hasError) {
        // You can render any custom fallback UI
        return (
          <div className={css.errorBoundary}>
            <h1>404</h1>
            <h2>Oops, there is an error!</h2>
            <Button link="/">Back to home</Button>
          </div>
        )
      }
  
      // Return children components in case of no error
  
      return this.props?.children
    }
  }
  
  export default ErrorBoundary