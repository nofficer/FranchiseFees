import React from 'react'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
const Dropdown = ({selectedValue, setSelectedValue,options,placeholder,label}) => {


  const renderOptions = () => {
    return options.map((option) => {
      return (
        <MenuItem key={option._id} value={option._id}>{option.name}</MenuItem>
      )
    })
  }

  const handleChange = (e) => {
    setSelectedValue(e.target.value)
  }

  return (
    <div>
    <Select
         labelId="demo-simple-select-label"
         id="demo-simple-select"
         value={selectedValue}
         label={label}
         onChange={handleChange}
       >
        <MenuItem key='placeholder' value='placeholder'>{placeholder}</MenuItem>
         {renderOptions()}
       </Select>
    </div>
  )
}

export default Dropdown
