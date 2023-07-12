import React, {useState,useEffect} from 'react'
import Header from '../components/Header'
import Button from '@mui/material/Button'
import {Dialog, DialogActions, DialogContent } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import axios from 'axios'
import './AdminCategory.css'

const AdminCategoryScreen = () => {
  const [categories,setCategories] = useState([{"createdAt":"2023-07-11T17:55:29.385Z","id":2227,"subCategories":[{"name":"Maths"},{"name":"dfs"}],"name":"Science","updatedAt":"2023-07-11T17:55:29.385Z"},{"createdAt":"2023-07-11T18:21:39.415Z","id":3382,"subCategories":[{"name":"Code smell"},{"name":"Git"}],"name":"Software Development","updatedAt":"2023-07-11T18:21:39.415Z"}])
  const [newCategoryName,setNewCategoryName] = useState("")
  const [newSubCategories,setNewSubCategories] = useState([])
  const [newSubCategory,setNewSubCategory] = useState("")
  const [selectedId,setSelectedId] = useState(0)
  const [selectedCreatedAt,setSelectedCreatedAt] = useState("")
  // const [deleteSubCategory,setDeleteSubCategory] = useState("")
  // const [selected,setSelected] = useState({})

  const [open, setOpen] = useState(false)
  const [openEdit, setEditOpen] = useState(false)

    const openModel = () => {
      setOpen(true)
    };

    const closeModel = () => {
      setNewSubCategory("")
      setNewSubCategories([])
      setNewCategoryName("")
      setSelectedCreatedAt("")
      setOpen(false)
    };

    const openEditModel = (item) => {
      setNewCategoryName(item.name)
      setSelectedId(item.id)
      setSelectedCreatedAt(item.createdAt)
      var sub_categories = []
      item.subCategories.map((i)=>{
        sub_categories.push(i.name)
      })
      setNewSubCategories(sub_categories)
      setEditOpen(true)
    };

    const closeEditModel = () => {
      setNewSubCategory("")
      setNewSubCategories([])
      setNewCategoryName("")
      setSelectedId(0)
      setEditOpen(false)
    };

    const addSubCategory = () => {
      var curent_sub_categories = newSubCategories
      curent_sub_categories.push(newSubCategory)
      setNewSubCategories(curent_sub_categories)
      setNewSubCategory("")
    }

    const removeSubCategory = (name) => {
      console.log(name)
      var curent_sub_categories = newSubCategories
      var new_sub_categories = []
      curent_sub_categories.map((item)=>{
        if(item != name){
          new_sub_categories.push(item)
        }
      })
      setNewSubCategories(new_sub_categories)
    }

    const createCategory = () => {
      if(newCategoryName != "" && newSubCategories.length >=1){
        var sub_categories = []
        newSubCategories.map((item)=>{
          sub_categories.push({name: item})
        })

        var payload = {
          name: newCategoryName,
          subCategories: sub_categories,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        console.log(payload)
        axios.post("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/category/create",payload).then((res)=>{
          if(res.data == "Added"){
            window.location.href="/admin/category"
          }else {
            alert("Error occured while adding category")
          }
        })
      }else {
        alert("Invalid Inputs")
      }
      
      closeModel()
    }

    const updateCategory = (id) => {
      if(newCategoryName != "" && newSubCategories.length >=1){
        var sub_categories = []
        newSubCategories.map((item)=>{
          sub_categories.push({name: item})
        })

        var payload = {
          id: selectedId,
          name: newCategoryName,
          subCategories: sub_categories,
          createdAt: selectedCreatedAt,
          updatedAt: new Date()
        }

        // console.log(payload)
        axios.put("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/category/update",payload).then((res)=>{
          if(res.data == "Updated"){
            window.location.href="/admin/category"
          }else {
            alert("Error occured while updating category")
          }
        })
      }else {
        alert("Invalid Inputs")
      }
      
      closeEditModel()
    }

    const deleteCategory = (id) => {
      if(id){
        console.log(id)
        var payload = {
          id: parseInt(id),
        }

        axios.post("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/category/delete",payload).then((res)=>{
          if(res.data == "Deleted"){
            window.location.href="/admin/category"
          }else {
            alert("Error occured while deleting category")
          }
        })
      }else {
        alert("Invalid Inputs")
      }
    }
  
  useEffect(()=>{
    axios.get("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/category/get").then((res)=>{
      console.log(res.data)
      setCategories(res.data)
    }).catch((error)=>{
      console.log(error)
    })
  },[])

  return (
    <>
      <Header />
      <main className='p-4'>
        <h3>Categories</h3>
        <div className='col-12 d-flex align-items-center justify-content-end'>
          <Button variant="contained" onClick={()=>openModel()}>Create Category</Button>
        </div>
        <div className='col-12 d-flex align-items-center justify-content-start'>
          {
            categories.map((category)=>
              <div className='col-3 d-flex flex-column align-items-center p-2 m-1 category-card'>
                <h6>ID: {category.id}</h6>
                <h6>{category.name}</h6>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  <ul>
                    {
                      category.subCategories.map((subCategory)=>
                        <li>{subCategory.name}</li>
                      )
                    }
                  </ul>
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Created At: {category.createdAt}
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Updated At: {category.updatedAt}
                </div>
                <div className='col-12 d-flex flex-column'>
                  <Button variant="outlined" onClick={()=>openEditModel(category)}>Edit</Button>
                  <Button className='mt-2' variant="contained" onClick={()=>deleteCategory(category.id)}>Delete</Button>
                </div>
              </div>
            )
          }
        </div>
      </main>

      <Dialog
          open={openEdit}
          onClose={closeEditModel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <FormControl>
            <input className='mt-2' type="text" placeholder='Category name' value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)}/>
            <div className='d-flex flex-column'>
              {
                newSubCategories.map((item)=><div>{item} <HighlightOffIcon fontSize="large" onClick={()=>removeSubCategory(item)} className='px-2' /></div>)
              }
            </div>
            <div className='mt-2'>
              <input type="text" placeholder='Sub category name' value={newSubCategory} onChange={(e)=>setNewSubCategory(e.target.value)}/> 
              <AddCircleOutlineIcon onClick={()=>{addSubCategory()}} />
            </div>

          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModel} style={{color: "#000"}}>Cancel</Button>
          <Button variant='contained' onClick={updateCategory} autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
          open={open}
          onClose={closeModel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <FormControl>
            <input className='mt-2' type="text" placeholder='Category name' value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)}/>
            <div className='d-flex flex-column'>
              {
                newSubCategories.map((item)=><div>{item} <HighlightOffIcon fontSize="large" onClick={()=>removeSubCategory(item)} className='px-2' /></div>)
              }
            </div>
            <div className='mt-2'>
              <input type="text" placeholder='Sub category name' value={newSubCategory} onChange={(e)=>setNewSubCategory(e.target.value)}/> 
              <AddCircleOutlineIcon onClick={()=>{addSubCategory()}} />
            </div>

          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModel} style={{color: "#000"}}>Cancel</Button>
          <Button variant='contained' onClick={createCategory} autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AdminCategoryScreen
