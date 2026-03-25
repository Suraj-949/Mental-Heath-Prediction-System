import { HeartPulse } from 'lucide-react'

import { disclaimerText } from '../lib/mentalHealth'

const DisclaimerBanner = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 ${className}`}>
      <div className="flex items-start gap-3">
        <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-pink-300" />
        <p>{disclaimerText}</p>
      </div>
    </div>
  )
}

export default DisclaimerBanner
