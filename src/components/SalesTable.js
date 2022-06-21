import React, {useState,useEffect} from 'react'
import sales from '../jsons/sales.json'
import moment from 'moment'

const SalesTable = ({selectedFranchisee,selectedLocation,locations,date}) => {
  const [salesRows, setSalesRows] = useState([])
  const [filteredOn, setFilteredOn] = useState('none')


  useEffect(() => {
    let rows = []
    // If no filtering has been done set the rows to be all the sales
    if(selectedFranchisee ==='placeholder' && selectedLocation === 'placeholder'){
      setSalesRows(sales)
      setFilteredOn('none')
    }
    // If location has been filtered perform that filtering then set the rows
    else if(selectedFranchisee ==='placeholder' && selectedLocation !== 'placeholder'){
      rows = sales.filter((sale) => {
        return sale.location_id === selectedLocation
      })
      setSalesRows(rows)
      setFilteredOn('location')
    }
    // If franchise has been filtered perform that filtering then set the rows
    else if(selectedFranchisee !=='placeholder' && selectedLocation === 'placeholder'){
      rows = sales.filter((sale) => {
        return sale.franchisee_id === selectedFranchisee
      })
      setSalesRows(rows)
      setFilteredOn('franchisee')
    }
    // If both have been filtered then perform the filtering and set the rows
    else{
      rows = sales.filter((sale) => {
        return (sale.franchisee_id === selectedFranchisee && sale.location_id === selectedLocation)
      })
      setSalesRows(rows)
      setFilteredOn('both')
    }
  },[selectedFranchisee,selectedLocation,date])


  const renderRows = () => {
    // If the filtering is only franchisee or only location or none then we will render the rows by location, only the locations which correspond to a selected franchisee or obviously the one location that has been selected will be fed to the sales table component. So the for loop will only calculate on and render those locations
    if(filteredOn==='franchisee' || filteredOn==='none' || filteredOn==='location' ){
      let locationObject = {}
      let franchiseeTotal = 0
      locations.forEach((location) => {
        // Filter the sales so that we can reduce and sum the total sales which correspond to each location
        let salesAtLocation = salesRows.filter(row => (location._id===row.location_id && moment(row.date).format('DDMMYYYY')===moment(date).format('DDMMYYYY') ))
        let totalSales = salesAtLocation.reduce((accumulator, curValue) => accumulator + Number(curValue.subtotal), 0)

        totalSales = Math.round(totalSales * 100) / 100
        locationObject[location.name] = {subtotal: totalSales, fee:Math.round(totalSales*0.1 * 100) / 100}
        franchiseeTotal+=totalSales
      })
      locationObject['Total'] = {subtotal: Math.round(franchiseeTotal*100)/100, fee:Math.round(franchiseeTotal*0.1 * 100) / 100}
      let locationsList = Object.keys(locationObject)
      // Render the locations each on their own line with subtotal and the corresponding 10% fee
      return locationsList.map((locationName) => {
        if(locationName==='Total'){
          return <div key='Total'><strong>Location: {locationName} -  Subtotal: ${locationObject[locationName]['subtotal']} - Fee: ${locationObject[locationName]['fee']}</strong></div>
        }
        return <div key={locationName}>Location: {locationName} -  Subtotal: ${locationObject[locationName]['subtotal']} - Fee: ${locationObject[locationName]['fee']}</div>
      })
    }
    else{
      // Filter the sales so that we can reduce and sum the total sales which correspond to the selected location
      let salesAtLocation = salesRows.filter(row => (selectedLocation===row.location_id && moment(row.date).format('DDMMYYYY')===moment(date).format('DDMMYYYY')))
      let totalSales = salesAtLocation.reduce((accumulator, curValue) => accumulator + Number(curValue.subtotal), 0)
      totalSales = Math.round(totalSales * 100) / 100
      return(
        <div key='Total'><strong>Location Totals: Subtotal: ${totalSales} - Fee: ${Math.round(totalSales * 0.1 * 100) / 100}</strong></div>
      )
    }
  }


  return (
    <div>
      {renderRows()}
    </div>
  )
}

export default SalesTable
