import React from 'react'
import { useDataContext } from '../DataContext';
function AnalyzedText() {
    const {analyzedtext}=useDataContext();
    const {inputimgurl}=useDataContext();
    const {datasetimgurl}=useDataContext();
  return (
    <div>
      {analyzedtext}
    </div>
  )
}

export default AnalyzedText
