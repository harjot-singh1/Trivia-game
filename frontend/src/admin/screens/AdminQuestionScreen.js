import React, {useState,useEffect} from 'react'
import Header from '../components/Header'
import Button from '@mui/material/Button'
import {Dialog, DialogActions, DialogContent } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import axios from 'axios'
import './AdminCategory.css'

const AdminQuestionScreen = () => {
  // const [questions,setQuestions] = useState([{"createdAt":"2023-07-11T16:40:44.937Z","answer":4,"difficulty":"medium","category": "Software Development","subCategory": "Code smell","question":"Sample Question","options":["sdsd","dfvdfv","sdfd"],"id":3830,"updatedAt":"2023-07-11T16:40:44.937Z"}])
  // const [categories,setCategories] = useState([{"createdAt":"2023-07-11T17:55:29.385Z","id":2227,"subCategories":[{"name":"Maths"},{"name":"dfs"}],"name":"Science","updatedAt":"2023-07-11T17:55:29.385Z"},{"createdAt":"2023-07-11T18:21:39.415Z","id":3382,"subCategories":[{"name":"Code smell"},{"name":"Git"}],"name":"Software Development","updatedAt":"2023-07-11T18:21:39.415Z"}])
  const [questions,setQuestions] = useState([])
  const [categories,setCategories] = useState([])
  const [newQuestionName,setNewQuestionName] = useState("")
  const [newOptions,setNewOptions] = useState([])
  const [newOption,setNewOption] = useState("")
  const [newAnswer,setNewAnswer] = useState(1)
  const [newExplanation,setNewExplanation] = useState("")
  const [newCategory,setNewCategory] = useState("")
  const [newSubCategory,setNewSubCategory] = useState("")
  const [newDifficultyLevel,setNewDifficultyLevel] = useState("easy")
  const [selectedId,setSelectedId] = useState(0)
  const [selectedCreatedAt,setSelectedCreatedAt] = useState("")

  const [open, setOpen] = useState(false)
  const [openEdit, setEditOpen] = useState(false)

    const openModel = () => {
      setOpen(true)
    };

    const closeModel = () => {
      setNewOption("")
      setNewOptions([])
      setNewQuestionName("")
      setNewAnswer(1)
      setNewExplanation("")
      setNewSubCategory("")
      setNewCategory("")
      setNewDifficultyLevel("easy")
      setOpen(false)
    };

    const openEditModel = (item) => {
      setNewQuestionName(item.question)
      setSelectedId(item.id)
      setSelectedCreatedAt(item.createdAt)
      setNewOptions(item.options)
      setNewAnswer(item.answer)
      setNewExplanation(item.explanation)
      setNewCategory(item.category)
      setNewSubCategory(item.subCategory)
      setNewDifficultyLevel(item.difficulty)
      setEditOpen(true)
    };

    const closeEditModel = () => {
      setNewOption("")
      setNewOptions([])
      setNewQuestionName("")
      setSelectedId(0)
      setSelectedCreatedAt("")
      setEditOpen(false)
    };

    const addOption = () => {
      var curent_options = newOptions
      curent_options.push(newOption)
      setNewOptions(curent_options)
      setNewOption("")
    }

    const removeOption = (name) => {
      var curent_options = newOptions
      var new_options = []
      curent_options.map((item)=>{
        if(item != name){
          new_options.push(item)
        }
      })
      setNewOptions(new_options)
    }

    const createQuestion = () => {
      if(newQuestionName != "" && newOptions.length >=1){

        var payload = {
          question: newQuestionName,
          options: newOptions,
          category: newCategory,
          subCategory: newSubCategory,
          answer: parseInt(newAnswer)-1,
          explanation: newExplanation,
          difficulty: newDifficultyLevel,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        console.log(payload)
        axios.post("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/question/create",payload).then((res)=>{
          if(res.data == "Added"){
            window.location.href="/admin/question"
          }else {
            alert("Error occured while adding question")
          }
        })
      }else {
        alert("Invalid Inputs")
      }
      
      closeModel()
    }

    const updateQuestion = () => {
      if(newQuestionName != "" && newOptions.length >=1){

        var payload = {
          id: selectedId,
          question: newQuestionName,
          options: newOptions,
          category: newCategory,
          subCategory: newSubCategory,
          answer: parseInt(newAnswer)-1,
          explanation: newExplanation,
          difficulty: newDifficultyLevel,
          createdAt: selectedCreatedAt,
          updatedAt: new Date()
        }

        console.log(payload)
        axios.put("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/question/update",payload).then((res)=>{
          if(res.data == "Updated"){
            window.location.href="/admin/question"
          }else {
            alert("Error occured while updating question")
          }
        })
      }else {
        alert("Invalid Inputs")
      }
      
      closeEditModel()
    }

    const deleteQuestion = (id) => {
      if(id){
        var payload = {
          id: parseInt(id),
        }
        console.log(payload)

        axios.post("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/question/delete",payload).then((res)=>{
          if(res.data == "Deleted"){
            window.location.href="/admin/question"
          }else {
            alert("Error occured while deleting question")
          }
        })
      }else {
        alert("Invalid Inputs")
      }
    }
  
  useEffect(()=>{
    axios.get("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/question/get").then((res)=>{
      setQuestions(res.data)
    }).catch((error)=>{
      console.log(error)
    })

    axios.get("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/category/get").then((res)=>{
      setCategories(res.data)
    }).catch((error)=>{
      console.log(error)
    })
  },[])

  return (
    <>
      <Header />
      <main className='p-4'>
        <h3>Questions</h3>
        <div className='col-12 d-flex align-items-center justify-content-end'>
          <Button variant="contained" onClick={()=>openModel()}>Create Question</Button>
        </div>
        <div className='col-12 d-flex flex-wrap align-items-center justify-content-start'>
          {
            questions.map((question)=>
              <div className='col-4 d-flex flex-column align-items-center p-2 m-1 category-card'>
                <h6>ID: {question.id}</h6>
                <h6>{question.question}</h6>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  <ul>
                    {
                      question.options.map((item)=>
                        <li>{item}</li>
                      )
                    }
                  </ul>
                </div>
                
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Category: {question.category}
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Sub Category: {question.subCategory}
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Answer: {question.answer+1}
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Explanation: {question.explanation}
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Difficulty: {question.difficulty}
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Create At: {question.createdAt}
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Updated At: {question.updatedAt}
                </div>
                <div className='col-12 d-flex flex-column mt-2'>
                  <Button variant="outlined" onClick={()=>openEditModel(question)}>Edit</Button>
                  <Button className='mt-2' variant="contained" onClick={()=>deleteQuestion(question.id)}>Delete</Button>
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
            <input className='mt-2' type="text" placeholder='Question name' value={newQuestionName} onChange={(e)=>setNewQuestionName(e.target.value)}/>
            <div className='d-flex flex-column'>
              {
                newOptions.map((item,index)=><div>Option {index+1}: {item} <HighlightOffIcon fontSize="large" onClick={()=>removeOption(item)} className='px-2' /></div>)
              }
            </div>
            <div className='mt-2'>
              <input type="text" placeholder='Option' value={newOption} onChange={(e)=>setNewOption(e.target.value)}/> 
              <AddCircleOutlineIcon onClick={()=>{addOption()}} />
            </div>

            <div className='mt-2'>
              <label for="cars">Select Category: </label>
              <select name="category" value={newCategory} onChange={(e)=>{
                setNewCategory(e.target.value)
                // console.log("Category changed to: "+e.target.value)
                categories.map((item)=>{
                  if(item.name == e.target.value){
                    // console.log(item.subCategories[0].name)
                    setNewSubCategory(item.subCategories[0].name)
                    // console.log(newSubCategory)
                  }
                })
              }}>
                {
                  categories.map((category)=>
                    <option value={category.name}>{category.name}</option>
                  )
                }
              </select>
            </div>

            <div className='mt-2'>
              <label for="subCategory">Select Sub Category: </label>
                {/* {newCategory} */}
              <select name="subCategory" value={newSubCategory} onChange={(e)=>setNewSubCategory(e.target.value)}>
                {
                  categories.map((category)=> {
                    if(category.name == newCategory){
                      // setNewSubCategory(category.subCategories[0].name)
                      // console.log("Flag")
                      return (
                        category.subCategories.map((subCategory)=><option value={subCategory.name}>{subCategory.name}</option>)
                      )
                    }
                  })
                }
              </select>
            </div>

            <div className='mt-2'>
              <label for="answer">Correct Answer: </label>
              <select name="answer" value={newAnswer} onChange={(e)=>setNewAnswer(e.target.value)}>
                {
                  newOptions.map((option,index)=>
                    <option value={index+1}>{index+1}</option>
                  )
                }
              </select>
            </div>

            <div className='mt-2'>
              <label for="answer">Difficulty Level: </label>
              <select name="answer" value={newDifficultyLevel} onChange={(e)=>setNewDifficultyLevel(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModel} style={{color: "#000"}}>Cancel</Button>
          <Button variant='contained' onClick={updateQuestion} autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
          open={open}
          onClose={closeModel}
          fullWidth={true}
          maxWidth='md'
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <DialogContent>
        <FormControl>
            <input className='mt-2' type="text" placeholder='Question name' value={newQuestionName} onChange={(e)=>setNewQuestionName(e.target.value)}/>
            <div className='d-flex flex-column'>
              {
                newOptions.map((item,index)=><div>Option {index+1}: {item} <HighlightOffIcon fontSize="large" onClick={()=>removeOption(item)} className='px-2' /></div>)
              }
            </div>
            <div className='mt-2'>
              <input type="text" placeholder='Option' value={newOption} onChange={(e)=>setNewOption(e.target.value)}/> 
              <AddCircleOutlineIcon onClick={()=>{addOption()}} />
            </div>

            <div className='mt-2'>
              <label for="categories">Select Category: </label>
              <select name="category" value={newCategory} onChange={(e)=>setNewCategory(e.target.value)}>
                {
                  categories.map((category)=>
                    <option value={category.name}>{category.name}</option>
                  )
                }
              </select>
            </div>

            <div className='mt-2'>
              <label for="categories">Select Sub Category: </label>
                {/* {newCategory} */}
              <select name="subCategory" onChange={(e)=>setNewSubCategory(e.target.value)}>
                {
                  categories.map((category)=> {
                    if(category.name == newCategory){
                      return (
                        category.subCategories.map((subCategory)=><option value={subCategory.name}>{subCategory.name}</option>)
                      )
                    }
                  })
                }
              </select>
            </div>


            <div className='mt-2'>
              <label for="answer">Correct Answer: </label>
              <select name="answer" value={newAnswer} onChange={(e)=>setNewAnswer(e.target.value)}>
                {
                  newOptions.map((option,index)=>
                    <option value={index+1}>{index+1}</option>
                  )
                }
              </select>
            </div>

            <textarea className='mt-2' type="text" placeholder='Question explanation' value={newExplanation} onChange={(e)=>setNewExplanation(e.target.value)}></textarea>

            <div className='mt-2'>
              <label for="answer">Difficulty Level: </label>
              <select name="answer" value={newDifficultyLevel} onChange={(e)=>setNewDifficultyLevel(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModel} style={{color: "#000"}}>Cancel</Button>
          <Button variant='contained' onClick={createQuestion} autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AdminQuestionScreen
