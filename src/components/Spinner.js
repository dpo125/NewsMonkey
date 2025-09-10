import React, { Component } from 'react'
import loading from'./loading.gif'


export class Spinner extends Component {
  render() {
    return (
      <div className='text-center'>
        <img className='my-3' src={loading} alt="loading" color='black' />
      </div>
    )
  }
}

export default Spinner
