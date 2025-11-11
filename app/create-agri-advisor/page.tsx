import React from 'react'
import Chatbox from './_components/AgriChatBox'
// import AdvisoryTimeline from './_components/AdvisoryTimeline'
import Adviso from './_components/AdvisorySummary'
import AdvisorySummary from './_components/AdvisorySummary'

function CreateAgriAdvisor() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-5 p-10'>
      <div>
            
            <Chatbox />
      </div>
      <AdvisorySummary />
    </div>
  )
}

export default CreateAgriAdvisor
