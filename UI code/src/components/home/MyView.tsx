import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import email from "../../assets/images/email.png"
import play from "../../assets/images/play.png"
import chatimg from "../../assets/images/chatimg.png"
import call from "../../assets/images/call.png"
import "react-circular-progressbar/dist/styles.css";

const percentage = 36;
const MyView = () => {
    return (
        <div className='Myview-comp'>
            <div className='MyViewmain-wrapper'>
                <div>
                    <input className='Search-input-bar' placeholder="Search" />
                </div>
                <div>
                    <select className='channel-drop-down'>
                        <option value="someOption">Channels</option>
                        <option>Channels</option>
                        <option>Channel one</option>
                        <option>Channel two</option>
                        <option>Channel three</option>
                        <option>Channel four</option>
                    </select>
                </div>
                <div>
                    <select className="Advanced-filter">
                        <option>Advanced filter</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>
                </div>
            </div>
            <div className='home1'>
                <p><b>Today</b></p>
                <div className="accordion" id="accordionExample">
                    <div>
                        <div className="accordion-item">
                            <div className="accordion-header" id="headingTwo">
                                <div>
                                    <button className="accordion-button collapsed no-color-effect no-box-shadow" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        <div className='cust-name-logo'>
                                            <img className="logo-container" src={call} alt="Call Logo" />
                                        </div>
                                        <div className='grid-container'>

                                            <div className='grid-item'>

                                                <b>Christopher</b><span>(4453456548)</span><br /> <div className='bottom-details'>09:20 Am</div>
                                            </div>
                                            <div className='grid-item'>
                                                <div className='Queue'><p>Queue<br /> <b><div className='bottom-details'>Network</div></b></p></div>
                                            </div>
                                            <div className='grid-item'>
                                                <div className='Assigned-By'><p>Assigned By <div className='bottom-details'><b>Harry</b></div></p></div>
                                            </div>
                                            <div className='grid-item'></div>
                                            <div className='grid-item'></div>
                                            <div className='grid-item'>

                                                <div className='cirbar-resbutton'>
                                                    <CircularProgressbar className='circular-process-bar ' value={percentage} text={`${percentage}%`} />

                                                    <div className='Resolved-button'>Resolved</div>
                                                </div>
                                            </div>
                                        </div>

                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id="collapseTwo" className="accordion-collapse collapse no-color-effect" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                            <div className='border-inside'>
                                <div className='cust-call-details'>
                                    <div className='call-duration-time'><p><b>Talk time</b><br /> <div className='bottom-details1'>10 min 55 sec</div></p></div>
                                    <div className='call-queue-details'><p><b>Queue wait time</b><br /><div className='bottom-details1'>02 min 02 sec</div></p></div>
                                    <div className='call-wrap-up-time'><p><b>Wrap up time</b><br /><div className='bottom-details1'>25 sec</div></p></div>
                                    <div className='call-transfer'><p><b>Transferred to</b><br /><div className='bottom-details1'>-</div></p></div>
                                </div>
                                <div className='summary-details'>
                                    <div><p>
                                        <b>Summary</b>
                                        <p>Sim has been deactivated Sim has been deactivated Sim has been deactivated Sim has been deactivated Sim has been deactivatedv Sim has been deactivated Sim has been deactivatedv</p>
                                    </p></div>
                                    <div className='record-txt'><p><b>Recording</b></p></div>
                                    <div className='record'>
                                        <img className="play" src={play} alt="play-svg Logo" />
                                        <p>01:28</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="accordion" id="accordionchat">
                    <div>
                        <div className="accordion-item">
                            <div className="accordion-header" id="headingTwo">
                                <div>
                                    <button className="accordion-button collapsed no-box-shadow" type="button" data-bs-toggle="collapse" data-bs-target="#collapsechat" aria-expanded="false" aria-controls="collapsechat">

                                        <div className='cust-name-logo'>
                                            <img className="logo-container" src={chatimg} alt="Call Logo" />
                                        </div>
                                        <div className="grid-container">
                                            <div className="grid-item">
                                                <p><b>Steve Smith</b><span>(4453456548)</span>
                                                    <div className='bottom-details'>09:20 Am</div></p>
                                            </div>
                                            <div className="grid-item">
                                                <div className='Queue'><p>Queue<br /> <b><div className='bottom-details'>Network</div></b></p></div>
                                            </div>
                                            <div className="grid-item">
                                                <div className='Assigned-By'><p>Assigned By <div className='bottom-details'><b>sam billings</b></div></p></div>
                                            </div>
                                            <div className="grid-item">
                                            </div>
                                            <div className="grid-item">
                                            </div>
                                            <div className="grid-item">
                                                <div className='cirbar-resbutton'> <CircularProgressbar className='circular-process-bar' value={percentage} text={`${percentage}%`} />
                                                    <div className='Resolved-button'>Resolved</div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div id="collapsechat" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionchat">
                            <div className='border-inside'>
                                <div className='cust-call-details'>
                                    <div className='call-duration-time'><p><b>Talk time</b><br /> <div className='bottom-details1'>10 min 55 sec</div></p></div>
                                    <div className='call-queue-details'><p><b>Queue wait time</b><br /><div className='bottom-details1'>02 min 02 sec</div></p></div>
                                    <div className='call-wrap-up-time'><p><b>Wrap up time</b><br /><div className='bottom-details1'>25 sec</div></p></div>
                                    <div className='call-transfer'><p><b>Transferred to</b><br /><div className='bottom-details1'>-</div></p></div>
                                </div>
                                <div className='summary-details'>
                                    <div><p>
                                        <b>Summary</b>
                                        <p>Sim has been deactivated Sim has been deactivated Sim has been deactivated Sim has been deactivated Sim has been deactivatedv Sim has been deactivated Sim has been deactivatedv</p>
                                    </p></div>
                                    <div className='record-txt'><p><b>Recording</b></p></div>
                                    <div className='record'>
                                        <img className="play" src={play} alt="play-svg Logo" />
                                        <p>01:28</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* accordion 3 */}

                <div className="accordion" id="accordionEmail">
                    <div>
                        <div className="accordion-item">
                            <div className="accordion-header" id="headingTwo">
                                <div>
                                    <button className="accordion-button collapsed no-color-effect no-box-shadow" type="button" data-bs-toggle="collapse" data-bs-target="#collapseemail" aria-expanded="false" aria-controls="collapseemail">
                                        <div className='cust-name-logo'>
                                            <img className="logo-container" src={email} alt="Call Logo" />

                                        </div>
                                        <div className='grid-container'>

                                            <div className='grid-item'>
                                                <b>sam curran</b><span>(4453456548)</span><br /> <div className='bottom-details'>09:20 Am</div>
                                            </div>
                                            <div className='grid-item'>
                                                <div className='Queue'><p>Queue<br /> <b><div className='bottom-details'>Network</div></b></p></div>
                                            </div>
                                            <div className='grid-item'>
                                                <div className='Assigned-By'><p>Assigned By <div className='bottom-details'><b>Brooks</b></div></p></div>
                                            </div>
                                            <div className='grid-item'></div>
                                            <div className='grid-item'></div>
                                            <div className='grid-item'>

                                                <div className='cirbar-resbutton'>
                                                    <CircularProgressbar className='circular-process-bar ' value={percentage} text={`${percentage}%`} />

                                                    <div className='Resolved-button'>Resolved</div>
                                                </div>
                                            </div>
                                        </div>

                                    </button>
                                </div>
                            </div>
                        </div>

                        <div id="collapseemail" className="accordion-collapse collapse no-color-effect" aria-labelledby="headingTwo" data-bs-parent="#accordionEmail">
                            <div className='border-inside'>
                                <div className='cust-call-details'>
                                    <div className='call-duration-time'><p><b>Talk time</b><br /> <div className='bottom-details1'>10 min 55 sec</div></p></div>
                                    <div className='call-queue-details'><p><b>Queue wait time</b><br /><div className='bottom-details1'>02 min 02 sec</div></p></div>
                                    <div className='call-wrap-up-time'><p><b>Wrap up time</b><br /><div className='bottom-details1'>25 sec</div></p></div>
                                    <div className='call-transfer'><p><b>Transferred to</b><br /><div className='bottom-details1'>-</div></p></div>
                                </div>
                                <div className='summary-details'>
                                    <div><p>
                                        <b>Summary</b>
                                        <p>Sim has been deactivated Sim has been deactivated Sim has been deactivated Sim has been deactivated Sim has been deactivatedv Sim has been deactivated Sim has been deactivatedv</p>
                                    </p></div>
                                    <div className='record-txt'><p><b>Recording</b></p></div>
                                    <div className='record'>
                                        <img className="play" src={play} alt="play-svg Logo" />
                                        <p>01:28</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyView

