import classNames from 'classnames'
import Button from 'components/button'
import React from 'react'
import CallComponent from '.'
import css from './style.module.scss'

const CallLayout = () => {
    return (
        <div className={css.callLayout}>
            <div className="row m-0 justify-content-center align-items-center" style={{ flex: 1 , maxHeight : `${innerHeight - 90}px` , overflow : 'auto' }}>
            <div className="col-12">
            <CallComponent />
            </div>
            </div>

            <div className="row m-0 justify-content-center">
                <div className="col-12">
                    <div className={css.control__group}>
                        <Button
                            className={classNames("", {
                                error: false,
                            })}
                        >
                            <i className={`bi bi-mic${false ? "-mute" : ""}`}></i>
                        </Button>
                        <Button
                            className={classNames("", {
                                error: false
                            })}
                        >
                            <i
                                className={`bi bi-camera-video${false ? "-off" : ""
                                    }`}></i>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CallLayout