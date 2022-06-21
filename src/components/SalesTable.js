import React, {useState,useEffect} from 'react'
import sales from '../jsons/sales.json'
import moment from 'moment'

const SalesTable = ({selectedFranchisee,selectedLocation,locations,date}) => {
  const [salesRows, setSalesRows] = useState([])
  const [filteredOn, setFilteredOn] = useState('none')


  useEffect(() => {
    let rows = []
    if(selectedFranchisee ==='placeholder' && selectedLocation === 'placeholder'){
      setSalesRows(sales)
      setFilteredOn('none')
    }
    else if(selectedFranchisee ==='placeholder' && selectedLocation !== 'placeholder'){
      rows = sales.filter((sale) => {
        return sale.location_id === selectedLocation
      })
      setSalesRows(rows)
      setFilteredOn('location')
    }
    else if(selectedFranchisee !=='placeholder' && selectedLocation === 'placeholder'){
      rows = sales.filter((sale) => {
        return sale.franchisee_id === selectedFranchisee
      })
      setSalesRows(rows)
      setFilteredOn('franchisee')
    }
    else{
      rows = sales.filter((sale) => {
        return (sale.franchisee_id === selectedFranchisee && sale.location_id === selectedLocation)
      })
      setSalesRows(rows)
      setFilteredOn('both')
    }
  },[selectedFranchisee,selectedLocation,date])

  const renderRows = () => {
    console.log(date._d)
    if(filteredOn==='franchisee' || filteredOn==='none' || filteredOn==='location' ){
      let locationObject = {}
      let franchiseeTotal = 0
      locations.forEach((location) => {
        // THIS IS WHERE I NEED TO FILTER BASED ON THE SELECTED DATE
        let salesAtLocation = salesRows.filter(row => location._id===row.location_id)
        let totalSales = salesAtLocation.reduce((accumulator, curValue) => accumulator + Number(curValue.subtotal), 0)
        console.log(moment(date._d).isSame(salesAtLocation[0].date))
        console.log(moment(date._d).format('DDMMYYYY'))
        console.log(moment(salesAtLocation[0].date).format('DDMMYYYY'))
        console.log(salesAtLocation[0].date)
        totalSales = Math.round(totalSales * 100) / 100
        locationObject[location.name] = {subtotal: totalSales, fee:Math.round(totalSales*0.1 * 100) / 100}
        franchiseeTotal+=totalSales
      })
      locationObject['Total'] = {subtotal: Math.round(franchiseeTotal), fee:Math.round(franchiseeTotal*0.1 * 100) / 100}
      let locationsList = Object.keys(locationObject)
      return locationsList.map((locationName) => {
        if(locationName==='Total'){
          return <div key='Total'><strong>Location: {locationName} -  Subtotal: ${locationObject[locationName]['subtotal']} - Fee: ${locationObject[locationName]['fee']}</strong></div>
        }
        return <div key={locationName}>Location: {locationName} -  Subtotal: ${locationObject[locationName]['subtotal']} - Fee: ${locationObject[locationName]['fee']}</div>
      })
    }
    else{
      // THIS IS WHERE I NEED TO FILTER BASED ON THE SELECTED DATE
      let salesAtLocation = salesRows.filter(row => selectedLocation===row.location_id)
      let totalSales = salesAtLocation.reduce((accumulator, curValue) => accumulator + Number(curValue.subtotal), 0)
      totalSales = Math.round(totalSales * 100) / 100
      return(
        <div key='Total'><strong> Subtotal: ${totalSales} - Fee: ${Math.round(totalSales * 0.1 * 100) / 100}</strong></div>
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
