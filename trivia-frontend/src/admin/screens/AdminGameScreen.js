import React, {useState,useEffect} from 'react'
import Header from '../components/Header'
import Button from '@mui/material/Button'
import {Dialog, DialogActions, DialogContent } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid';
import './AdminCategory.css'


const data_grid_columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'question', headerName: 'Question', width: 260 },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'subCategory', headerName: 'Sub Category', width: 130 }
];

const AdminGameScreen = () => {
  const [games,setGames] = useState([{"startTime":"2023-07-12T22:49","questions":[{"difficulty":"easy","createdAt":"2023-07-11T19:31:03.881Z","subCategory":"Maths","question":"Sample Question ... ?","answer":"3","options":["option a","option b","option c","option d"],"id":4996,"category":"Science","updatedAt":"2023-07-11T19:32:56.828Z"}],"endTime":"2023-07-15T22:49","updatedAt":"2023-07-12T01:50:47.153Z","category":"Science","createdAt":"2023-07-12T01:50:47.153Z","difficulty":"medium","id":7985,"name":"ABC"}])
  const [questions,setQuestions] = useState([{"question": "Sample Question ... ?","subCategory":"Maths","updatedAt":"2023-07-11T19:32:56.828Z","category":"Science","createdAt":"2023-07-11T19:31:03.881Z","options":["option a","option b","option c","option d"],"difficulty":"easy","id":4996,"answer":"3"}])
  const [filteredQuestions,setFilteredQuestions] = useState([])
  const [categories,setCategories] = useState([{"createdAt":"2023-07-11T19:45:24.609Z","id":2227,"subCategories":[{"name":"Maths"},{"name":"Physics"}],"name":"Science","updatedAt":"2023-07-11T19:45:24.609Z"},{"createdAt":"2023-07-11T18:21:39.415Z","id":3382,"subCategories":[{"name":"Code smell"},{"name":"Git"}],"name":"Software Development","updatedAt":"2023-07-11T18:21:39.415Z"}])
  const [selectedQuestions,setSelectedQuestions] = useState([])
  // const [questions,setQuestions] = useState([])
  // const [categories,setCategories] = useState([])
  const [newGameName,setNewGameName] = useState("")
  const [newCategory,setNewCategory] = useState("")
  const [newDifficultyLevel,setNewDifficultyLevel] = useState("easy")
  const [newDescription,setNewDescription] = useState("")
  const [startTime,setStartTime] = useState("")
  const [endTime,setEndTime] = useState("")
  const [selectedId,setSelectedId] = useState(0)
  const [selectedCreatedAt,setSelectedCreatedAt] = useState("")

  const [open, setOpen] = useState(false)
  const [openEdit, setEditOpen] = useState(false)

    const openModel = () => {
      setOpen(true)
      var filtered_question_list = []
      questions.forEach((question)=>{
        if(categories[0].name == question.category){
          filtered_question_list.push(question)
        }
      })
      setFilteredQuestions(filtered_question_list)
    };

    const closeModel = () => {
      setNewGameName("")
      setNewCategory("")
      setNewDifficultyLevel("easy")
      setNewDescription("")
      setFilteredQuestions([])
      setOpen(false)
    };

    const openEditModel = (item) => {
      setNewGameName(item.name)
      setSelectedId(item.id)
      setSelectedCreatedAt(item.createdAt)
      setNewCategory(item.category)
      setNewDifficultyLevel(item.difficulty)
      setNewDescription(item.description)
      setStartTime(item.startTime)
      setEndTime(item.endTime)
      var filtered_question_list = []
      questions.forEach((question)=>{
        if(item.category == question.category){
          filtered_question_list.push(question)
        }
      })
      setFilteredQuestions(filtered_question_list)
      
      var selected_question_ids = []
      item.questions.forEach((question)=>{
        selected_question_ids.push(question.id)
      })
      setSelectedQuestions(selected_question_ids)

      setEditOpen(true)
    };

    const closeEditModel = () => {
      setNewGameName("")
      setSelectedCreatedAt("")
      setStartTime("")
      setEndTime("")
      setSelectedCreatedAt("")
      setNewDescription("")
      setEditOpen(false)
    };

    const createGame = () => {
      if(newGameName != ""){

        var game_questions = []
        questions.forEach((question)=>{
          if(selectedQuestions.includes(question.id)){
            game_questions.push(question)
          }
        })

        var payload = {
          name: newGameName,
          questions: game_questions,
          category: newCategory,
          difficulty: newDifficultyLevel,
          description: newDescription,
          startTime: startTime,
          endTime: endTime,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        console.log(payload)
        axios.post("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/create",payload,(res)=>{
          if(res){
            window.location.href="admin/game"
          }else {
            alert("Error occured while adding question")
          }
        })
      }else {
        alert("Invalid Inputs")
      }
      
      closeModel()
    }

    const updateGame = () => {
      if(newGameName != ""){

        var game_questions = []
        questions.forEach((question)=>{
          if(selectedQuestions.includes(question.id)){
            game_questions.push(question)
          }
        })

        var payload = {
          id: selectedId,
          name: newGameName,
          questions: game_questions,
          category: newCategory,
          difficulty: newDifficultyLevel,
          description: newDescription,
          startTime: startTime,
          endTime: endTime,
          createdAt: selectedCreatedAt,
          updatedAt: new Date()
        }

        console.log(payload)
        axios.put("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/update",payload).then((res)=>{
          if(res.data == "Updated"){
            window.location.href="/admin/game"
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

        axios.post("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/delete",payload).then((res)=>{
          if(res.data == "Deleted"){
            window.location.href="/admin/game"
          }else {
            alert("Error occured while deleting question")
          }
        })
      }else {
        alert("Invalid Inputs")
      }
    }

    const categorySelectionHandler = (e) => {
      setNewCategory(e.target.value)
      var filtered_question_list = []
      questions.forEach((question)=>{
        if(e.target.value == question.category){
          filtered_question_list.push(question)
        }
      })
      setFilteredQuestions(filtered_question_list)
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

    axios.get("https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/get").then((res)=>{
      setGames(res.data)
    }).catch((error)=>{
      console.log(error)
    })
  },[])

  return (
    <>
      <Header />
      <main className='p-4'>
        <h3>Games</h3>
        <div className='col-12 d-flex align-items-center justify-content-end'>
          <Button variant="contained" onClick={()=>openModel()}>Create Game</Button>
        </div>
        <div className='col-12 d-flex flex-wrap align-items-center justify-content-start'>
          {
            games.map((game)=>
              <div className='col-5 d-flex flex-column align-items-center p-2 m-1 category-card'>
                <h6>ID: {game.id}</h6>
                <h6>{game.name}</h6>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  {/* <ul>
                    {
                      question.options.map((item)=>
                        <li>{item}</li>
                      )
                    }
                  </ul> */}
                   <DataGrid
                      rows={game.questions}
                      columns={data_grid_columns}
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                        },
                      }}
                      pageSizeOptions={[5, 10]}
                    />
                </div>
                
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Category: {game.category}
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Difficulty: {game.difficulty}
                </div>
                {
                  game.description &&
                  <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                    Description: {game.description}
                  </div>
                }
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Start Time: {game.startTime}
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  End Time: {game.endTime}
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Create At: {game.createdAt}
                </div>
                <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                  Updated At: {game.updatedAt}
                </div>
                <div className='col-12 d-flex flex-column mt-2'>
                  <Button variant="outlined" onClick={()=>openEditModel(game)}>Edit</Button>
                  <Button className='mt-2' variant="contained" onClick={()=>deleteQuestion(game.id)}>Delete</Button>
                </div>
              </div>
            )
          }
        </div>
      </main>

      <Dialog
          open={openEdit}
          onClose={closeEditModel}
          fullWidth={true}
          maxWidth='md'
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className='d-flex align-items-center justify-content-center'
      >
        <DialogContent>
        <FormControl>
            <input className='mt-2 p-1' type="text" placeholder='Game name' value={newGameName} onChange={(e)=>setNewGameName(e.target.value)}/>

            <div className='mt-2'>
              <label for="cars">Select Category: </label>
              <select className='m-2 p-1' name="category" value={newCategory} onChange={(e)=>categorySelectionHandler(e)}>
                {
                  categories.map((category)=>
                    <option value={category.name}>{category.name}</option>
                  )
                }
              </select>
            </div>

            <div className='mt-2' style={{ height: 400, width: '100%' }}>
              {/* <DataGrid
                rows={filteredQuestions}
                columns={data_grid_columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                selectionModel={selectedQuestions}
                onSelectionModelChange={selectionChangeHandler}
              /> */}
              <DataGrid
                rows={filteredQuestions}
                columns={data_grid_columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={(newSelectedQuestions) => {
                  setSelectedQuestions(newSelectedQuestions)
                }}
                rowSelectionModel={selectedQuestions}
              />
            </div>

            <div className='mt-2'>
              <label for="answer">Difficulty Level: </label>
              <select className='m-2 p-1' name="answer" value={newDifficultyLevel} onChange={(e)=>setNewDifficultyLevel(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className='mt-2 d-flex'>
              <label>Description: </label>
              <textarea className='m-1 p-1' value={newDescription} onChange={(e)=>setNewDescription(e.target.value)}></textarea>
            </div>
            <div className='mt-2'>
              <label>Start Time: </label>
              <input className='m-1 p-1' type="datetime-local" value={startTime} onChange={(e)=>setStartTime(e.target.value)} />
            </div>
            <div className='mt-2'>
              <label>End Time: </label>
              <input className='m-1 p-1' type="datetime-local" value={endTime} onChange={(e)=>setEndTime(e.target.value)} />
            </div>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModel} style={{color: "#000"}}>Cancel</Button>
          <Button variant='contained' onClick={updateGame} autoFocus>
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
          className='d-flex align-items-center justify-content-center'
      >
        <DialogContent>
        <FormControl>
            <input className='mt-2 p-1' type="text" placeholder='Game name' value={newGameName} onChange={(e)=>setNewGameName(e.target.value)}/>

            <div className='mt-2'>
              <label for="cars">Select Category: </label>
              <select className='m-2 p-1' name="category" value={newCategory} onChange={(e)=>categorySelectionHandler(e)}>
                {
                  categories.map((category)=>
                    <option value={category.name}>{category.name}</option>
                  )
                }
              </select>
            </div>

            <div className='mt-2' style={{ height: 400, width: '100%' }}>
              {/* <DataGrid
                rows={filteredQuestions}
                columns={data_grid_columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                selectionModel={selectedQuestions}
                onSelectionModelChange={selectionChangeHandler}
              /> */}
              <DataGrid
                rows={filteredQuestions}
                columns={data_grid_columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={(newSelectedQuestions) => {
                  setSelectedQuestions(newSelectedQuestions)
                }}
                rowSelectionModel={selectedQuestions}
              />
            </div>

            <div className='mt-2'>
              <label for="answer">Difficulty Level: </label>
              <select className='m-2 p-1' name="answer" value={newDifficultyLevel} onChange={(e)=>setNewDifficultyLevel(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className='mt-2 d-flex'>
              <label>Description: </label>
              <textarea className='m-1 p-1' value={newDescription} onChange={(e)=>setNewDescription(e.target.value)}></textarea>
            </div>
            <div className='mt-2'>
              <label>Start Time: </label>
              <input className='m-1 p-1' type="datetime-local" value={startTime} onChange={(e)=>setStartTime(e.target.value)} />
            </div>
            <div className='mt-2'>
              <label>End Time: </label>
              <input className='m-1 p-1' type="datetime-local" value={endTime} onChange={(e)=>setEndTime(e.target.value)} />
            </div>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModel} style={{color: "#000"}}>Cancel</Button>
          <Button variant='contained' onClick={createGame} autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AdminGameScreen
