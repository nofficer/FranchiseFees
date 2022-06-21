import React, { useState, useMemo, useEffect } from 'react'
import Grid from '@mui/material/Grid';

import Dropdown from './components/Dropdown'
import franchisees from './jsons/franchisees.json'
import locations from './jsons/locations.json'
import SalesTable from './components/SalesTable'
import DatePicker from './components/DatePickerComp'

import moment from 'moment'

function App() {
  const [selectedFranchisee, setSelectedFranchisee] = useState('placeholder')
  const [selectedLocation, setSelectedLocation] = useState('placeholder')
  const [selectableLocations,setSelectableLocations] = useState(locations)
  const [visibleLocations,setVisibleLocations] = useState(locations)
  const [date, setDate] = useState(new Date(moment().format()));

  const handleDateChange = (newValue) => {
    setDate(newValue.target.value);
  };

  const formatLocations = (locArray) => {
    return locArray.map((loc) => {
      return {_id:loc._id, name: loc.address}
    })
  }

  const renderFranchiseeLocations = () => {
    let franchiseeLocations = {}
    franchisees.forEach((item, i) => {
      franchiseeLocations[item._id] = item['location_ids']
    });
    return franchiseeLocations
  }

  const franchiseeLocationsObject = useMemo(() =>renderFranchiseeLocations(),[])

  useEffect(() => {
    if(selectedFranchisee!=='placeholder'){
      let filteredLocations = locations.filter((location) => {
        return franchiseeLocationsObject[selectedFranchisee].includes(location._id)
      } )
      // Need to reset the selected location to be the placeholder when the franchisee changes
      if(!franchiseeLocationsObject[selectedFranchisee].includes(selectedLocation)){
        setSelectedLocation('placeholder')
      }
      setVisibleLocations(formatLocations(filteredLocations))
      setSelectableLocations(formatLocations(filteredLocations))
    }
    else if(selectedLocation!=='placeholder'){
      let filteredLocations = locations.filter((location) => {
        return location._id === selectedLocation
      })
      setVisibleLocations(formatLocations(filteredLocations))
    }
    else{
      setVisibleLocations(formatLocations(locations))
      setSelectableLocations(formatLocations(locations))
    }
  },[selectedFranchisee,selectedLocation])


  const renderFranchisees = () => {
    return franchisees.map((franchisee) => {
      return {_id:franchisee._id, name: franchisee.first_name + " " + franchisee.last_name}
    })
  }
  const franchiseeArray = useMemo(() => renderFranchisees(),[])




  return (
    <Grid container>

    <Grid item xs={4}>
        <Dropdown label='' selectedValue={selectedFranchisee} setSelectedValue={setSelectedFranchisee} options={franchiseeArray} placeholder='Please Select a Franchisee'/>
    </Grid>
    <Grid item xs={4}>
        <Dropdown label='' selectedValue={selectedLocation} setSelectedValue={setSelectedLocation} options={selectableLocations} placeholder='Please Select a Location'/>
    </Grid>
    <Grid item xs={4}>
      <DatePicker value={date} setValue={handleDateChange} />
    </Grid>


    <Grid item xs={2}>
    </Grid>
    <Grid item xs={8}>
      <SalesTable date={date} selectedFranchisee={selectedFranchisee} selectedLocation={selectedLocation} locations={visibleLocations}/>
    </Grid>

    <Grid item xs={2}>
    </Grid>

    </Grid>
  );
}

export default App;
