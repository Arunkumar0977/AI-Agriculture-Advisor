import React from 'react'
import Chatbox from './_components/AgriChatBox'

import AdvisoryTimeline from './_components/AdvisoryTimeline'



function CreateAgriAdvisor() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-10'>
      <div>
            
            <Chatbox />
      </div>
      { <AdvisoryTimeline  /> }
     
    </div>
  )
}

export default CreateAgriAdvisor
