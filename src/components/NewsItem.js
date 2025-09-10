import React, { Component } from 'react'

export class NewsItem extends Component {
  render() {
  let  {title,description,imageUrl,newsUrl,author,date,source}=this.props
    return (
      <div className='my-3'>
            <div className="card" >
              <div style={{display:'flex', justifyContent:'flex-end' , position:'absolute', right:'0'
              }}><span className=" badge rounded-pill bg-danger" >
                 {source}
               </span></div>
              
             <img src={!imageUrl?"https://assets1.cbsnewsstatic.com/hub/i/r/2025/08/31/5c48b38a-70ab-40e2-aaee-15ac7e6bbc55/thumbnail/1200x630/96cda73af9fa342f631b1212b0e4da4c/newsom-abbot.png":imageUrl} className="card-img-top" alt="..."/>
            <div className="card-body">
                <h5 className="card-title">{title}
                    </h5>
                <p className="card-text">{description}</p>
                <p className="card-text"><small className="text-muted">By{!author?"Unknown":author}on {new Date(date).toGMTString()}</small></p>
                <a rel="noreferrer" href={newsUrl} target='_blank' className="btn btn-sm btn-dark">Read More</a>
            </div>
            </div>
      </div>
    )
  }
}

export default NewsItem
