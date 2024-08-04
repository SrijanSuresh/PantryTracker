'use client'
import {Camera} from "react-camera-pro";
import { useState, useEffect, useRef } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([]) // State to hold filtered items
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('') // State to hold the search query

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList) // Initialize filtered inventory
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase()) // Convert item name to lowercase
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase()) // Convert item name to lowercase
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Function to handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase() // Convert search query to lowercase
    setSearchQuery(query)
    setFilteredInventory(
      inventory.filter(({ name }) =>
        name.toLowerCase().includes(query) // Filter inventory based on search query
      )
    )
  }
  const camera = useRef(null);
  const [image, setImage] = useState(null);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>


      {/* Search Input Field */}
      <TextField
        id="search-bar"
        label="Search Item"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{
          marginBottom: 2,
          width: '32%', 
          bgcolor: 'white',
          borderRadius: '50px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#0000FF', 
              borderRadius: '50px',
            },
            '&:hover fieldset': {
              borderColor: '#0000FF', 
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0000FF', 
            },
          },
          '& .MuiInputBase-input': {
            backgroundColor: 'white', 
            borderRadius: '50px',
          },
        }}      />
    <Box display="flex" flexDirection="row" gap={2} justifyContent="center">
      {/* Camera Box */}
      <Box
        width="600px"
        height="400px"
        bgcolor="#e0e0e0"
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius="20px"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
        position="relative"
        overflow="hidden"
      >
        <Camera
          ref={camera}
          aspectRatio={4 / 3} // Adjust the aspect ratio
          facingMode="environment" // Use 'user' for front camera or 'environment' for rear camera
          numberOfCamerasCallback={(cameras) => console.log(`Number of cameras: ${cameras}`)}
          videoSourceDeviceIdCallback={(deviceId) => console.log(`Video source device ID: ${deviceId}`)}
        />
        <Box
          position="absolute"
          bottom="10px"
          display="flex"
          justifyContent="center"
          width="100%"
          px={3}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setImage(camera.current.takePhoto())}
            sx={{
              borderRadius: '50%',
              width: '50px', // Adjusted for better visibility
              height: '50px', // Adjusted for better visibility
              backgroundColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#e64a19',
              },
            }}
          >
            📷
          </Button>
        </Box>
      </Box>

      {/* Display Taken Photo */}
      {image && (
        <Box
          width="600px"
          height="400px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="20px"
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
          overflow="hidden"
        >
          <img
            src={image}
            alt="Taken photo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      )}
    </Box>

      <Box border={'1px solid #333'} borderRadius = { '20px'} bgcolor={'#93FFE8'}>
        <Box
          width="1500px"
          height="100px"
          bgcolor={'#0909FF'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}

        >
          <Typography variant={'h2'} color={'#FFFFE0'} textAlign={'center'}>
            Inventory Items
          </Typography>
          <Box ml={20}> {/* Add margin bottom for more space if needed */}
            <Button variant="contained" onClick={handleOpen}>
              Add New Item
            </Button>
          </Box>
        </Box>
  
        <Stack width={"100%"} height="500px" spacing={0.25} overflow={'auto'} borderRadius={"10px"}>
          {/* Render filteredInventory instead of inventory */}
          {filteredInventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={1}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
