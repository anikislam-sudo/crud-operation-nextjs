"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ItemForm({ onNewItem }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create item');
      }

      const newItem = await response.json();
      setName('');  // Reset the input field
      toast.success('Your item is added successfully!');

      // Call the onNewItem callback to update the list without refreshing
      if (onNewItem) {
        onNewItem(newItem);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to add item: ' + err.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-4 flex items-center justify-center space-x-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name"
          className="p-2 border rounded w-full sm:w-64"
        />
        <Button type="submit">Add Item</Button>
       
      </form>
      {error &&  <p className="text-red-500 mt-2"> <br />{error}</p>}
    
      
    </>
  );
}