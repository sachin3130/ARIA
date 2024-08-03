import React, { useState } from 'react'
import classes from './SearchBar.module.css'
import { Link } from 'react-router-dom'

const Searchbar = ({onSubmit}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(input);
  }
  return (
    <div className={classes.stickynavsearch}>
      <div className={classes.search}>
        <i class="bi bi-search"></i>
        <form onSubmit={handleSubmit}>
            <input type="text" name="query" placeholder="What do you want to listen?" onChange={(event)=>setInput(event.target.value)}></input>
        </form>
        <Link to="/camera" className={classes.button} title="Search by mood"><i class="bi bi-emoji-smile-upside-down"></i></Link>
      </div>
    </div>
  )
}

export default Searchbar
