import React from 'react'
import { PricingTable } from '@clerk/nextjs'
import Header from '../_components/Header'

function Pricing() {
  return (
    <div>
    <div>
        <Header/>
    </div>
    <div className='mt-20 bg-green-200'>
        <h2 className=' my-5 font-bold text-center text-3xl'>AI Based Agri Advisor System! Pick Your Plan Here!</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            
        <PricingTable />
        </div>
    </div>
    </div>
  )
}

export default Pricing
