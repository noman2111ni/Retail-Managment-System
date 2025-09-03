import React from 'react'
import ProductsTable from './ProductsTable'
import { Outlet } from 'react-router-dom'

const POS = () => {

  return (
    <>
      <ProductsTable />
      <Outlet />
    </>
  )
}

export default POS