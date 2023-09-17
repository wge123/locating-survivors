import React, {useState} from 'react'

export default function CaseViewScreen() {
    return (
        <div id='cv-container'>
            <button id='cv-back-button'>

            </button>
            <div id='cv-main-content'>
                <div className='cv-pane'>
                    <p className='cv-text'></p>
                    <p className='cv-text'></p>
                    <p className='cv-text'></p>
                    <p className='cv-text'></p>
                    <p className='cv-text'></p>
                </div>
                <div className='cv-pane'>
                    <p className='cv-text'></p>
                    <p className='cv-text'></p>
                    <p className='cv-text'></p>
                    <p className='cv-text'></p>
                </div>
                <div className='cv-pane'>
                    <div id='cv-place-holder-map'></div>
                    <button className='cv-bottom-button'>

                    </button>
                    <button className='cv-bottom-button'>
                        
                    </button>
                </div>
            </div>
        </div>
    )
}