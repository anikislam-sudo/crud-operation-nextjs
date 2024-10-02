'use client'

import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
 // Adjust the path based on your setup
import ItemForm from './ItemForm' // Adjust the path as necessary
import { Button } from '@/components/ui/button'

export default function ItemList({ initialItems }) {
  const [items, setItems] = useState(initialItems || [])
  const [error, setError] = useState('')

  const handleDelete = async (id) => {
    try {
      const response = await fetch('/api/items', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete item')
      }

      setItems(items.filter(item => item.id !== id))
      toast.error('Item deleted successfully!')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    }
  }

  const handleUpdate = async (id, newName) => {
    setError('')
    try {
      const response = await fetch('/api/items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name: newName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update item')
      }

      const updatedItem = await response.json()
      setItems(items.map(item => (item.id === id ? updatedItem : item)))
      toast.success('Item updated successfully!')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    }
  }

  // This function will handle adding a new item to the list
  const handleNewItem = (newItem) => {
    setItems([...items, newItem])
  
  }

  return (
    <div>
      <ItemForm onNewItem={handleNewItem} />
      <ToastContainer   autoClose={3000}/>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded shadow"
          >
            <span className="text-center sm:text-left">{item.name}</span>
            <div className="mt-2 sm:mt-0 flex space-x-2">
              <Button
                onClick={() => {
                  const newName = window.prompt('Enter new name:', item.name)
                  if (newName !== null) {
                    handleUpdate(item.id, newName)
                  }
                }}
                className="bg-blue-500 text-white"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
